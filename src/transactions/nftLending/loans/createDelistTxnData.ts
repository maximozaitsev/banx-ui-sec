import { web3 } from 'fbonds-core'
import { EMPTY_PUBKEY, LOOKUP_TABLE } from 'fbonds-core/lib/fbond-protocol/constants'
import {
  removePerpetualListing,
  removePerpetualListingCnft,
  removePerpetualListingStakedBanx,
} from 'fbonds-core/lib/fbond-protocol/functions/perpetual'
import { getAssetProof } from 'fbonds-core/lib/fbond-protocol/helpers'
import { BondTradeTransactionV2State } from 'fbonds-core/lib/fbond-protocol/types'
import moment from 'moment'
import { CreateTxnData, WalletAndConnection } from 'solana-transactions-executor'

import { core } from '@banx/api/nft'
import { BONDS } from '@banx/constants'

import { fetchRuleset } from '../../functions'
import { sendTxnPlaceHolder } from '../../helpers'
import { ListingType } from '../types'

type CreateDelistTxnDataParams = {
  loan: core.Loan
  walletAndConnection: WalletAndConnection
}

type CreateDelistTxnData = (params: CreateDelistTxnDataParams) => Promise<CreateTxnData<core.Loan>>

export const createDelistTxnData: CreateDelistTxnData = async (params) => {
  const { loan, walletAndConnection } = params

  const listingType = getNftListingType(loan)

  const { instructions, signers } = await getIxnsAndSignersByListingType({
    params,
    type: listingType,
    walletAndConnection,
  })

  const optimisticLoan = {
    ...loan,
    bondTradeTransaction: {
      ...loan.bondTradeTransaction,
      //? Set not active state to filter out loan from list
      bondTradeTransactionState: BondTradeTransactionV2State.NotActive,
    },
    fraktBond: {
      ...loan.fraktBond,
      lastTransactedAt: moment().unix(), //? Needs to prevent BE data overlap in optimistics logic
    },
  }

  return {
    instructions,
    signers,
    result: optimisticLoan,
    lookupTables: [new web3.PublicKey(LOOKUP_TABLE)],
  }
}

const getIxnsAndSignersByListingType = async ({
  params,
  type = ListingType.Default,
  walletAndConnection,
}: {
  params: CreateDelistTxnDataParams
  type?: ListingType
  walletAndConnection: WalletAndConnection
}) => {
  const { connection, wallet } = walletAndConnection
  const { loan } = params

  if (type === ListingType.StakedBanx) {
    const ruleSet = await fetchRuleset({
      nftMint: loan.nft.mint,
      connection,
      marketPubkey: loan.fraktBond.hadoMarket,
    })

    const { instructions, signers } = await removePerpetualListingStakedBanx({
      programId: new web3.PublicKey(BONDS.PROGRAM_PUBKEY),
      accounts: {
        banxStake: new web3.PublicKey(loan.fraktBond.banxStake),
        protocolFeeReceiver: new web3.PublicKey(BONDS.ADMIN_PUBKEY),
        borrower: new web3.PublicKey(loan.fraktBond.fbondIssuer),
        userPubkey: wallet.publicKey,
        nftMint: new web3.PublicKey(loan.nft.mint),
        fraktBond: new web3.PublicKey(loan.fraktBond.publicKey),
        bondOffer: new web3.PublicKey(loan.bondTradeTransaction.bondOffer),
        oldBondTradeTransaction: new web3.PublicKey(loan.bondTradeTransaction.publicKey),
      },
      args: {
        isBorrowerListing: true,
        ruleSet,
      },
      connection,
      sendTxn: sendTxnPlaceHolder,
    })

    return { instructions, signers }
  }

  if (type === ListingType.CNft) {
    if (!loan.nft.compression) {
      throw new Error(`Not cNFT`)
    }

    const proof = await getAssetProof(loan.nft.mint, connection.rpcEndpoint)
    const ruleSet = await fetchRuleset({
      nftMint: loan.nft.mint,
      connection,
      marketPubkey: loan.fraktBond.hadoMarket,
    })

    const { instructions, signers } = await removePerpetualListingCnft({
      programId: new web3.PublicKey(BONDS.PROGRAM_PUBKEY),
      accounts: {
        userPubkey: wallet.publicKey,
        nftMint: new web3.PublicKey(loan.nft.mint),
        bondOffer: new web3.PublicKey(loan.bondTradeTransaction.bondOffer),
        oldBondTradeTransaction: new web3.PublicKey(loan.bondTradeTransaction.publicKey),
        fraktBond: new web3.PublicKey(loan.fraktBond.publicKey),
        tree: new web3.PublicKey(loan.nft.compression.tree),
      },
      args: {
        isBorrowerListing: true,
        ruleSet,
        cnftParams: loan.nft.compression,
        proof,
      },
      connection,
      sendTxn: sendTxnPlaceHolder,
    })

    return { instructions, signers }
  }

  const ruleSet = await fetchRuleset({
    nftMint: loan.nft.mint,
    connection,
    marketPubkey: loan.fraktBond.hadoMarket,
  })

  const { instructions, signers } = await removePerpetualListing({
    programId: new web3.PublicKey(BONDS.PROGRAM_PUBKEY),
    accounts: {
      protocolFeeReceiver: new web3.PublicKey(BONDS.ADMIN_PUBKEY),
      userPubkey: wallet.publicKey,
      bondOffer: new web3.PublicKey(loan.bondTradeTransaction.bondOffer),
      oldBondTradeTransaction: new web3.PublicKey(loan.bondTradeTransaction.publicKey),
      fraktBond: new web3.PublicKey(loan.fraktBond.publicKey),
      nftMint: new web3.PublicKey(loan.nft.mint),
    },
    args: {
      isBorrowerListing: true,
      ruleSet,
    },
    connection,
    sendTxn: sendTxnPlaceHolder,
  })

  return { instructions, signers }
}

const getNftListingType = (loan: core.Loan) => {
  if (!!loan.fraktBond.banxStake && loan.fraktBond.banxStake !== EMPTY_PUBKEY.toBase58()) {
    return ListingType.StakedBanx
  }

  if (loan.nft.compression) return ListingType.CNft
  return ListingType.Default
}