import { useMemo } from 'react'

import { Offer } from '@banx/api/bonds'
import { useMarketOffers } from '@banx/pages/LendPage/hooks'

import { parseMarketOrder } from './helpers'
import { Order } from './types'

type UseMarketOrders = (props: {
  marketPubkey: string
  loanValue: number
  loansAmount: number
  offerPubkey: string
}) => {
  orders: Order[]
  isLoading: boolean
  hideOffer: (offerPubkey: string) => void
}

export const useMarketOrders: UseMarketOrders = ({
  marketPubkey,
  loanValue,
  loansAmount,
  offerPubkey,
}) => {
  const { offers, isLoading, hideOffer } = useMarketOffers({ marketPubkey })

  const orders = useMemo(() => {
    if (!offers) return []

    const editOffer = offers.find((offer: Offer) => offer?.publicKey === offerPubkey)
    const editOfferPubkey = editOffer?.publicKey

    const myOrder = {
      size: loanValue * loansAmount,
      loanValue,
      loansAmount,
      synthetic: true,
      rawData: {
        publicKey: '',
        assetReceiver: '',
      },
    }

    const parsedOrders = offers.map(parseMarketOrder)

    const parsedEditableOrders = editOfferPubkey
      ? parsedOrders.map((offer: Order) =>
          offer?.rawData?.publicKey === editOfferPubkey ? { ...myOrder, ...offer } : offer,
        )
      : []

    if (loansAmount && !editOffer?.publicKey) {
      parsedOrders.push(myOrder)
    }

    const orders = editOfferPubkey ? parsedEditableOrders : parsedOrders

    return orders
  }, [offers, loanValue, loansAmount, offerPubkey])

  return {
    orders,
    isLoading,
    hideOffer,
  }
}