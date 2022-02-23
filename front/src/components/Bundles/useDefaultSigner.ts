import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

const provider = new ethers.providers.Web3Provider(window.ethereum)

export const useDefaultSigner = () => {
  const [defaultSigner, setDefaultSigner] = useState<string>('')
  useEffect(() => {
    if (!defaultSigner) {
      provider.getSigner().getAddress().then(setDefaultSigner)
    }
  }, [defaultSigner])

  return defaultSigner
}
