import { FC } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'
import moment from 'moment'

import { Button } from '@banx/components/Buttons'
import EmptyList from '@banx/components/EmptyList'
import { StatInfo, VALUES_TYPES } from '@banx/components/StatInfo'
import Timer from '@banx/components/Timer'

import { Borrow, Lend, MoneyBill } from '@banx/icons'

import styles from './RewardsTab.module.less'

// TODO: need to remove it after it is added to BE
const MOCK_TOTAL_CLAIMED = 0
const MOCK_NEXT_WEEKLY_REWARDS = 1697400000
const MOCK_AVAILABLE_TO_CLAIM = 0

const RewardsTab = () => {
  return (
    <div className={styles.container}>
      <ClaimRewardsBlock
        totalClaimed={MOCK_TOTAL_CLAIMED}
        nextWeeklyRewards={MOCK_NEXT_WEEKLY_REWARDS}
        availableToClaim={MOCK_AVAILABLE_TO_CLAIM}
      />
      <RewardsInfoBlock />
    </div>
  )
}

export default RewardsTab

interface ClaimRewardsBlockProps {
  totalClaimed: number
  nextWeeklyRewards: number
  availableToClaim: number
}

const ClaimRewardsBlock: FC<ClaimRewardsBlockProps> = ({
  totalClaimed,
  nextWeeklyRewards,
  availableToClaim,
}) => {
  const { connected } = useWallet()

  const disableClaimRewards = moment().unix() < nextWeeklyRewards

  return (
    <div className={styles.claimRewardsBlock}>
      <StatInfo
        label="Total claimed"
        value={totalClaimed}
        classNamesProps={{ label: styles.claimRewardsLabel }}
        flexType="row"
      />
      <StatInfo
        label="Next weekly rewards in"
        value={<Timer expiredAt={nextWeeklyRewards} />}
        valueType={VALUES_TYPES.STRING}
        classNamesProps={{ label: styles.claimRewardsLabel }}
        flexType="row"
      />
      <AvailableToClaim availableToClaim={availableToClaim} />
      {connected ? (
        <Button disabled={disableClaimRewards} className={styles.claimRewardsButton}>
          Claim
        </Button>
      ) : (
        <EmptyList className={styles.emptyList} message="Connect wallet to see your rewards" />
      )}
    </div>
  )
}

interface AvailableToClaimProps {
  availableToClaim: number
}
const AvailableToClaim: FC<AvailableToClaimProps> = ({ availableToClaim }) => (
  <div className={styles.avaiableToClaimInfo}>
    <div className={styles.moneyBillIconWrapper}>
      <MoneyBill />
    </div>
    <StatInfo
      value={availableToClaim}
      label="Available to claim"
      classNamesProps={{
        container: styles.stat,
        value: styles.value,
        label: styles.label,
      }}
    />
  </div>
)

const RewardsInfoBlock = () => (
  <div className={styles.rewardsInfoBlock}>
    <div className={styles.rewardsInfo}>
      <span className={styles.rewardsInfoTitle}>
        <Lend /> Lender
      </span>
      <span>earn SOL APY while your competitive offers are pending in the orders books</span>
      <span>earn extra SOL APY for your active loans</span>
    </div>
    <div className={styles.rewardsInfo}>
      <span className={styles.rewardsInfoTitle}>
        <Borrow /> Borrowers
      </span>
      <span>earn SOL cashbacks for each loan you take</span>
    </div>
  </div>
)