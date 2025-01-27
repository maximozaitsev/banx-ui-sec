import { every, map, sum, values } from 'lodash'
import { useNavigate } from 'react-router-dom'

import { DoughnutChartProps } from '@banx/components/Charts'
import { DisplayValue } from '@banx/components/TableComponents'

import { PATHS } from '@banx/router'
import { buildUrlWithModeAndToken } from '@banx/store'
import { useAssetMode, useTokenType } from '@banx/store/common'
import { getTokenDecimals, isBanxSolTokenType } from '@banx/utils'

import { useLenderStats } from '../../hooks'
import {
  AllocationStatus,
  NO_DATA_CHART_DATA,
  STATUS_COLOR_MAP,
  STATUS_DISPLAY_NAMES,
} from './constants'

export const useAllocationBlock = () => {
  const { data: lenderStats } = useLenderStats()
  const { allTime: allTimeStats, allocation: allocationStats } = lenderStats || {}

  const navigate = useNavigate()
  const { tokenType } = useTokenType()

  const { currentAssetMode } = useAssetMode()

  const {
    activeLoans = 0,
    underWaterLoans = 0,
    pendingOffers = 0,
    terminatingLoans = 0,
    weeklyInterest = 0,
    weightedApy = 0,
  } = allocationStats || {}

  const allocationStatusToValueMap = {
    [AllocationStatus.Pending]: pendingOffers,
    [AllocationStatus.Active]: activeLoans,
    [AllocationStatus.Underwater]: underWaterLoans,
    [AllocationStatus.Terminating]: terminatingLoans,
  }

  const allocationData = map(allocationStatusToValueMap, (value, status) => ({
    label: STATUS_DISPLAY_NAMES[status as AllocationStatus],
    key: status,
    value,
  }))

  const totalFunds = sum(values(allocationStatusToValueMap))

  const decimals = getTokenDecimals(tokenType)

  const allocationValues = map(allocationData, ({ value }) => value / decimals)
  const isDataEmpty = every(allocationValues, (value) => value === 0)

  const chartData: DoughnutChartProps = {
    data: isDataEmpty ? NO_DATA_CHART_DATA.value : allocationValues,
    colors: isDataEmpty ? NO_DATA_CHART_DATA.colors : Object.values(STATUS_COLOR_MAP),
    statInfoProps: {
      label: 'Total funds',
      value: <DisplayValue value={totalFunds} />,
    },
  }

  const goToLendPage = () => {
    navigate(buildUrlWithModeAndToken(PATHS.LEND, currentAssetMode, tokenType))
  }

  const goToOffersPage = () => {
    navigate(buildUrlWithModeAndToken(PATHS.OFFERS, currentAssetMode, tokenType))
  }

  const emptyButtonText = isBanxSolTokenType(tokenType) ? 'Lend SOL' : 'Lend USDC'

  const buttonProps = {
    onClick: isDataEmpty ? goToLendPage : goToOffersPage,
    text: isDataEmpty ? emptyButtonText : 'Manage my offers',
  }

  return {
    allocationData,
    chartData,
    buttonProps,

    allTimeStats,

    weightedApy,
    weeklyInterest,
  }
}
