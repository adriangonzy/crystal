export interface ButtonProps {
  text: string
  onClick: () => void
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  text,
  onClick,
}) => {
  return (
    <button
      className="w-full h-12 text-purple-700 bg-opacity-40 rounded-lg ring-2 ring-white shadow-xl border-1 bg-amber-100 border-fuchsia-400"
      onClick={onClick}
    >
      {text}
    </button>
  )
}
