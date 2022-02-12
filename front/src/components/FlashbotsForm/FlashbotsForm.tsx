import { useEthers } from '@usedapp/core'
import { TransactionRequest } from '@usedapp/core/node_modules/@ethersproject/providers'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from '..'
import { Button } from '../Button/Button'
import { Input } from '../Input/Input'

export interface FlashbotFormProps {
  addTransaction: (tx: TransactionRequest) => void
  getMaxBaseFee: (blocksInTheFuture: number) => Promise<ethers.BigNumber | 0>
}

type FlashbotFormData = {
  to: string
  value: number
  gasLimit: number
  blocksFutur: number
}

const GWEI = ethers.BigNumber.from(10).pow(9)
const VALID_ETH_ADDRESS = /^0x[a-fA-F0-9]{40}$/

export const FlashbotForm: React.FunctionComponent<FlashbotFormProps> = ({
  addTransaction,
  getMaxBaseFee,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FlashbotFormData>()

  const { chainId } = useEthers()

  const onAddTransaction = useCallback(
    async (data: FlashbotFormData) => {
      console.log(data, errors)
      addTransaction({
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
      })
    },
    [addTransaction, chainId, errors, getMaxBaseFee]
  )

  return (
    <Card variant="glass" title="New Transaction" key="new-transaction-form">
      <form className="flex flex-col py-6 space-y-3 text-fuchsia-700">
        <Input
          type="text"
          label="Target Address*"
          {...register('to', { required: true, pattern: VALID_ETH_ADDRESS })}
          error={errors.to}
          errorMessage="Required - Must be a valid ETH address"
        />
        <Input
          type="number"
          label="Value"
          defaultValue={0}
          {...register('value', { min: 0 })}
          error={errors.value}
          errorMessage="Must be a positive number or zero"
        />
        <Input
          type="number"
          label="Gas Limit (in GWEI)"
          defaultValue={0}
          {...register('gasLimit', { min: 0 })}
          error={errors.gasLimit}
          errorMessage="Must be a positive number or zero"
        />
        <Input
          type="number"
          label="Blocks in the Future"
          defaultValue={0}
          {...register('blocksFutur', { min: 0 })}
          error={errors.blocksFutur}
          errorMessage="Must be a positive number or zero"
        />
        <br />
        <Button
          text="Add Transaction"
          onClick={handleSubmit(onAddTransaction)}
        />
      </form>
    </Card>
  )
}
