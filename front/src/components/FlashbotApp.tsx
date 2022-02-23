import {
  FlashbotsBundleResolution,
  FlashbotsTransaction,
} from '@flashbots/ethers-provider-bundle'
import { Card } from '.'
import AppLayout from './Layout/AppLayout'

export interface Env {
  chainId: number
  relay: string
}

export const flashbotsConfig: Record<string, Env> = {
  dev: {
    chainId: 5,
    relay: 'https://relay-goerli.flashbots.net/',
  },
  goerli: {
    chainId: 5,
    relay: 'https://relay-goerli.flashbots.net/',
  },
  mainnet: {
    chainId: 1,
    relay: 'https://relay-staging.flashbots.com/',
  },
}

const handleSubmission = async (submission: FlashbotsTransaction) => {
  if ('error' in submission) {
    window.alert(
      'There was some error in the flashbots submission, please read the bundle receipt'
    )
    console.error(submission.error)
    return submission
  }
  const waitSubmission = await submission.wait()

  console.log(FlashbotsBundleResolution[waitSubmission])

  if (waitSubmission === FlashbotsBundleResolution.BundleIncluded) {
    window.alert(
      'Your Bundle just got mined!, read the bundle receipt and visit etherscan to verify!'
    )
  } else if (waitSubmission === FlashbotsBundleResolution.AccountNonceTooHigh) {
    window.alert('Flashbots encountered an error: AccountNonceTooHigh')
  }
  return waitSubmission
}

export default function FlashbotApp() {
  return (
    <AppLayout>
      <Card variant="glass" title="New Transaction" key="new-transaction-form">
        {/* <FlashbotForm
          onSubmit={(tx) => console.log(tx)}
          getMaxBaseFee={getMaxBaseFee}
        /> */}
      </Card>
    </AppLayout>
  )
}
