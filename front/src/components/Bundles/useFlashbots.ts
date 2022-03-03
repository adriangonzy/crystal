import { Networkish } from '@ethersproject/networks'
import { BaseProvider } from '@ethersproject/providers'
import { ConnectionInfo } from '@ethersproject/web'
import {
  DEFAULT_FLASHBOTS_RELAY,
  FlashbotsBundleProvider,
  FlashbotsBundleRawTransaction,
  FlashbotsBundleResolution,
  FlashbotsBundleTransaction,
  FlashbotsTransaction,
  RelayResponseError,
} from '@flashbots/ethers-provider-bundle'
import { ethers, Signer } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { StoredBundle } from './useBundles'

const randomSigner = ethers.Wallet.createRandom()
const provider = new ethers.providers.Web3Provider(window.ethereum)

const convertToFlashbotsBundle = (storedBundle: StoredBundle) => {
  return storedBundle.transactions.map((stx) => ({
    signer: provider.getSigner(stx.signer),
    transaction: stx.transaction,
  }))
}

export interface ProxyCommand {
  method: 'signBundle' | 'simulateBundle' | 'sendBundle'
  bundle: StoredBundle
  blocksInTheFuture: number
}

class ProxyFlashbotsBundleProvider extends FlashbotsBundleProvider {
  constructor(
    genericProvider: BaseProvider,
    authSigner: Signer,
    connectionInfoOrUrl: ConnectionInfo,
    network: Networkish
  ) {
    super(genericProvider, authSigner, connectionInfoOrUrl, network)
  }

  signBundle(
    bundle: (FlashbotsBundleTransaction | FlashbotsBundleRawTransaction)[]
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(), 60000)
      window.chrome.runtime.sendMessage(
        import.meta.env.FLASHBOTS_PROXY_EXTENSION_ID as string,
        {
          method: 'signBundle',
          bundle,
        },
        (response: any) => {
          clearTimeout(timer)
          resolve(response as string[])
        }
      )
    })
  }
}

// Used for signing the bundle, just for reputation identification
// maybe we might save it accross sessions in the futur
export const useFlashbots = (
  bundleSigner = randomSigner,
  relay = DEFAULT_FLASHBOTS_RELAY
) => {
  const [flashbotsProvider, setFlashbotsProvider] =
    useState<FlashbotsBundleProvider | null>(null)

  useEffect(() => {
    FlashbotsBundleProvider.create(provider, bundleSigner, {
      url: relay,
    }).then(setFlashbotsProvider)
  }, [bundleSigner, relay])

  const signBundle = useCallback(
    async (bundle: StoredBundle) => {
      if (!flashbotsProvider) throw new Error('Flashbots Provider Required')
      const signedBundle = await flashbotsProvider.signBundle(
        convertToFlashbotsBundle(bundle)
      )
      return signedBundle
    },
    [flashbotsProvider]
  )

  const simulateBundle = useCallback(
    async (bundle: StoredBundle, blocksInTheFutur: number) => {
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
    [flashbotsProvider, signBundle]
  )

  const sendBundle = useCallback(
    async (
      bundle: StoredBundle,
      blocksInTheFutur: number,
      handleSubmission: (
        submission: FlashbotsTransaction
      ) => Promise<FlashbotsBundleResolution | RelayResponseError>
    ) => {
      if (!flashbotsProvider) throw new Error('Flashbots Provider Required')

      provider.off('block')
      const blockNumber = await provider.getBlockNumber()
      const targetBlockNumber = blockNumber + blocksInTheFutur

      const [, error] = await simulateBundle(bundle, blocksInTheFutur)
      if (error) return

      provider.on('block', async (blockNumber) => {
        console.log(`Block #${blockNumber}`)
        const submission = await flashbotsProvider.sendBundle(
          convertToFlashbotsBundle(bundle),
          targetBlockNumber
        )
        await handleSubmission(submission)
        provider.off('block')
      })
    },
    [flashbotsProvider, simulateBundle]
  )

  const getMaxBaseFee = useCallback(async (blocksInTheFuture: number) => {
    const block = await provider.getBlock(await provider.getBlockNumber())

    const maxBaseFeeInFutureBlock = block.baseFeePerGas
      ? FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(
          block.baseFeePerGas,
          blocksInTheFuture
        )
      : 0
    return maxBaseFeeInFutureBlock
  }, [])

  return {
    provider,
    flashbotsProvider,
    signBundle,
    simulateBundle,
    sendBundle,
    getMaxBaseFee,
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
