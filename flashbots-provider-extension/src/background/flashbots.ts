import browser from "webextension-polyfill";

import { BigNumber, ethers } from "ethers";
import {
  DEFAULT_FLASHBOTS_RELAY,
  FlashbotsBundleProvider,
} from "@flashbots/ethers-provider-bundle";

const simulateBundle = async () => {
  const provider = new ethers.providers.InfuraProvider(
    "goerli",
    "f39f22e77d54418d96d1ba45cffd57fa"
  );
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://mainnet.infura.io/v3/f39f22e77d54418d96d1ba45cffd57fa"
  // );
  const authSigner = ethers.Wallet.createRandom();
  const txSigner = new ethers.Wallet(
    "0xb85fa7c37bb53f60c990d66b2a59b1e22c3421c28b2e28b1720581f410c1edd1"
  );
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    {
      url: "https://relay-goerli.flashbots.net",
    },
    "goerli"
  );

  const network = await provider.getNetwork();
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);
  const GWEI = ethers.BigNumber.from(10).pow(9);

  console.log(flashbotsProvider);
  console.log(authSigner);
  console.log(blockNumber);
  console.log(block);
  console.log(network);
  console.log(await provider.getGasPrice());

  const maxBaseFee = FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(
    block.baseFeePerGas ?? BigNumber.from(1),
    1
  );

  const signedBundle = await flashbotsProvider.signBundle([
    {
      transaction: {
        chainId: 5,
        type: 2,
        // base info
        to: "0x02B29E4F064D478B04E6bbA0e03E8f734cFf0658",
        value: 0,
        data: "0x",
        // gas info
        maxFeePerGas: maxBaseFee,
        // maxPriorityFeePerGas: GWEI.mul(1).toNumber(),
        gasLimit: 21000,
      },
      signer: txSigner,
    },
  ]);

  const simulation = await flashbotsProvider.simulate(
    signedBundle,
    blockNumber + 1
  );

  console.log(simulation);
};
