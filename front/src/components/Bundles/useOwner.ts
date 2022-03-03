import { ethers } from 'ethers'
import { useMemo } from 'react'

const provider = new ethers.providers.Web3Provider(window.ethereum)

export const useOwner = () => {
  const delegateRandomOwner = useMemo(
    () => ethers.Wallet.createRandom()._mnemonic,
    []
  )

  // if PK was provided
  //   owner signs the transactions in the bundle
  // else
  //   an ephemeral transaction signer is instanciated
  //   and owner signs (eip-2612) permit allowance for weth bribe
  //   and adds a last transact to the bundle
  // for the ephemeral random transaction signer
  const owner = useMemo(
    () =>
      import.meta.env.DEV
        ? new ethers.Wallet(
            import.meta.env.VITE_TEST_OWNER_PK as string,
            provider
          )
        : delegateRandomOwner,
    [delegateRandomOwner]
  )
  return owner
}
