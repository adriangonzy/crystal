import React from 'react'
import { FieldError } from 'react-hook-form'

export interface SelectorProps {
  name: string
  label: string
  options: string[]
  error?: FieldError
  errorMessage?: string
}

export const Selector = React.forwardRef<HTMLSelectElement, SelectorProps>(
  ({ name, label, options, error, errorMessage, ...rest }, ref) => (
    <>
      <label htmlFor={name}>{label}</label>
      <select
        className="block px-2 mt-1 w-full h-10 bg-purple-200 bg-opacity-50 focus:bg-opacity-60 
        rounded-md border-0 border-transparent focus:ring-2 focus:ring-purple-700 focus:bg-amber-100"
        ref={ref}
        {...rest}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <div className="text-red-500">{errorMessage}</div>}
    </>
  )
)
Selector.displayName = 'Selector'
