import { web3 } from 'fbonds-core'
import { LOOKUP_TABLE } from 'fbonds-core/lib/fbond-protocol/constants'
import {
  BondAndTransactionOptimistic,
  refinancePerpetualLoan,
} from 'fbonds-core/lib/fbond-protocol/functions/perpetual'
import {
  BondOfferV2,
  BondTradeTransactionV2,
  FraktBond,
} from 'fbonds-core/lib/fbond-protocol/types'

import { Loan } from '@banx/api/core'
import { BONDS } from '@banx/constants'
import { sendTxnPlaceHolder } from '@banx/utils'

import { MakeActionFn } from '../TxnExecutor'

export interface RefinanceOptimisticResult {
  oldBondTradeTransaction: BondTradeTransactionV2
  fraktBond: FraktBond
  newBondOffer: BondOfferV2
  newBondTradeTransaction: BondTradeTransactionV2
}

export type MakeRefinanceActionParams = {
  loan: Loan
}

export type MakeRefinanceAction = MakeActionFn<MakeRefinanceActionParams, RefinanceOptimisticResult>

export const makeRefinanceAction: MakeRefinanceAction = async (
  ixnParams,
  { connection, wallet },
) => {
  const { loan } = ixnParams || {}
  const { bondTradeTransaction, fraktBond } = loan

  const { instructions, signers, optimisticResult } = await refinancePerpetualLoan({
    programId: new web3.PublicKey(BONDS.PROGRAM_PUBKEY),
    accounts: {
      fbond: new web3.PublicKey(fraktBond.publicKey),
      userPubkey: wallet.publicKey as web3.PublicKey,
      hadoMarket: new web3.PublicKey(fraktBond.hadoMarket || ''),
      protocolFeeReceiver: new web3.PublicKey(BONDS.ADMIN_PUBKEY),
      previousBondTradeTransaction: new web3.PublicKey(bondTradeTransaction.publicKey),
      previousLender: new web3.PublicKey(bondTradeTransaction.user),
    },
    optimistic: {
      fraktBond,
      bondTradeTransaction,
    } as BondAndTransactionOptimistic,
    connection,
    sendTxn: sendTxnPlaceHolder,
  })

  return {
    instructions,
    signers,
    additionalResult: optimisticResult,
    lookupTables: [new web3.PublicKey(LOOKUP_TABLE)],
  }
}