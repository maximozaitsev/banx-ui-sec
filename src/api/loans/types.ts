import { BondTradeTransactionV2 } from 'fbonds-core/lib/fbond-protocol/types'

export enum LoanType {
  BOND = 'bond',
}

// TODO: this is an old interface, need to replace it with another one
export interface Loan {
  pubkey: string
  loanType: LoanType

  loanValue: number //? Lamports
  repayValue: number //? Lamports

  startedAt: number //? unix timestamp

  nft: {
    mint: string
    name: string
    collectionName: string
    collectionImage: string
    imageUrl: string
  }

  bondParams: {
    marketPubkey: string
    bondTokenMint: string
    banxStake?: string

    collateralOrSolReceiver: string
    collateralTokenAccount: string
    expiredAt: number //? unix timestamp
    activeTrades: BondTradeTransactionV2[]
  }
}