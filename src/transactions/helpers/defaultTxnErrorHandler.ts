import { captureSentryTxnError } from '@banx/utils'

import { TxnError } from '../types'
import { enqueueTxnErrorSnackbar } from './enqueueTxnErrorSnackbar'

export const defaultTxnErrorHandler = (error: TxnError) => {
  console.error(error)
  if (error?.logs) {
    console.error(error?.logs?.join('\n'))
  }
  captureSentryTxnError({ error })
  enqueueTxnErrorSnackbar(error)
}