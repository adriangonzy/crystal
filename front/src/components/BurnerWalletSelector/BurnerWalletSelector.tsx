import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { usePrevious } from '../../utils/hooks/usePrevious/usePrevious'
import { Button } from '../Button/Button'
import { useBurnerWallets } from '../Extension/useBurnerWallets'
import { TransactionFormData } from '../TransactionForm/TransactionForm'

export const BurnerWalletSelector = () => {
  const { wallets, addBurnerWallet } = useBurnerWallets()
  const {
    register,
    setFocus,
    formState: { errors },
  } = useFormContext<TransactionFormData>()

  // Get the previous value (was passed into hook on last render)
  const previousWallets = usePrevious(wallets)

  useEffect(() => {
    if (previousWallets?.length === 0 && wallets.length > 0) setFocus('from')
  }, [previousWallets?.length, setFocus, wallets])

  return (
    <>
      <>
        <label htmlFor="from">{`Choose a signing burner wallet (currently ${wallets.length})`}</label>
        <select
          className="block px-2 mt-1 w-full h-10 bg-purple-200 bg-opacity-50 focus:bg-opacity-60 
          rounded-md border-0 border-transparent focus:ring-2 focus:ring-purple-700 focus:bg-amber-100"
          {...register('from', {
            required: true,
          })}
          defaultValue={wallets.length > 0 ? wallets[0] : 'nothing here'}
        >
          {wallets.map((wallet) => (
            <option key={wallet} value={wallet}>
              {wallet}
            </option>
          ))}
        </select>
        {errors.from && (
          <div className="text-red-500">Must select a burner wallet</div>
        )}
      </>
      <Button
        className="mx-auto hover:bg-purple-700"
        onClick={(e) => {
          e.preventDefault()
          addBurnerWallet()
        }}
      >
        Add Burner Wallet
      </Button>
    </>
  )
}
