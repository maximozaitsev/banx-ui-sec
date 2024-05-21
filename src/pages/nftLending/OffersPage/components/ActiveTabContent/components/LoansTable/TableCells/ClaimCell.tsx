import { FC } from 'react'

import { calculateCurrentInterestSolPure } from 'fbonds-core/lib/fbond-protocol/functions/perpetual'
import moment from 'moment'

import { DisplayValue, HorizontalCell } from '@banx/components/TableComponents'

import { core } from '@banx/api/nft'
import { calculateClaimValue, calculateLentValue } from '@banx/pages/nftLending/OffersPage'
import { calcLoanBorrowedAmount } from '@banx/utils'

import styles from '../LoansTable.module.less'

interface ClaimCellProps {
  loan: core.Loan
}

export const ClaimCell: FC<ClaimCellProps> = ({ loan }) => {
  const { amountOfBonds, soldAt } = loan.bondTradeTransaction

  const loanBorrowedAmount = calcLoanBorrowedAmount(loan)

  const interestParameters = {
    loanValue: loanBorrowedAmount,
    startTime: soldAt,
    currentTime: moment().unix(),
    rateBasePoints: amountOfBonds,
  }

  const currentInterest = calculateCurrentInterestSolPure(interestParameters)
  const claimValue = calculateClaimValue(loan)
  const lentValue = calculateLentValue(loan)

  const tooltopContent = (
    <div className={styles.tooltipContainer}>
      {createTooltipContent('Lent', lentValue)}
      {createTooltipContent('Accrued interest', currentInterest)}
    </div>
  )

  return (
    <HorizontalCell tooltipContent={tooltopContent} value={<DisplayValue value={claimValue} />} />
  )
}

const createTooltipContent = (label: string, value: number) => (
  <div className={styles.tooltipContent}>
    <span>{label}</span>
    <span>
      <DisplayValue value={value} />
    </span>
  </div>
)