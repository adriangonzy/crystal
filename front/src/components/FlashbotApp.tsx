import { useEthers, useNotifications } from '@usedapp/core'
import { Card } from '.'
import { ConnectButton } from './ConnectButton/ConnectButton'
import { FlashbotForm } from './FlashbotsForm/FlashbotsForm'

export default function FlashbotApp() {
  const { account, activateBrowserWallet, error } = useEthers()
  const { notifications } = useNotifications()

  const activate = async () => {
    activateBrowserWallet()
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-red-400">
      {/* Container */}
      <div className="flex flex-col px-4 pb-4 mx-auto h-full">
        {/* Header */}
        <div className="flex justify-end py-4 w-full">
          <ConnectButton account={account} onClick={activate} />
        </div>
        {/* Cards */}
        <div className="flex-1 space-y-6 h-full">
          <div className="grid grid-cols-2 gap-6">
            <FlashbotForm />
            <Card variant="glass" title="Notifications" key="notifications">
              {notifications.map((notification) => (
                <div key={notification.id}>
                  <h1>{notification.type}</h1>
                  <div>{JSON.stringify(notification, null, 2)}</div>
                </div>
              ))}
              {notifications.length == 0 && 'No notifications'}
            </Card>
            <Card
              variant="glass"
              title={`Error${error && error.name ? ` - ${error.name}` : ''}`}
              key="error"
            >
              {error ? error.message : 'No error'}
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
