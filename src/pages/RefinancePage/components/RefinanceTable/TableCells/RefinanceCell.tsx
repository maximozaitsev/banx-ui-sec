import { FC } from 'react'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import classNames from 'classnames'

import { Button } from '@banx/components/Buttons'
import { SolanaFMLink } from '@banx/components/SolanaLinks'

import { Loan } from '@banx/api/core'
import { useAuctionsLoans } from '@banx/pages/RefinancePage/hooks'
import { defaultTxnErrorHandler } from '@banx/transactions'
import { TxnExecutor } from '@banx/transactions/TxnExecutor'
import { makeRefinanceAction } from '@banx/transactions/loans'
import { enqueueSnackbar } from '@banx/utils'

import styles from '../RefinanceTable.module.less'

interface RefinanceCellProps {
  loan: Loan
  isCardView?: boolean
}

export const RefinanceCell: FC<RefinanceCellProps> = ({ loan, isCardView = false }) => {
  const refinance = useRefinanceTransaction(loan)
  const buttonSize = isCardView ? 'large' : 'small'

  return (
    <div className={styles.refinanceCell}>
      <Button onClick={refinance} size={buttonSize}>
        Refinance
      </Button>
      <SolanaFMLink
        className={classNames(styles.solanaNftButton, { [styles.isCardView]: isCardView })}
        path={`address/${loan.nft.mint}`}
        size={buttonSize}
      />
    </div>
  )
}

const useRefinanceTransaction = (loan: Loan) => {
  const wallet = useWallet()
  const { connection } = useConnection()
  const { addMints } = useAuctionsLoans()

  const refinance = () => {
    new TxnExecutor(makeRefinanceAction, { wallet, connection })
      .addTxnParam({ loan })
      .on('pfSuccessEach', (results) => {
        const { txnHash } = results[0]
        addMints(loan.nft.mint)
        enqueueSnackbar({
          message: 'Transaction Executed',
          solanaExplorerPath: `tx/${txnHash}`,
        })
      })
      .on('pfError', (error) => {
        defaultTxnErrorHandler(error)
      })
      .execute()
  }

  return refinance
}