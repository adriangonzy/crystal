import React from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

export interface InputProps extends UseFormRegisterReturn {
  type: 'text' | 'number'
  label: string
  defaultValue?: string | number | readonly string[] | undefined
  error?: FieldError
  errorMessage?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      label,
      defaultValue,
      error,
      errorMessage,
      // we dont want ref to be in rest otherwise it replaces the forwarded ref
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // ref: unusedParentRef,
      ...rest
    },
    ref
  ) => (
    <>
      <label htmlFor={rest.name}>{label}</label>
      <input
        className="block px-2 mt-1 w-full h-10 bg-purple-200 bg-opacity-50 focus:bg-opacity-60 
        rounded-md border-0 border-transparent focus:ring-2 focus:ring-purple-700 focus:bg-amber-100"
        defaultValue={defaultValue}
        type={type}
        {...rest}
        ref={ref}
      />
      {error && <div className="text-red-500">{errorMessage}</div>}
    </>
  )
)
Input.displayName = 'Input'
