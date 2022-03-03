import { useCallback, useEffect, useState } from 'react'
import { useExtension } from './useExtension'

export const useBurnerWallets = () => {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [wallets, setWallets] = useState<Array<string>>([])

  const { sendMessage, extensionInstalled } = useExtension()

  const init = useCallback(
    async (password: string) => {
      const response = await sendMessage({
        method: 'init',
        payload: password,
      })
      setIsInitialized(response === 'initialized')
      setIsUnlocked(response === 'unlocked')
    },
    [sendMessage]
  )

  const status = useCallback(async () => {
    const response = await sendMessage({
      method: 'status',
    })
    setIsInitialized(response !== 'not-initialized')
    setIsUnlocked(response === 'unlocked')
  }, [sendMessage])

  const unlock = useCallback(
    async (password: string) => {
      const response = await sendMessage({
        method: 'unlock',
        payload: password,
      })
      if (response === 'unlocked') setIsUnlocked(true)
    },
    [sendMessage]
  )

  const lock = useCallback(async () => {
    const response = await sendMessage({
      method: 'lock',
    })
    if (response === 'locked' || response === 'Must unlock first')
      setIsUnlocked(false)
  }, [sendMessage])

  const addBurnerWallet = useCallback(async () => {
    const address = await sendMessage({
      method: 'add-wallet',
    })
    if (address) setWallets([...wallets, address as string])
  }, [sendMessage, wallets])

  const getBurnerWallets = useCallback(async () => {
    const wallets = await sendMessage({
      method: 'wallets',
    })

    if (wallets === 'Must unlock first') {
      setIsUnlocked(false)
      return
    }
    if (wallets instanceof Array) setWallets(wallets)
  }, [sendMessage])

  useEffect(() => {
    if (!extensionInstalled) return

    // TODO: check status at intervals
    status()
      .then(() => {
        if (isUnlocked) return getBurnerWallets()
      })
      .catch((error) => {
        console.error(error)
        setIsUnlocked(false)
        setIsInitialized(false)
        setWallets([])
      })
  }, [
    extensionInstalled,
    getBurnerWallets,
    unlock,
    sendMessage,
    status,
    isUnlocked,
  ])

  return {
    status,
    init,
    unlock,
    lock,
    isUnlocked,
    isInitialized,
    addBurnerWallet,
    getBurnerWallets,
    wallets,
  }
}
