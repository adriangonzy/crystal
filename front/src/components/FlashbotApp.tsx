import {
  FlashbotsBundleResolution,
  FlashbotsTransaction,
} from '@flashbots/ethers-provider-bundle'
import { useEthers, useNotifications } from '@usedapp/core'
import { useCallback } from 'react'
import { Card } from '.'
import { Button } from './Button/Button'
import { ConnectButton } from './ConnectButton/ConnectButton'
import { FlashbotForm } from './FlashbotsForm/FlashbotsForm'
import { useFlashbots } from './FlashbotsForm/useFlashbots'
import { TransationItem } from './TransactionItem/TransactionItem'

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
    removeTransaction,
    getMaxBaseFee,
  } = useFlashbots()

  console.log('App render', bundle)

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

  console.log(bundle)

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-fuchsia-300 to-amber-300">
      {/* Container */}
      <div className="flex flex-col px-4 pb-4 mx-auto w-5/6 h-full">
        {/* Header */}
        <div className="flex justify-end py-8 w-full">
          <ConnectButton account={account} onClick={activate} />
        </div>
        {/* Cards */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card
              variant="glass"
              title="New Transaction"
              key="new-transaction-form"
            >
              <FlashbotForm
                addTransaction={addTransaction}
                getMaxBaseFee={getMaxBaseFee}
              />
            </Card>
            <Card variant="glass" title="Bundle" key="bundle">
              <div className="flex flex-col justify-between h-full">
                <div className="overflow-scroll bg-opacity-0">
                  {bundle.map((tx, i) => (
                    <TransationItem
                      name={`Tx #${i}`}
                      tx={tx}
                      key={i}
                      onRemove={() => removeTransaction(i)}
                    />
                  ))}
                  {bundle.length === 0 && (
                    <div>No transactions added to bundle</div>
                  )}
                </div>
                <div className="flex flex-row justify-between items-center mb-20 w-full align-end">
                  <div className="flex-1 mx-4">
                    <Button text="Sign Bundle" onClick={onSendBundle} />
                  </div>
                  <div className="flex-1 mx-4">
                    <Button text="Simulate Bundle" onClick={onSimulateBundle} />
                  </div>
                  <div className="flex-1 mx-4">
                    <Button text="Send Bundle" onClick={onSignBundle} />
                  </div>
                </div>
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
