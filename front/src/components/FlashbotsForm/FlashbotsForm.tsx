import { Card } from '..'

export const FlashbotForm: React.FunctionComponent = () => {
  // const getBundle = async (id: string) => {
  //   const bundle = await fetch(
  //     'https://rpc-staging.flashbots.net/bundle?id=' + id
  //   )
  //   return await bundle.json()
  // }

  // const sendBundle = async (bundleId: string) => {
  //   const enable = window.ethereum.enable()

  //   if (enable) {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     provider.off('block')
  //     const signer = provider.getSigner()
  //     const authSigner = ethers.Wallet.createRandom()
  //     let chainId
  //     let flashbotsRelay = 'https://relay.epheph.com/'
  //     if (document.getElementById('mainnet').checked) {
  //       chainId = 1
  //     } else {
  //       chainId = 5
  //       flashbotsRelay = 'https://relay-goerli.flashbots.net/'
  //     }
  //     const blocksInTheFuture = parseInt(
  //       document.getElementById('targetBlock').value
  //     )
  //     const GWEI = ethers.BigNumber.from(10).pow(9)
  //     const priorityFee = GWEI.mul(
  //       parseInt(document.getElementById('priorityFee').value)
  //     )
  //     let documentBlock = document.getElementById('txDef')
  //     const flashbotsProvider = await _FlashbotsBundleProvider.create(
  //       provider,
  //       authSigner,
  //       flashbotsRelay
  //     )
  //     let transactions = []
  //     let txObject = {}
  //     const blockNumber = await provider.getBlockNumber()
  //     const block = await provider.getBlock()
  //     const targetBlockNumber = blockNumber + blocksInTheFuture
  //     const maxBaseFeeInFutureBlock =
  //       2 *
  //       _FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(
  //         block.baseFeePerGas,
  //         blocksInTheFuture
  //       )
  //     Array.from(documentBlock.children).forEach((tx) => {
  //       const address = tx.querySelector('#targetAddress').value
  //       const txValue = tx.querySelector('#txValue').value
  //       const ABI = tx.querySelector('#functionSignature').value
  //       const calldata = tx.querySelector('#functionArguments').value
  //       const gasLimit = tx.querySelector('#gasLimit').value
  //       let data = '0x'
  //       let value = 0
  //       if (ABI != '' && calldata != '') {
  //         let iface = new ethers.utils.Interface(['function ' + ABI])
  //         let string = calldata.split(' ')
  //         data = iface.encodeFunctionData(ABI, string)
  //       }
  //       value = txValue
  //       tx['address'] = address
  //       const eip1559Transaction = {
  //         to: address,
  //         type: 2,
  //         maxFeePerGas: parseInt(maxBaseFeeInFutureBlock),
  //         maxPriorityFeePerGas: parseInt(priorityFee),
  //         gasLimit: parseInt(gasLimit),
  //         data: data,
  //         value: parseInt(value),
  //         chainId: chainId,
  //       }
  //       txBlock = {
  //         transaction: eip1559Transaction,
  //         signer: signer,
  //       }
  //       transactions.push(txBlock)
  //     })
  //     let counter = blocksInTheFuture

  //     // WTF dude are you doing here ???
  //     // for (const index in transactions){
  //     //   await signer.sendTransaction(transactions[index].transaction);
  //     // }
  //     // could use -> https://eth.wiki/json-rpc/API#eth_signTransaction instead ?

  //     const bundle = await getBundle(bundleId)
  //     const orderedBundle = bundle.rawTxs.reverse()
  //     const simulation = await flashbotsProvider.simulate(
  //       orderedBundle,
  //       targetBlockNumber
  //     )
  //     if ('error' in simulation) {
  //       window.alert(
  //         'There was some error in the flashbots simulation, please read the bundle receipt'
  //       )
  //       document.getElementById('receipt').innerHTML = simulation.error.message
  //     } else {
  //       window.alert(
  //         'Flashbots simulation was a success: ' +
  //           JSON.stringify(simulation, null, 2)
  //       )
  //       provider.on('block', async (blockNumber) => {
  //         const flashbotsSubmission = await flashbotsProvider.sendBundle(
  //           transactionBundle,
  //           targetBlockNumber
  //         )
  //         if ('error' in flashbotsSubmission) {
  //           window.alert(
  //             'There was some error in the flashbots submission, please read the bundle receipt'
  //           )
  //           document.getElementById('receipt').innerHTML =
  //             flashbotsSubmission.error.message
  //         }
  //         const waitResponse = await flashbotsSubmission.wait()
  //         document.getelementbyid('receipt').innerhtml =
  //           _FlashbotsBundleResolution[waitResponse]
  //         if (waitResponse === _FlashbotsBundleResolution.BundleIncluded) {
  //           provider.off('block')
  //           window.alert(
  //             'Your Bundle just got mined!, read the bundle receipt and visit etherscan to verify!'
  //           )
  //         } else if (
  //           waitResponse === _FlashbotsBundleResolution.AccountNonceTooHigh
  //         ) {
  //           window.alert('Flashbots encountered an error: AccountNonceTooHigh')
  //           provider.off('block')
  //         }
  //       })
  //     }
  //   } else {
  //     window.alert('Metamask is disabled. Please enable Metamask')
  //   }
  // }

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
      </form>
    </Card>
  )
}
