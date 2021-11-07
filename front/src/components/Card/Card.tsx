import { PropsWithChildren } from 'react'

export interface CardProps {
  title?: string
}

export const Card: React.FunctionComponent<PropsWithChildren<CardProps>> = ({
  title,
  children,
}) => {
  return (
    <div
      className="py-4 px-8 text-white bg-white bg-opacity-20 
                rounded-lg border border-r-0 border-b-0 border-opacity-30 
                shadow-2xl backdrop-filter backdrop-blur-sm"
    >
      {title && (
        <h2 className="mb-4 text-xl font-bold text-white uppercase">{title}</h2>
      )}
      {children}
    </div>
  )
}
