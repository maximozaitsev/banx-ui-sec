import { useEffect, useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { PairState } from 'fbonds-core/lib/fbond-protocol/types'
import { chain, map, maxBy } from 'lodash'
import { create } from 'zustand'

import { core } from '@banx/api/nft'
import { useTokenType } from '@banx/store/common'
import { isOfferNewer, isOptimisticOfferExpired, useOffersOptimistic } from '@banx/store/nft'
import { isOfferStateClosed } from '@banx/utils'

import { LendTabName } from './LendPage'

export const USE_MARKETS_PREVIEW_QUERY_KEY = 'marketsPreview'

export const useMarketsPreview = () => {
  const { tokenType } = useTokenType()

  const { data, isLoading } = useQuery(
    [USE_MARKETS_PREVIEW_QUERY_KEY, tokenType],
    () => core.fetchMarketsPreview({ tokenType }),
    {
      staleTime: 5000,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    },
  )

  return {
    marketsPreview: data || [],
    isLoading,
  }
}

export const useMarketOffers = ({ marketPubkey }: { marketPubkey?: string }) => {
  const { optimisticOffers, update: updateOffer, remove: removeOffers } = useOffersOptimistic()
  const { tokenType } = useTokenType()

  const { data, isLoading, isFetching, isFetched } = useQuery(
    ['marketPairs', marketPubkey, tokenType],
    () => core.fetchMarketOffers({ marketPubkey, tokenType }),
    {
      enabled: !!marketPubkey,
      staleTime: 30 * 1000, //? 30sec
      refetchOnWindowFocus: false,
    },
  )

  //? Check expiredOffers and and purge them
  useEffect(() => {
    if (!data || isFetching || !isFetched) return

    const expiredOffersByTime = optimisticOffers.filter((offer) => isOptimisticOfferExpired(offer))

    const optimisticsToRemove = chain(optimisticOffers)
      .filter(({ offer }) => !isOfferStateClosed(offer?.pairState))
      .filter(({ offer }) => {
        const sameOfferFromBE = data?.find(({ publicKey }) => publicKey === offer.publicKey)
        if (!sameOfferFromBE) return false
        const isBEOfferNewer = isOfferNewer(sameOfferFromBE, offer)
        return isBEOfferNewer
      })
      .value()

    if (optimisticsToRemove.length || expiredOffersByTime.length) {
      removeOffers(
        map([...expiredOffersByTime, ...optimisticsToRemove], ({ offer }) => offer.publicKey),
      )
    }
  }, [data, isFetched, isFetching, optimisticOffers, removeOffers])

  const offers = useMemo(() => {
    const filteredOptimisticOffers = optimisticOffers
      .filter(({ offer }) => offer.hadoMarket === marketPubkey)
      .map(({ offer }) => offer)

    const combinedOffers = [...filteredOptimisticOffers, ...(data ?? [])]

    return chain(combinedOffers)
      .groupBy('publicKey')
      .map((offers) => maxBy(offers, 'lastTransactedAt'))
      .compact()
      .filter((offer) => !isOfferStateClosed(offer?.pairState || PairState.PerpetualClosed))
      .compact()
      .value()
  }, [optimisticOffers, data, marketPubkey])

  const updateOrAddOffer = (offer: core.Offer) => {
    updateOffer([offer])
  }

  return {
    offers,
    updateOrAddOffer,
    isLoading,
  }
}

type LendTabsState = {
  tab: LendTabName | null
  setTab: (tab: LendTabName | null) => void
}

export const useLendTabs = create<LendTabsState>((set) => ({
  tab: null,
  setTab: (tab) => set({ tab }),
}))
