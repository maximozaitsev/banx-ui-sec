import { FC, useMemo } from 'react'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { BondTradeTransactionV2State } from 'fbonds-core/lib/fbond-protocol/types'
import { filter, find, sumBy } from 'lodash'

import { Button } from '@banx/components/Buttons'
import { StatInfo } from '@banx/components/StatInfo'

import { Loan } from '@banx/api/core'
import { defaultTxnErrorHandler } from '@banx/transactions'
import { TxnExecutor } from '@banx/transactions/TxnExecutor'
import { makeClaimAction } from '@banx/transactions/loans'
import { enqueueSnackbar, isLoanLiquidated } from '@banx/utils'

import { useLenderLoansAndOffers } from './hooks'

import styles from './ActiveOffersTable.module.less'

interface SummaryProps {
  loans: Loan[]
}

export const Summary: FC<SummaryProps> = ({ loans }) => {
  const wallet = useWallet()
  const { connection } = useConnection()

  const { addMints } = useLenderLoansAndOffers()

  const loansToClaim = useMemo(() => {
    return loans.length ? filter(loans, isLoanAbleToClaim) : []
  }, [loans])

  const totalClaimableFloor = useMemo(() => {
    return sumBy(loansToClaim, ({ nft }) => nft.collectionFloor)
  }, [loansToClaim])

  const claimLoans = () => {
    new TxnExecutor(makeClaimAction, { wallet, connection })
      .addTxnParams(loansToClaim.map((loan) => ({ loan })))
      .on('pfSuccessEach', (results) => {
        enqueueSnackbar({
          message: 'Transaction Executed',
          solanaExplorerPath: `tx/${results[0].txnHash}`,
        })
      })
      .on('pfSuccessAll', () => {
        addMints(...loansToClaim.map(({ nft }) => nft.mint))
      })
      .on('pfError', (error) => {
        defaultTxnErrorHandler(error)
      })
      .execute()
  }

  return (
    <div className={styles.summary}>
      <div className={styles.totalLoans}>
        <p className={styles.totalLoansValue}>{loansToClaim.length}</p>
        <div className={styles.totalLoansInfo}>
          <p>Collaterals</p>
          <p>to claim</p>
        </div>
      </div>
      <div className={styles.statsContainer}>
        <StatInfo label="Total claimable floor" value={totalClaimableFloor} divider={1e9} />
      </div>
      <div className={styles.summaryBtns}>
        <Button onClick={claimLoans} disabled={!loansToClaim.length}>
          Claim all NFTs
        </Button>
      </div>
    </div>
  )
}

type ShowSummary = (loans: Loan[]) => boolean
export const showSummary: ShowSummary = (loans = []) => {
  return !!find(loans, isLoanAbleToClaim)
}

type IsLoanAbleToClaim = (loan: Loan) => boolean
export const isLoanAbleToClaim: IsLoanAbleToClaim = (loan) => {
  const { bondTradeTransactionState } = loan.bondTradeTransaction

  const isLoanActive = bondTradeTransactionState === BondTradeTransactionV2State.PerpetualActive
  const isLoanTerminating =
    bondTradeTransactionState === BondTradeTransactionV2State.PerpetualManualTerminating
  const isLoanActiveOrTerminating = isLoanActive || isLoanTerminating
  const isLoanExpired = isLoanLiquidated(loan)

  return !isLoanActiveOrTerminating || isLoanExpired
}