export interface ConnectButtonProps {
  account?: string | null
  onClick: () => void
}

export const ConnectButton: React.FunctionComponent<ConnectButtonProps> = ({
  account,
  onClick,
}) => {
  return (
    <button
      className="self-start p-3 font-bold backdrop-filter 
      backdrop-blur-sm shadow-3xl text-purple-700 bg-fuchsia-300 bg-opacity-60 rounded-2xl ring-2 ring-white "
      onClick={onClick}
    >
      {!account ? 'Connect' : account}
    </button>
  )
}
