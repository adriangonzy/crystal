export interface ButtonProps {
  onClick?: () => void
  icon?: JSX.Element
  className?: string
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  icon,
  className = 'hover:bg-purple-700',
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-row justify-between items-center py-2 px-4 hover:text-white bg-white 
     bg-opacity-70 hover:bg-opacity-100 rounded-lg border-2 border-white ${className}`}
    >
      {!!icon && <span className="px-1">{icon}</span>}
      {children}
    </button>
  )
}
