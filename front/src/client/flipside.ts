/**

https://api.flipsidecrypto.com/api/v2/queries/4f16c9ff-4fa9-4278-b056-19f0f5c9057b/data/latest

SELECT *
FROM ethereum.nft_events
WHERE
block_timestamp > CURRENT_DATE - 10
AND event_platform = 'opensea'
AND project_name is not null
AND price is not null
 */

import fetch from 'isomorphic-fetch'

export default class Flipside<T> {
  private url: string
  private serializer: (raw: Record<string, unknown>) => T

  constructor(url: string, serializer: (raw: Record<string, unknown>) => T) {
    this.url = url
    this.serializer = serializer
  }

  public async data(): Promise<T[]> {
    const response = await fetch(this.url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })

    const data = (await response.json()) as Record<string, unknown>[]

    if (response.ok) {
      return Promise.resolve(data.map(this.serializer))
    } else {
      return Promise.reject(data)
    }
  }
}
