import Table from '@banx/components/Table'

import { ViewState, useTableView } from '@banx/store'

import { Summary } from './Summary'
import { getTableColumns } from './columns'
import { useHistoryLoansTable } from './hooks'

import styles from './LoansHistoryTable.module.less'

export const LoansHistoryTable = () => {
  const { loans, loading, sortViewParams } = useHistoryLoansTable()

  const { viewState } = useTableView()

  const columns = getTableColumns({ isCardView: viewState === ViewState.CARD })

  return (
    <div className={styles.tableRoot}>
      <div className={styles.tableWrapper}>
        <Table
          data={loans}
          columns={columns}
          rowKeyField="publicKey"
          sortViewParams={sortViewParams}
          loading={loading}
          showCard
        />
      </div>
      <Summary loans={loans} />
    </div>
  )
}
