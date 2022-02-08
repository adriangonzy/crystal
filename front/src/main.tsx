import { Config, DAppProvider, Mainnet } from '@usedapp/core'
import React from 'react'
import ReactDOM from 'react-dom'
import './components/App.css'
import FlashbotApp from './components/FlashbotApp'

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]:
      'https://mainnet.infura.io/v3/f39f22e77d54418d96d1ba45cffd57fa',
  },
}

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <FlashbotApp />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
