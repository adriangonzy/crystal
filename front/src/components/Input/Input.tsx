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
      ref: unusedParentRef,
      ...rest
    },
    ref
  ) => (
    <>
      <label htmlFor={rest.name}>{label}</label>
      <input
        className="block px-2 mt-1 w-full h-10 focus:bg-white bg-opacity-10 rounded-md border-0 border-transparent focus:ring-2 focus:ring-fuchsia-500"
        ref={ref}
        defaultValue={defaultValue}
        type={type}
        {...rest}
      />
      {error && <div className="text-red-500">{errorMessage}</div>}
    </>
  )
)
Input.displayName = 'Input'
