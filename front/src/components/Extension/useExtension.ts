import { useCallback, useEffect, useRef, useState } from 'react'

export interface ExtensionMessage<Payload> {
  method: string
  payload?: Payload
}

const PING_MESSAGE = {
  method: 'ping',
}

const default_extensionId = import.meta.env
  .VITE_FLASHBOTS_PROXY_EXTENSION_ID as string
if (!default_extensionId)
  throw new Error('VITE_FLASHBOTS_PROXY_EXTENSION_ID env var must be defined')

export const useExtension = <Payload>(extensionId = default_extensionId) => {
  const [extensionInstalled, setExtensionInstalled] = useState(false)
  const pingTimer = useRef<NodeJS.Timer | null>(null)

  const sendMessage = useCallback(
    (message: ExtensionMessage<Payload>) => {
      return new Promise((resolve, reject) => {
        try {
          // console.log(`Message to extension:`)
          // console.log(message)
          window.chrome.runtime.sendMessage(
            extensionId,
            message,
            (response: any) => {
              // console.log(`Extension response:`)
              // console.log(response)
              resolve(response)
            }
          )
        } catch (error) {
          console.error(error)
          reject(error)
        }
      })
    },
    [extensionId]
  )

  const ping = useCallback(() => {
    sendMessage(PING_MESSAGE)
      .then((response) => {
        setExtensionInstalled(response === 'pong')
      })
      .catch((error) => {
        console.error(error)
        if (pingTimer.current) clearInterval(pingTimer.current)
      })
  }, [sendMessage])

  useEffect(() => {
    ping()
    pingTimer.current = setInterval(ping, 5 * 1000)
    return () => {
      if (pingTimer.current) clearInterval(pingTimer.current)
    }
  }, [ping])

  return {
    extensionInstalled,
    sendMessage,
  }
}
