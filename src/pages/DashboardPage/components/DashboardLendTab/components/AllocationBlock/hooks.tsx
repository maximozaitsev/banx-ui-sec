import { every, map, sum, values } from 'lodash'
import { useNavigate } from 'react-router-dom'

import { DoughnutChartProps } from '@banx/components/Charts'
import { DisplayValue } from '@banx/components/TableComponents'

import { TotalLenderStats } from '@banx/api/stats'
import { PATHS } from '@banx/router'
import { createPathWithTokenParam, useTokenType } from '@banx/store'
import { getTokenDecimals, isSolTokenType, trackPageEvent } from '@banx/utils'

import {
  AllocationStatus,
  NO_DATA_CHART_DATA,
  STATUS_COLOR_MAP,
  STATUS_DISPLAY_NAMES,
} from './constants'

export type AllocationStats = TotalLenderStats['allocation']

export const useAllocationBlock = (stats?: AllocationStats) => {
  const navigate = useNavigate()
  const { tokenType } = useTokenType()

  const {
    activeLoans = 0,
    underWaterLoans = 0,
    pendingOffers = 0,
    terminatingLoans = 0,
  } = stats || {}

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
    trackPageEvent('dashboard', 'lendtab-lend')
    navigate(createPathWithTokenParam(PATHS.LEND, tokenType))
  }
  const goToOffersPage = () => {
    trackPageEvent('dashboard', 'lendtab-manage')
    navigate(createPathWithTokenParam(PATHS.OFFERS, tokenType))
  }

  const emptyButtonText = isSolTokenType(tokenType) ? 'Lend SOL' : 'Lend USDC'

  const buttonProps = {
    onClick: isDataEmpty ? goToLendPage : goToOffersPage,
    text: isDataEmpty ? emptyButtonText : 'Manage my offers',
  }

  return {
    allocationData,
    chartData,
    buttonProps,
  }
}
