import { BsWallet2 } from 'react-icons/bs'
import { Button } from '../Button/Button'

export interface ConnectButtonProps {
  account?: string | null
  onClick: () => void
}

export const ConnectButton: React.FunctionComponent<ConnectButtonProps> = ({
  account,
  onClick,
}) => {
  return (
    <Button icon={<BsWallet2 className="text-xs" />} onClick={onClick}>
      <span className="overflow-hidden font-bold text-ellipsis max-w-[theme(spacing.48)]">
        {!account ? 'Connect' : account}
      </span>
    </Button>
  )
}
