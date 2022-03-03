/* eslint-disable tailwindcss/classnames-order */
import { useEthers, useNotifications } from '@usedapp/core'
import { useCallback } from 'react'
import { ConnectButton } from '../ConnectButton/ConnectButton'
import { Extension } from '../Extension/Extension'

export default function Header() {
  const { account, activateBrowserWallet, error } = useEthers()
  const { notifications } = useNotifications()

  const activate = useCallback(async () => {
    activateBrowserWallet()
  }, [activateBrowserWallet])

  if (error) {
    console.error('Error:')
    console.error(error)
  }

  if (notifications && notifications.length > 0) {
    console.log('Notifications:')
    for (const notification of notifications) console.log(notification)
  }

  return (
    <div className="flex justify-end text-base text-purple-700 space-x-2">
      <ConnectButton account={account} onClick={activate} />
      <Extension />
    </div>
  )
}
