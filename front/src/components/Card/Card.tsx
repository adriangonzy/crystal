import { PropsWithChildren } from 'react'

export interface CardProps {
  title?: string
  variant: 'glass' | 'paper'
}

const variants = {
  glass: `bg-opacity-25 bg-white border border-r-0 border-l-0 border-b-0`,
  paper: `bg-opacity-40 bg-white border-purple-500 h-full`,
}

export const Card: React.FunctionComponent<PropsWithChildren<CardProps>> = ({
  title,
  variant,
  children,
}) => {
  return (
    <div
      className={`py-4 px-6 text-purple-900 rounded-lg backdrop-filter 
      backdrop-blur-sm shadow-3xl ${variants[variant]}`}
    >
      {title && (
        <h2 className="mb-4 text-2xl font-bold text-transparent uppercase bg-clip-text bg-gradient-to-r to-black from-fuchsia-500">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
