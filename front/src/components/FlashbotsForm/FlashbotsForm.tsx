import {
  FlashbotsBundleProvider,
  FlashbotsBundleResolution,
  FlashbotsBundleTransaction,
  FlashbotsTransaction,
} from '@flashbots/ethers-provider-bundle'
import {
  TransactionRequest,
  Web3Provider,
} from '@usedapp/core/node_modules/@ethersproject/providers'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Card } from '..'

export interface Env {
  chainId: number
  relay: string
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

export interface FlashbotsHookParams {
  relay: string
  authSigner: ethers.Wallet
  provider: ethers.providers.Web3Provider
}

const useFlashbots = (
  params: FlashbotsHookParams
): [FlashbotsBundleProvider | null, Web3Provider] => {
  const [provider, setProvider] = useState<FlashbotsBundleProvider | null>(null)
  useEffect(() => {
    FlashbotsBundleProvider.create(
      params.provider,
      params.authSigner,
      params.relay
    ).then(setProvider)
  }, [params.authSigner, params.provider, params.relay])
  return [provider, params.provider]
}

export const FlashbotForm: React.FunctionComponent = () => {
  // deps
  const { chainId, relay } = config['dev']
  const [flashbotsProvider, provider] = useFlashbots({
    provider: new ethers.providers.Web3Provider(window.ethereum),
    authSigner: ethers.Wallet.createRandom(),
    relay,
  })

  // state
  const blocksInTheFuture = 1
  const GWEI = ethers.BigNumber.from(10).pow(9)
  const priorityFee = GWEI.mul(1)
  const gasLimit = GWEI.mul(1)
  const transactionTo = ''
  const transactions: FlashbotsBundleTransaction[] = []

  // const ABI = 'function signature'
  // const calldata = '#functionArguments'

  const getBundle = async (id: string) => {
    const bundle = await fetch(
      'https://rpc-staging.flashbots.net/bundle?id=' + id
    )
    return await bundle.json()
  }

  const getMaxBaseFee = async () => {
    const block = await provider.getBlock(await provider.getBlockNumber())

    const maxBaseFeeInFutureBlock = block.baseFeePerGas
      ? FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(
          block.baseFeePerGas,
          blocksInTheFuture
        )
      : 0
    return maxBaseFeeInFutureBlock
  }

  const getData = () => {
    // if (ABI != '' && calldata != '') {
    //   return new ethers.utils.Interface(['function ' + ABI]).encodeFunctionData(
    //     ABI,
    //     calldata.split(' ')
    //   )
    // } else {
    return '0x'
    // }
  }

  const getTransaction = async () => {
    const tx: TransactionRequest = {
      maxFeePerGas: await getMaxBaseFee(),
      data: getData(),
      to: transactionTo,
      value: 0,
      gasLimit,
      chainId,
    }
    const eip1559Transaction = {
      ...tx,
      type: 2,
      maxFeePerGas: tx.maxFeePerGas,
      maxPriorityFeePerGas: priorityFee,
    }
    const bundleTx: FlashbotsBundleTransaction = {
      transaction: eip1559Transaction,
      signer: provider.getSigner(),
    }
    return bundleTx
  }

  const signBundle = async (
    bundleId: string,
    transactions: FlashbotsBundleTransaction[]
  ) => {
    // TODO here sign transactions not send

    // WTF dude are you doing here ???
    // for (const index in transactions){
    //   await signer.sendTransaction(transactions[index].transaction);
    // }
    // could use -> https://eth.wiki/json-rpc/API#eth_signTransaction instead ?
    console.log(transactions)
    const bundle = await getBundle(bundleId)
    return bundle
  }

  const runSimulation = async (bundle: any, targetBlockNumber: number) => {
    if (!flashbotsProvider) throw new Error('Flashbots Provider Required')
    const simulation = await flashbotsProvider.simulate(
      bundle,
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
  }

  const handleSubmission = async (submission: FlashbotsTransaction) => {
    if ('error' in submission) {
      window.alert(
        'There was some error in the flashbots submission, please read the bundle receipt'
      )
      console.error(submission.error)
      provider.off('block')
      return
    }
    const waitSubmission = await submission.wait()

    console.log(FlashbotsBundleResolution[waitSubmission])

    if (waitSubmission === FlashbotsBundleResolution.BundleIncluded) {
      window.alert(
        'Your Bundle just got mined!, read the bundle receipt and visit etherscan to verify!'
      )
    } else if (
      waitSubmission === FlashbotsBundleResolution.AccountNonceTooHigh
    ) {
      window.alert('Flashbots encountered an error: AccountNonceTooHigh')
    }
    return waitSubmission
  }

  const sendBundle = async (bundleId: string) => {
    if (!flashbotsProvider) throw new Error('Flashbots Provider Required')

    provider.off('block')

    const blockNumber = await provider.getBlockNumber()
    const targetBlockNumber = blockNumber + blocksInTheFuture
    transactions.push(await getTransaction())

    const bundle = await signBundle(bundleId, transactions)
    const orderedBundle = bundle.rawTxs.reverse()

    const [, error] = await runSimulation(orderedBundle, targetBlockNumber)
    if (error) return

    provider.on('block', async (blockNumber) => {
      console.log(`Block #${blockNumber}`)
      const submission = await flashbotsProvider.sendBundle(
        orderedBundle,
        targetBlockNumber
      )
      await handleSubmission(submission)
      provider.off('block')
    })
  }

  return (
    <Card variant="glass" title="FlashBots" key="fb-form">
      <form className="flex flex-col py-6 space-y-3 text-purple-800">
        <label htmlFor="addr">Target Address</label>
        <input type="text" id="targetAddress" name="targetAddress" />
        <label htmlFor="fun">Function signature</label>
        <input type="text" id="functionSignature" name="functionSignature" />
        <label htmlFor="args">Function Arguments</label>
        <input type="text" id="functionArguments" name="functionArguments" />
        <label htmlFor="txValue">Transaction value</label>
        <input type="number" id="txValue" name="txValue" value="0" />
        <label htmlFor="gasLimit">Gas Limit</label>
        <input type="number" id="gasLimit" name="gasLimit" value="21000" />
        <button onClick={() => sendBundle('')}>Send bundle</button>
      </form>
    </Card>
  )
}
