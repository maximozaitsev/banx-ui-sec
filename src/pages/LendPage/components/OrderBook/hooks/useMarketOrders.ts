import { useMemo } from 'react'

import { PUBKEY_PLACEHOLDER } from 'fbonds-core/lib/fbond-protocol/constants'

import { Offer } from '@banx/api/core'
import { useMarketOffers } from '@banx/pages/LendPage/hooks'
import { SyntheticOffer, convertToSynthetic, useSyntheticOffers } from '@banx/store'

type UseMarketOrders = (props: { marketPubkey: string; offerPubkey: string }) => {
  offers: SyntheticOffer[]
  isLoading: boolean
  bestOffer: SyntheticOffer
}

export const useMarketOrders: UseMarketOrders = ({ marketPubkey, offerPubkey }) => {
  const { offers, isLoading } = useMarketOffers({ marketPubkey })

  const processedOffers = useProcessedOffers({
    marketPubkey,
    offers,
    editableOfferPubkey: offerPubkey,
  })

  const sortedOffers = useMemo(() => {
    return [...processedOffers].sort((orderA, orderB) => orderB.loanValue - orderA.loanValue)
  }, [processedOffers])

  const bestOffer = useMemo(() => {
    const [firstOffer, secondOffer] = sortedOffers
    const isFirstOfferEditable = firstOffer?.publicKey === PUBKEY_PLACEHOLDER || firstOffer?.isEdit
    return isFirstOfferEditable ? secondOffer : firstOffer
  }, [sortedOffers])

  return {
    offers: sortedOffers,
    isLoading,
    bestOffer,
  }
}

type UseProcessedOffers = (props: {
  offers: Offer[]
  marketPubkey: string
  editableOfferPubkey: string
}) => SyntheticOffer[]

const useProcessedOffers: UseProcessedOffers = ({ marketPubkey, offers, editableOfferPubkey }) => {
  const { offerByMarketPubkey } = useSyntheticOffers()

  const processedOffers = useMemo(() => {
    const syntheticOffer = offerByMarketPubkey[marketPubkey]

    if (!offers) return []

    const offersConvertedToSynthetic = offers.map((offer) => convertToSynthetic(offer))

    const processedEditableOffers = offersConvertedToSynthetic.filter(
      (offer) => offer.publicKey !== editableOfferPubkey,
    )

    if (syntheticOffer) {
      processedEditableOffers.push(syntheticOffer)
    }

    return processedEditableOffers
  }, [offerByMarketPubkey, marketPubkey, offers, editableOfferPubkey])

  return processedOffers
}
