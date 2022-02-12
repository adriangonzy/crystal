import { TransactionRequest } from '@ethersproject/abstract-provider'
import {
  DEFAULT_FLASHBOTS_RELAY,
  FlashbotsBundleProvider,
  FlashbotsBundleRawTransaction,
  FlashbotsBundleResolution,
  FlashbotsBundleTransaction,
  FlashbotsTransaction,
  RelayResponseError,
} from '@flashbots/ethers-provider-bundle'
import { ethers } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'

export interface Env {
  chainId: number
  relay: string
}

export declare type FlashbotsBundle = Array<
  FlashbotsBundleTransaction | FlashbotsBundleRawTransaction
>

export interface FlashbotsContextInterface {
  provider: ethers.providers.Web3Provider
  flashbotsProvider: FlashbotsBundleProvider
  bundle: FlashbotsBundle
}

const config: Record<string, Env> = {
  dev: {
    chainId: 5,
    relay: 'https://relay-goerli.flashbots.net/',
  },
  mainnet: {
    chainId: 1,
    relay: 'https://relay-staging.flashbots.com/',
  },
}

const getBundleFromRelay = async (id: string) => {
  const bundle = await fetch(`${DEFAULT_FLASHBOTS_RELAY}/bundle?id=${id}`)
  return await bundle.json()
}

const signBundle = async (bundle: FlashbotsBundle) => {
  // TODO here sign transactions not send

  // WTF dude are you doing here ???
  // for (const index in transactions){
  //   await signer.sendTransaction(transactions[index].transaction);
  // }
  // could use -> https://eth.wiki/json-rpc/API#eth_signTransaction instead ?
  console.log(bundle)
  return bundle as any
}

const getEncodedFunctionCallData = () => {
  // if (ABI != '' && calldata != '') {
  //   return new ethers.utils.Interface(['function ' + ABI]).encodeFunctionData(
  //     ABI,
  //     calldata.split(' ')
  //   )
  // } else {
  return '0x'
  // }
}

export const useFlashbots = () => {
  const provider = useMemo(
    () => new ethers.providers.Web3Provider(window.ethereum),
    []
  )
  const signer = useMemo(() => ethers.Wallet.createRandom(), [])

  const [flashbotsProvider, setFlashbotsProvider] =
    useState<FlashbotsBundleProvider | null>(null)
  const [bundle, setBundle] = useState<FlashbotsBundle>([])

  useEffect(() => {
    FlashbotsBundleProvider.create(provider, signer, config['dev'].relay).then(
      setFlashbotsProvider
    )
  }, [provider, signer])

  const simulateBundle = useCallback(
    async (blocksInTheFutur: number) => {
      if (!flashbotsProvider) throw new Error('Flashbots Provider Required')

      const blockNumber = await provider.getBlockNumber()
      const targetBlockNumber = blockNumber + blocksInTheFutur

      const simulation = await flashbotsProvider.simulate(
        await signBundle(bundle),
        targetBlockNumber
      )
      if ('error' in simulation) {
        window.alert(
          'There was some error in the flashbots simulation, please read the bundle receipt'
        )
        console.error(simulation.error)
        return [simulation, simulation.error]
      }
      window.alert(
        'Flashbots simulation was a success: ' +
          JSON.stringify(simulation, null, 2)
      )
      return [simulation, undefined]
    },
    [bundle, flashbotsProvider, provider]
  )

  const sendBundle = useCallback(
    async (
      blocksInTheFutur: number,
      handleSubmission: (
        submission: FlashbotsTransaction
      ) => Promise<FlashbotsBundleResolution | RelayResponseError>
    ) => {
      if (!flashbotsProvider) throw new Error('Flashbots Provider Required')

      provider.off('block')
      const blockNumber = await provider.getBlockNumber()
      const targetBlockNumber = blockNumber + blocksInTheFutur

      const signedBundle = await signBundle(bundle)
      const signedOrderedBundle = signedBundle.rawTxs.reverse()

      const [, error] = await simulateBundle(blocksInTheFutur)
      if (error) return

      provider.on('block', async (blockNumber) => {
        console.log(`Block #${blockNumber}`)
        const submission = await flashbotsProvider.sendBundle(
          signedOrderedBundle,
          targetBlockNumber
        )
        await handleSubmission(submission)
        provider.off('block')
      })
    },
    [bundle, flashbotsProvider, provider, simulateBundle]
  )

  const getMaxBaseFee = useCallback(
    async (blocksInTheFuture: number) => {
      const block = await provider.getBlock(await provider.getBlockNumber())

      const maxBaseFeeInFutureBlock = block.baseFeePerGas
        ? FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(
            block.baseFeePerGas,
            blocksInTheFuture
          )
        : 0
      return maxBaseFeeInFutureBlock
    },
    [provider]
  )

  const addTransaction = useCallback(
    (tx: TransactionRequest) => {
      setBundle([
        ...bundle,
        {
          transaction: tx,
          signer: provider.getSigner(),
        },
      ])
    },
    [bundle, provider]
  )

  const removeTransaction = useCallback(
    (index: number) => setBundle(bundle.filter((_, i) => i !== index)),
    [bundle]
  )

  return {
    bundle,
    signBundle,
    simulateBundle,
    sendBundle,
    getMaxBaseFee,
    addTransaction,
    removeTransaction,
  }
}
