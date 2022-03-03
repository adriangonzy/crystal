import { useEthers } from '@usedapp/core'
import { TransactionRequest } from '@usedapp/core/node_modules/@ethersproject/providers'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { BurnerWalletSelector } from '../BurnerWalletSelector/BurnerWalletSelector'
import { Button } from '../Button/Button'
import { Input } from '../Input/Input'

export interface TransactionFormProps {
  submitLabel: string
  onSubmit: (tx: TransactionRequest, signer: string) => void
  getMaxBaseFee: (blocksInTheFuture: number) => Promise<ethers.BigNumber | 0>
}

export type TransactionFormData = {
  from: string
  to: string
  value: number
  gasLimit: number
  blocksFutur: number
}

const GWEI = ethers.BigNumber.from(10).pow(9)
const VALID_ETH_ADDRESS = /^0x[a-fA-F0-9]{40}$/

export const TransactionForm: React.FunctionComponent<TransactionFormProps> = ({
  submitLabel,
  onSubmit,
  getMaxBaseFee,
}) => {
  const { ...methods } = useForm<TransactionFormData>({})
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  const { chainId, account } = useEthers()

  const onSubmitHandler = useCallback(
    async (data: TransactionFormData) => {
      onSubmit(
        {
          // eip-1559
          chainId,
          type: 2,
          // base info
          to: data.to,
          value: data.value ?? 0, // TODO convert to wei
          data: '0x', // TODO: add a way in the form to config a call to a contract func
          // gas info
          maxFeePerGas: (await getMaxBaseFee(data.blocksFutur)) ?? 0,
          maxPriorityFeePerGas: GWEI.mul(1).toNumber(), // TODO
          gasLimit: GWEI.mul(data.gasLimit ?? 0).toNumber(), // TODO
        },
        data.from
      )
    },
    [onSubmit, chainId, getMaxBaseFee]
  )

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col py-4 space-y-3 text-purple-700">
        <BurnerWalletSelector />
        <Input
          type="text"
          label="Target Address*"
          {...register('to', {
            pattern: VALID_ETH_ADDRESS,
          })}
          error={errors.to}
          errorMessage="Required - Must be a valid ETH address"
          defaultValue={account ?? ''}
        />
        <Input
          type="number"
          label="Value"
          {...register('value', { min: 0 })}
          defaultValue={0}
          error={errors.value}
          errorMessage="Must be a positive number or zero"
        />
        <Input
          type="number"
          label="Gas Limit (in GWEI)"
          {...register('gasLimit', { min: 0 })}
          defaultValue={0}
          error={errors.gasLimit}
          errorMessage="Must be a positive number or zero"
        />
        <Input
          type="number"
          label="Blocks in the Future"
          {...register('blocksFutur', { min: 0 })}
          defaultValue={0}
          error={errors.blocksFutur}
          errorMessage="Must be a positive number or zero"
        />
        <br />
        <div className="mx-auto h-1/3">
          <Button onClick={handleSubmit(onSubmitHandler)}>
            <span className="font-bold uppercase">{submitLabel}</span>
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
