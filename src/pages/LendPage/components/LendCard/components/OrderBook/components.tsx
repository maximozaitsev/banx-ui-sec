import { FC } from 'react'

import Offer from '../Offer'
import { Order } from './types'

import styles from './OrderBook.module.less'

interface OrderBookListProps {
  orders: Order[]
  goToEditOrder: (orderPubkey: string) => void
  isOwnOrder: (offer: Order) => boolean
}

export const OrderBookList: FC<{ orderBookParams: OrderBookListProps }> = ({ orderBookParams }) => {
  const { orders, goToEditOrder, isOwnOrder } = orderBookParams || {}

  const renderOrder = (order: Order) => {
    return (
      <Offer
        order={order}
        loanValue={order.loanValue}
        loanAmount={order.loansAmount}
        editOffer={() => goToEditOrder(order?.rawData?.publicKey)}
        isOwnOrder={isOwnOrder(order)}
      />
    )
  }

  return <ul className={styles.list}>{orders.map(renderOrder)}</ul>
}

export const OrderBookLabel = () => (
  <div className={styles.label}>
    <span>Offers</span>
    <span>Number of loans</span>
  </div>
)

export const NoActiveOffers = () => (
  <div className={styles.noData}>
    <div className={styles.noDataTitle}>No active offers at the moment</div>
    <div className={styles.noDataSubtitle}>Good chance to be first!</div>
  </div>
)