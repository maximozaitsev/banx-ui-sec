import { web3 } from 'fbonds-core'
import {
  BondOfferOptimistic,
  createPerpetualBondOffer,
} from 'fbonds-core/lib/fbond-protocol/functions/perpetual'
import { CreateTransactionDataFn } from 'solana-transactions-executor'

import { BONDS } from '@banx/constants'
import { PriorityLevel, createPriorityFeesInstruction } from '@banx/store'
import { sendTxnPlaceHolder } from '@banx/utils'

export type MakeCreateOfferActionParams = {
  marketPubkey: string
  loanValue: number
  loansAmount: number
  priorityFeeLevel: PriorityLevel
}

export type MakeCreateOfferAction = CreateTransactionDataFn<
  MakeCreateOfferActionParams,
  BondOfferOptimistic
>

export const makeCreateOfferAction: MakeCreateOfferAction = async (
  ixnParams,
  { connection, wallet },
) => {
  const { marketPubkey, loanValue, loansAmount, priorityFeeLevel } = ixnParams

  const { instructions, signers, optimisticResult } = await createPerpetualBondOffer({
    accounts: {
      hadoMarket: new web3.PublicKey(marketPubkey),
      userPubkey: wallet.publicKey as web3.PublicKey,
    },
    args: {
      loanValue: loanValue * 1e9,
      amountOfLoans: loansAmount,
    },
    programId: new web3.PublicKey(BONDS.PROGRAM_PUBKEY),
    connection,
    sendTxn: sendTxnPlaceHolder,
  })

  const priorityFeeInstruction = await createPriorityFeesInstruction(
    instructions,
    connection,
    priorityFeeLevel,
  )

  return {
    instructions: [...instructions, priorityFeeInstruction],
    signers,
    result: optimisticResult,
    lookupTables: [],
  }
}
