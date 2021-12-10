import Flipside from './flipside'
import { NFTEvent } from './useNFTEvents'

describe('Flipside', () => {
  it('should fetch data', async () => {
    const flipside = new Flipside<NFTEvent>(
      'https://api.flipsidecrypto.com/api/v2/queries/4f16c9ff-4fa9-4278-b056-19f0f5c9057b/data/latest'
    )
    const data = await flipside.data()
    expect(data).toBeDefined()
    expect(data.length).toBeGreaterThan(0)
  })
})
