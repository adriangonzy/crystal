import { TransactionRequest } from '@usedapp/core/node_modules/@ethersproject/providers'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import { Card } from '..'

export interface FlashbotFormProps {
  addTransaction: (tx: TransactionRequest) => void
  getMaxBaseFee: (blocksInTheFuture: number) => Promise<ethers.BigNumber | 0>
}

export const FlashbotForm: React.FunctionComponent<FlashbotFormProps> = ({
  addTransaction,
  getMaxBaseFee,
}) => {
  // deps

  // state

  const GWEI = ethers.BigNumber.from(10).pow(9)
  const priorityFee = GWEI.mul(1) // ?
  const gasLimit = GWEI.mul(1) // good
  const blocksInTheFuture = 1 // TODO
  const transactionTo = '' // good
  // const ABI = 'function signature'
  // const calldata = '#functionArguments'

  const getTransaction = useCallback(async () => {
    const tx: TransactionRequest = {
      maxFeePerGas: await getMaxBaseFee(blocksInTheFuture),
      data: '0x',
      to: transactionTo,
      value: 0,
      gasLimit,
      chainId: 5,
    }
    const eip1559Transaction = {
      ...tx,
      type: 2,
      maxFeePerGas: tx.maxFeePerGas,
      maxPriorityFeePerGas: priorityFee,
    }
    return eip1559Transaction
  }, [gasLimit, getMaxBaseFee, priorityFee])

  const onAddTransaction = useCallback(async () => {
    addTransaction(await getTransaction())
  }, [addTransaction, getTransaction])

  return (
    <Card variant="glass" title="New Transaction" key="new-transaction-form">
      <form className="flex flex-col py-6 space-y-3 text-fuchsia-700">
        <label htmlFor="addr">Target Address</label>
        <input
          className="block mt-1 w-full focus:bg-white bg-opacity-10 rounded-md border-transparent focus:ring-1 focus:border-fuchsia-500"
          type="text"
          id="targetAddress"
          name="targetAddress"
        />
        <label htmlFor="fun">Function signature</label>
        <input
          className="block mt-1 w-full focus:bg-white bg-opacity-10 rounded-md border-transparent focus:ring-1 focus:border-fuchsia-500"
          type="text"
          id="functionSignature"
          name="functionSignature"
        />
        <label htmlFor="args">Function Arguments</label>
        <input
          className="block mt-1 w-full focus:bg-white bg-opacity-10 rounded-md border-transparent focus:ring-1 focus:border-fuchsia-500"
          type="text"
          id="functionArguments"
          name="functionArguments"
        />
        <label htmlFor="txValue">Transaction value</label>
        <input
          className="block mt-1 w-full focus:bg-white bg-opacity-10 rounded-md border-transparent focus:ring-1 focus:border-fuchsia-500"
          type="number"
          id="txValue"
          name="txValue"
          value="0"
          onChange={console.log}
        />
        <label htmlFor="gasLimit">Gas Limit</label>
        <input
          className="block mt-1 w-full focus:bg-white bg-opacity-10 rounded-md border-transparent focus:ring-1 focus:border-fuchsia-500"
          type="number"
          id="gasLimit"
          name="gasLimit"
          value="21000"
          onChange={console.log}
        />
        <button
          className="mx-auto mt-8 w-2/3 h-12 bg-opacity-40 rounded-lg shadow-xl border-1 bg-amber-100 border-fuchsia-400"
          onClick={onAddTransaction}
        >
          Add Transaction
        </button>
      </form>
    </Card>
  )
}
