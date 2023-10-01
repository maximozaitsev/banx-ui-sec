export enum AllTimeStatus {
  Repaid = 'totalRepaid',
  Defaulted = 'totalDefaulted',
}

export const ALL_TIME_COLOR_MAP: Record<AllTimeStatus, string> = {
  [AllTimeStatus.Repaid]: 'var(--additional-green-primary)',
  [AllTimeStatus.Defaulted]: 'var(--additional-red-primary)',
}

export const ALL_TIME_DISPLAY_NAMES: Record<AllTimeStatus, string> = {
  [AllTimeStatus.Repaid]: 'Total repaid',
  [AllTimeStatus.Defaulted]: 'Total defaulted',
}

export enum AllocationStatus {
  ActiveLoans = 'activeLoans',
  UnderWaterLoans = 'underWaterLoans',
  PendingOffers = 'pendingOffers',
}

export const ALLOCATION_COLOR_MAP: Record<AllocationStatus, string> = {
  [AllocationStatus.ActiveLoans]: 'var(--additional-green-primary)',
  [AllocationStatus.UnderWaterLoans]: 'var(--additional-lava-primary)',
  [AllocationStatus.PendingOffers]: 'var(--additional-blue-primary)',
}

export const ALLOCATION_DISPLAY_NAMES: Record<AllocationStatus, string> = {
  [AllocationStatus.ActiveLoans]: 'Active Loans',
  [AllocationStatus.UnderWaterLoans]: 'Underwater Loans',
  [AllocationStatus.PendingOffers]: 'Pending Offers',
}

export const EMPTY_DOUGHNUT_CHART_DATA = {
  value: [100],
  colors: ['var(--bg-secondary)'],
}

export const EMPTY_SINGLE_BAR_CHART_DATA = {
  key: 'empty',
  label: 'Empty',
  value: 100,
  color: 'var(--bg-secondary)',
}