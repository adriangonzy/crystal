import { TransactionRequest } from '@ethersproject/abstract-provider'
import { ethers } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FlashbotsBundleProvider,
  FlashbotsBundleRawTransaction,
  FlashbotsBundleResolution,
  FlashbotsBundleTransaction,
  FlashbotsTransaction,
  RelayResponseError,
} from '../../ethers-flashbots-provider'

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
  goerli: {
    chainId: 5,
    relay: 'https://relay-goerli.flashbots.net/',
  },
  mainnet: {
    chainId: 1,
    relay: 'https://relay-staging.flashbots.com/',
  },
}

export const useFlashbots = () => {
  const provider = useMemo(
    () => new ethers.providers.Web3Provider(window.ethereum),
    []
  )

  // Used for signing the bundle, just for reputation identification
  // maybe we might save it accross sessions in the future
  const bundleSigner = useMemo(() => ethers.Wallet.createRandom(), [])

  // if PK was provided
  //   owner signs the transactions in the bundle
  // else
  //   an ephemeral transaction signer is instanciated
  //   and owner signs (eip-2612) permit allowance for weth bribe
  //   and adds a last transact to the bundle
  // for the ephemeral random transaction signer
  console.log(import.meta)
  const owner = useMemo(
    () =>
      import.meta.env.DEV
        ? new ethers.Wallet(
            import.meta.env.VITE_TEST_OWNER_PK as string,
            provider
          )
        : provider.getSigner(),
    [provider]
  )

  const [flashbotsProvider, setFlashbotsProvider] =
    useState<FlashbotsBundleProvider | null>(null)

  // current bundle
  const [bundle, setBundle] = useState<FlashbotsBundle>([])

  useEffect(() => {
    FlashbotsBundleProvider.create(provider, bundleSigner, {
      url: config[
        import.meta.env.DEV ? 'dev' : 'still too risky to put mainnet here'
      ].relay,
      skipFetchSetup: true,
      headers: {
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    }).then(setFlashbotsProvider)
  }, [provider, bundleSigner])

  const signBundle = useCallback(
    async (bundle: FlashbotsBundle) => {
      if (!flashbotsProvider) throw new Error('Flashbots Provider Required')
      const signedBundle = await flashbotsProvider.signBundle(bundle)
      return signedBundle
    },
    [flashbotsProvider]
  )

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
    [bundle, flashbotsProvider, provider, signBundle]
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

      // const signedBundle = await signBundle(bundle)
      // const signedOrderedBundle = signedBundle.rawTxs.reverse()

      const [, error] = await simulateBundle(blocksInTheFutur)
      if (error) return

      provider.on('block', async (blockNumber) => {
        console.log(`Block #${blockNumber}`)
        const submission = await flashbotsProvider.sendBundle(
          bundle,
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
          signer: owner,
        },
      ])
    },
    [bundle, owner]
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

// TODO: How to make almost pure browser implem that handles cors issues for calls to relay.flashbots.net or relay-goerli.flashbots.net
//
// - instanciate a flashbotbundleprovider with an alchemy or infura json rpcs by providing project id params via config inside of a background script for a chrome extension
// - pass the raw signed bundle from the front to the background script and do the call and return the response or an error
// - or pass the unsigned bundle + the owner signer
//   -> owner is either obtained via pk for local signing in browser -> Show BIG -> AT YOUR OWN RISK MESSAGE with lots of red
//   or instead we use random wallet generate on the browser only for signing transacts locally
//      and we add a last transact that gives the random wallet permit on using some weth by owner for bribes -> EIP2612 using ERC712
//      -> this will need the deployment of a smart contract that uses weth10 and mev_briber contract base

// const getBundleFromRelay = async (id: string) => {
//   const bundle = await fetch(`${DEFAULT_FLASHBOTS_RELAY}/bundle?id=${id}`)
//   return await bundle.json()
// }

// const getEncodedFunctionCallData = () => {
//   // if (ABI != '' && calldata != '') {
//   //   return new ethers.utils.Interface(['function ' + ABI]).encodeFunctionData(
//   //     ABI,
//   //     calldata.split(' ')
//   //   )
//   // } else {
//   return '0x'
//   // }
// }

// // see ERC-712
// // TODO: get MEVBriber abi
// const abi = new ethers.utils.Interface([
//   'Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)',
// ])

// const data = JSON.stringify({
//   domain: {
//     // Defining the chain aka Rinkeby testnet or Ethereum Main Net
//     chainId: config['dev'].chainId,
//     // Give a user friendly name to the specific contract you are signing for.
//     name: 'MEVBriber',
//     // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
//     // https://kndrck.co/posts/making_flashbots_work_in_browser/
//     verifyingContract: '0xf26F7dAa038651F6eFcA888E91ecbeC8e231035e', // TODO: MevBriver on mainnet -> needs to be mocked on goerli
//     // Just let's you know the latest version. Definitely make sure the field name is correct.
//     version: '1',
//   },

//   // Defining the message signing data content.
//   message: abi._abiCoder.encode(
//     [
//       'bytes32 permit_hash',
//       'address owner',
//       'address spender',
//       'uint256 value',
//       'uint256 nonce',
//       'uint256 deadline',
//     ],
//     [
//       '', // TODO access the value in the MevBriber contract abi directly
//       provider.getSigner()._address,
//       '0xf26F7dAa038651F6eFcA888E91ecbeC8e231035e',
//       0, // TODO use value from form
//       1, // TODO here we need to call the nonces of the mevbriber contract for the owner / sender
//       -1, // TODO add a deadline
//     ]
//   ),
// })

// const response = await provider.send('eth_signTypedData_v4', [
//   owner,
//   data,
// ])

// console.log(response)
// const v = '' // TODO extract from signature
// const r = '' // TODO extract from signature
// const s = '' // TODO extract from signature

// todo: we need to add an approve transact for the mevbriber by the owner to make this work
// -> fuck with current version of the mevbriber, that uses weth9 we cannot sign approvals offchain...
// -> needs to be a manual approval with gas...
// -> TODO: deploy and improved version of the mevbriber using weth10 with off chain approval
// bundle = bundle.concat({
//   // bribe transact at the end
//   transaction: {
//     to: '0xf26F7dAa038651F6eFcA888E91ecbeC8e231035e',
//     data: abi.encodeFunctionData('check32BytesAndSendWETH', [
//       provider.getSigner()._address,
//       '0xf26F7dAa038651F6eFcA888E91ecbeC8e231035e',
//       0, // TODO use value from form
//       -1, // TODO add a deadline
//       v,
//       r,
//       s,
//       'target', // todo this will need to implement a way to define the condition for the bribe to pass
//       'payload', // todo this will need to implement a way to define the condition for the bribe to pass
//       'expected_result', // todo this will need to implement a way to define the condition for the bribe to pass
//     ]),
//   },
//   signer,
// })

// TODO 1 transactions
// - one for bribing with the random wallet
// -  This later will need that we sign the permission of the owner of weth to the random signer for bribing
// -> this will need a call to metamask
// Mev briber deployed here https://etherscan.io/address/0xf26F7dAa038651F6eFcA888E91ecbeC8e231035e#code
// const getMevBriberTransaction = (tx: FlashbotsBundleTransaction) => {}
