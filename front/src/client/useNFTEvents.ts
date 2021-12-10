import { useEffect, useState } from 'react'
import Flipside from './flipside'

export interface NFTEvent {
  DATE: string
  BLOCK_TIMESTAMP: Date
  CONTRACT_ADDRESS: string
  CREATOR_FEE: number
  EVENT_FROM: string
  EVENT_PLATFORM: string
  EVENT_TO: string
  EVENT_TYPE: string
  PLATFORM_FEE: number
  PRICE: number
  PRICE_USD: number
  PROJECT_NAME: string
  TOKEN_ID: string
  TX_CURRENCY: string
  TX_ID: string
}

const flipside = new Flipside<NFTEvent>(
  'https://api.flipsidecrypto.com/api/v2/queries/4f16c9ff-4fa9-4278-b056-19f0f5c9057b/data/latest',
  (raw) => ({
    DATE: new Date(raw.BLOCK_TIMESTAMP as string).toDateString(),
    BLOCK_TIMESTAMP: new Date(raw.BLOCK_TIMESTAMP as string),
    CONTRACT_ADDRESS: raw.CONTRACT_ADDRESS as string,
    CREATOR_FEE: raw.CREATOR_FEE as number,
    EVENT_FROM: raw.EVENT_FROM as string,
    EVENT_PLATFORM: raw.EVENT_PLATFORM as string,
    EVENT_TO: raw.EVENT_TO as string,
    EVENT_TYPE: raw.EVENT_TYPE as string,
    PLATFORM_FEE: raw.PLATFORM_FEE as number,
    PRICE: raw.PRICE as number,
    PRICE_USD: raw.PRICE_USD as number,
    PROJECT_NAME: raw.PROJECT_NAME as string,
    TOKEN_ID: raw.TOKEN_ID as string,
    TX_CURRENCY: raw.TX_CURRENCY as string,
    TX_ID: raw.TX_ID as string,
  })
)

export const useNFTEvents = (): [NFTEvent[] | null, boolean, Error | null] => {
  const [data, setData] = useState<NFTEvent[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!data && !loading) {
      setLoading(true)
      flipside
        .data()
        .then((data) => {
          setData(data)
          setLoading(false)
        })
        .catch((e) => {
          setError(e)
          setLoading(false)
        })
    }
  }, [data, loading, error])

  return [data, loading, error]
}
