import { useState } from 'react'
import { FiLock, FiUnlock } from 'react-icons/fi'
import { MdOutlineDisabledByDefault } from 'react-icons/md'
import { VscDebugStart } from 'react-icons/vsc'
import { Button } from '../Button/Button'
import { PasswordModal } from './PasswordModal'
import { useBurnerWallets } from './useBurnerWallets'
import { useExtension } from './useExtension'

export const Extension = () => {
  const { extensionInstalled } = useExtension()
  const { isInitialized, isUnlocked, lock, unlock, init } = useBurnerWallets()
  const [isOpen, setIsOpen] = useState(false)

  const [icon, text] = extensionInstalled
    ? isInitialized
      ? isUnlocked
        ? [<FiUnlock key="1" />, 'Unlocked']
        : [<FiLock key="1" />, 'Locked']
      : [<VscDebugStart key="1" />, 'Init']
    : [<MdOutlineDisabledByDefault key="1" />, 'Not Installed']

  return (
    <Button
      icon={icon}
      onClick={isInitialized && isUnlocked ? lock : () => setIsOpen(true)}
    >
      <span className="overflow-hidden font-bold text-ellipsis max-w-[theme(spacing.48)]">
        {text}
      </span>
      <PasswordModal
        title={isInitialized ? 'Unlock' : 'Init'}
        cta={isInitialized ? 'Unlock' : 'Init'}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(password: string) => {
          if (!isInitialized) init(password)
          else unlock(password)
          setIsOpen(false)
        }}
      />
    </Button>
  )
}
