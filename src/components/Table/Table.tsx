import { ColumnsType } from 'antd/es/table'
import { isEmpty } from 'lodash'

import { ViewState, useTableView } from '@banx/store'

import { Loader } from '../Loader'
import { ActiveRowParams, PartialBreakpoints, SortViewParams } from './types'
import { CardView, SortView, TableView } from './views'

import styles from './Table.module.less'

export interface TableProps<T, P> {
  data: ReadonlyArray<T>
  columns: ColumnsType<T>
  rowKeyField: keyof T
  loading?: boolean

  sortViewParams?: SortViewParams<P>
  activeRowParams?: ActiveRowParams

  showCard?: boolean
  onRowClick?: (dataItem: T) => void
  breakpoints?: PartialBreakpoints
  className?: string
}

const Table = <T extends object, P extends object>({
  data,
  columns,
  sortViewParams,
  activeRowParams,
  showCard,
  loading,
  ...props
}: TableProps<T, P>) => {
  const { viewState } = useTableView()

  const ViewComponent = showCard && ViewState.CARD === viewState ? CardView : TableView

  const noData = isEmpty(data) && !loading
  const hasData = !isEmpty(data)

  return (
    <div className={styles.container}>
      {sortViewParams && <SortView columns={columns} showCard={showCard} {...sortViewParams} />}

      {loading && <Loader />}
      {noData && <>Items not found</>}

      {hasData && (
        <ViewComponent data={data} columns={columns} activeRowParams={activeRowParams} {...props} />
      )}
    </div>
  )
}

export default Table