import { web3 } from 'fbonds-core'
import { EMPTY_PUBKEY, LOOKUP_TABLE } from 'fbonds-core/lib/fbond-protocol/constants'
import { getMockBondOffer } from 'fbonds-core/lib/fbond-protocol/functions/getters'
import {
  BondAndTransactionOptimistic,
  repayPartialPerpetualLoan,
} from 'fbonds-core/lib/fbond-protocol/functions/perpetual'
import { BondOfferV2, LendingTokenType } from 'fbonds-core/lib/fbond-protocol/types'
import { CreateTransactionDataFn } from 'solana-transactions-executor'

import { Loan } from '@banx/api/core'
import { BONDS } from '@banx/constants'
import { sendTxnPlaceHolder } from '@banx/utils'

import { createInstructionsWithPriorityFees } from '../helpers'

export type MakeRepayPartialLoanActionParams = {
  loan: Loan
  fractionToRepay: number //? F.E 50% => 5000
}

export type MakeRepayPartialActionResult = Loan

export type MakeRepayPartialLoanAction = CreateTransactionDataFn<
  MakeRepayPartialLoanActionParams,
  MakeRepayPartialActionResult
>

interface OptimisticResult extends BondAndTransactionOptimistic {
  oldBondOffer: BondOfferV2
}

export const makeRepayPartialLoanAction: MakeRepayPartialLoanAction = async (
  ixnParams,
  walletAndConnection,
) => {
  const { connection, wallet } = walletAndConnection

  const { loan, fractionToRepay } = ixnParams

  const { fraktBond, bondTradeTransaction, nft } = loan

  const { instructions, signers, optimisticResults } = await repayPartialPerpetualLoan({
    programId: new web3.PublicKey(BONDS.PROGRAM_PUBKEY),
    args: {
      fractionToRepay,
      optimistic: {
        fraktBond,
        bondTradeTransaction,
        oldBondOffer: getMockBondOffer(),
      } as OptimisticResult,
      lendingTokenType: LendingTokenType.NativeSOL,
    },
    accounts: {
      oldBondOffer: new web3.PublicKey(bondTradeTransaction.bondOffer),
      lender: new web3.PublicKey(bondTradeTransaction.user),
      oldBondTradeTransaction: new web3.PublicKey(bondTradeTransaction.publicKey),
      fbond: new web3.PublicKey(fraktBond.publicKey),
      userPubkey: new web3.PublicKey(wallet.publicKey || EMPTY_PUBKEY),
      protocolFeeReceiver: new web3.PublicKey(BONDS.ADMIN_PUBKEY),
    },
    connection,
    sendTxn: sendTxnPlaceHolder,
  })

  const optimisticResult = optimisticResults.map((optimistic) => ({
    publicKey: optimistic.fraktBond.publicKey,
    fraktBond: optimistic.fraktBond,
    bondTradeTransaction: optimistic.bondTradeTransaction,
    nft,
  }))[0]

  const instructionsWithPriorityFees = await createInstructionsWithPriorityFees(
    instructions,
    connection,
  )

  return {
    instructions: instructionsWithPriorityFees,
    signers,
    lookupTables: [new web3.PublicKey(LOOKUP_TABLE)],
    result: optimisticResult,
  }
}
