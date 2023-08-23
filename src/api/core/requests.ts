import axios from 'axios'
import { web3 } from 'fbonds-core'

import { BACKEND_BASE_URL, IS_PRIVATE_MARKETS } from '@banx/constants'

import {
  BorrowNftsAndOffers,
  BorrowNftsAndOffersResponse,
  BorrowNftsAndOffersSchema,
  FetchMarketOffersResponse,
  Loan,
  LoanSchema,
  Market,
  MarketPreview,
  MarketPreviewResponse,
  MarketPreviewSchema,
  MarketSchema,
  Offer,
  WalletLoansResponse,
} from './types'

type FetchMarketsPreview = () => Promise<MarketPreview[]>
export const fetchMarketsPreview: FetchMarketsPreview = async () => {
  try {
    const queryParams = new URLSearchParams({
      isPrivate: String(IS_PRIVATE_MARKETS),
    })

    const { data } = await axios.get<MarketPreviewResponse>(
      `${BACKEND_BASE_URL}/bonds/preview?${queryParams.toString()}`,
    )

    try {
      await MarketPreviewSchema.array().parseAsync(data.data)
    } catch (validationError) {
      console.error('Schema validation error:', validationError)
    }

    return data.data
  } catch (error) {
    console.error(error)
    return []
  }
}

type FetchAllMarkets = () => Promise<Market[]>
export const fetchAllMarkets: FetchAllMarkets = async () => {
  try {
    const queryParams = new URLSearchParams({
      isPrivate: String(IS_PRIVATE_MARKETS),
    })

    const { data } = await axios.get<Market[]>(
      `${BACKEND_BASE_URL}/markets?${queryParams.toString()}`,
    )

    try {
      await MarketSchema.array().parseAsync(data)
    } catch (validationError) {
      console.error('Schema validation error:', validationError)
    }

    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

type FetchCertainMarket = (props: { marketPubkey: web3.PublicKey }) => Promise<Market>
export const fetchCertainMarket: FetchCertainMarket = async ({ marketPubkey }) => {
  const { data } = await axios.get<Market>(`${BACKEND_BASE_URL}/markets/${marketPubkey.toBase58()}`)

  try {
    await MarketSchema.array().parseAsync(data)
  } catch (validationError) {
    console.error('Schema validation error:', validationError)
  }

  return data
}

type FetchMarketOffers = (props: {
  marketPubkey?: web3.PublicKey | null
  order?: 'asc' | 'desc'
  skip?: number
  limit?: number
  getAll?: boolean
}) => Promise<Offer[]>
export const fetchMarketOffers: FetchMarketOffers = async ({
  marketPubkey,
  order = 'desc',
  skip = 0,
  limit = 10,
  getAll = true, //TODO Remove when normal pagination added
}) => {
  try {
    const queryParams = new URLSearchParams({
      order,
      skip: String(skip),
      limit: String(limit),
      getAll: String(getAll),
      isPrivate: String(IS_PRIVATE_MARKETS),
    })

    const { data } = await axios.get<FetchMarketOffersResponse>(
      `${BACKEND_BASE_URL}/bond-offers/${marketPubkey?.toBase58() || ''}?${queryParams.toString()}`,
    )

    try {
      await MarketSchema.array().parseAsync(data?.data)
    } catch (validationError) {
      console.error('Schema validation error:', validationError)
    }

    return data?.data || []
  } catch (error) {
    console.error(error)
    return []
  }
}

type FetchWalletLoans = (props: {
  walletPublicKey: string
  order?: 'asc' | 'desc'
  skip?: number
  limit?: number
  getAll?: boolean
}) => Promise<Loan[]>

export const fetchWalletLoans: FetchWalletLoans = async ({
  walletPublicKey,
  order = 'desc',
  skip = 0,
  limit = 10,
  getAll = true, //TODO Remove when normal pagination added
}) => {
  try {
    const queryParams = new URLSearchParams({
      order,
      skip: String(skip),
      limit: String(limit),
      getAll: String(getAll),
      isPrivate: String(IS_PRIVATE_MARKETS),
    })

    const { data } = await axios.get<WalletLoansResponse>(
      `${BACKEND_BASE_URL}/loans/${walletPublicKey}?${queryParams.toString()}`,
    )

    try {
      await LoanSchema.array().parseAsync(data.data)
    } catch (validationError) {
      console.error('Schema validation error:', validationError)
    }

    return data.data
  } catch (error) {
    console.error(error)
    return []
  }
}

type FetchBorrowNftsAndOffers = (props: {
  walletPubkey: string
  order?: string
  getAll?: boolean
  skip?: number
  limit?: number
}) => Promise<BorrowNftsAndOffers>
export const fetchBorrowNftsAndOffers: FetchBorrowNftsAndOffers = async ({
  walletPubkey,
  getAll = true, //TODO Remove when normal pagination added
  order = 'desc',
  skip = 0,
  limit = 10,
}) => {
  try {
    const queryParams = new URLSearchParams({
      order,
      skip: String(skip),
      limit: String(limit),
      getAll: String(getAll),
      isPrivate: String(IS_PRIVATE_MARKETS),
    })

    const { data } = await axios.get<BorrowNftsAndOffersResponse>(
      `${BACKEND_BASE_URL}/nfts/borrow/${walletPubkey}?${queryParams.toString()}`,
    )

    //TODO: Remove it when BE satisfyies schema
    try {
      await BorrowNftsAndOffersSchema.parseAsync(data.data)
    } catch (validationError) {
      console.error('Schema validation error:', validationError)
    }

    return data.data || { nfts: [], offers: {} }
  } catch (error) {
    console.error(error)
    return { nfts: [], offers: {} }
  }
}