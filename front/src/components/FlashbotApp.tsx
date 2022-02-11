import {
  FlashbotsBundleResolution,
  FlashbotsTransaction,
} from '@flashbots/ethers-provider-bundle'
import { useEthers, useNotifications } from '@usedapp/core'
import { useCallback } from 'react'
import { Card } from '.'
import { ConnectButton } from './ConnectButton/ConnectButton'
import { FlashbotForm } from './FlashbotsForm/FlashbotsForm'
import { useFlashbots } from './FlashbotsForm/useFlashbots'

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
  const { account, activateBrowserWallet, error } = useEthers()
  const { notifications } = useNotifications()

  const activate = async () => {
    activateBrowserWallet()
  }

  const {
    bundle,
    signBundle,
    simulateBundle,
    sendBundle,
    addTransaction,
    getMaxBaseFee,
  } = useFlashbots()

  const onSendBundle = useCallback(() => {
    sendBundle(1, handleSubmission)
  }, [sendBundle])

  const onSimulateBundle = useCallback(() => {
    simulateBundle(1)
  }, [simulateBundle])

  const onSignBundle = useCallback(() => {
    signBundle(bundle)
  }, [bundle, signBundle])

  if (error) {
    console.error('Error:')
    console.error(error)
  }

  if (notifications && notifications.length > 0) {
    console.log('Notifications:')
    for (const notification in notifications) console.log(notification)
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-fuchsia-300 to-amber-300">
      {/* Container */}
      <div className="flex flex-col px-4 pb-4 mx-auto w-2/3 h-full">
        {/* Header */}
        <div className="flex justify-end py-8 w-full">
          <ConnectButton account={account} onClick={activate} />
        </div>
        {/* Cards */}
        <div className="flex-1 space-y-6 h-full">
          <div className="grid grid-cols-2 gap-6">
            <FlashbotForm
              addTransaction={addTransaction}
              getMaxBaseFee={getMaxBaseFee}
            />
            <Card variant="glass" title="Transactions" key="transactions">
              <div className="flex flex-col justify-end items-center space-y-8 w-full">
                <button
                  className="w-2/3 h-12 bg-opacity-40 rounded-lg shadow-xl border-1 bg-amber-100 border-fuchsia-400"
                  onClick={onSendBundle}
                >
                  Sign Bundle
                </button>
                <button
                  className="w-2/3 h-12 bg-opacity-40 rounded-lg shadow-xl border-1 bg-amber-100 border-fuchsia-400"
                  onClick={onSimulateBundle}
                >
                  Simulate Bundle
                </button>
                <button
                  className="w-2/3 h-12 bg-opacity-40 rounded-lg shadow-xl border-1 bg-amber-100 border-fuchsia-400"
                  onClick={onSignBundle}
                >
                  Send Bundle
                </button>
              </div>
            </Card>
          </div>
        </div>
        {/* Footer */}
        <div className="self-end mt-6 w-full text-xs text-center text-white text-opacity-50">
          Copyright @BRC - 2022
        </div>
      </div>
    </div>
  )
}
