import { TransactionRequest } from "@ethersproject/providers";

import { BigNumber, ethers } from "ethers";
import {
  DEFAULT_FLASHBOTS_RELAY,
  FlashbotsBundleProvider,
  FlashbotsBundleResolution,
  FlashbotsTransaction,
} from "@flashbots/ethers-provider-bundle";
import { getDecryptedAccountPKs } from "./wallets";

export interface StoredTx {
  signer?: string;
  transaction: TransactionRequest;
}

export interface StoredBundle {
  id: string;
  title: string;
  transactions: StoredTx[];
}

export const simulateBundle = async (
  password: string,
  bundle: StoredBundle
) => {
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://mainnet.infura.io/v3/f39f22e77d54418d96d1ba45cffd57fa"
  // );
  // only for reputation -> TODO: make a special reputation wallet for this
  const authSigner = ethers.Wallet.createRandom();
  const provider = new ethers.providers.InfuraProvider(
    "goerli",
    "f39f22e77d54418d96d1ba45cffd57fa"
  );
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    {
      url: "https://relay-goerli.flashbots.net",
    },
    "goerli"
  );

  // StoredBundle -> Real Bundle
  const pks = await getDecryptedAccountPKs(password);
  const pksAddresses = pks.map((pk) => new ethers.Wallet(pk).address);

  const network = await provider.getNetwork();
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);
  const gasPrice = await provider.getGasPrice();
  const GWEI = ethers.BigNumber.from(10).pow(9);

  const maxBaseFee = FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(
    block.baseFeePerGas ?? BigNumber.from(1),
    1
  );

  const realBundle = bundle.transactions.map(({ transaction, signer }) => {
    const i = pksAddresses.findIndex((address) => address === signer);
    const realSigner = new ethers.Wallet(pks[i]);
    return {
      transaction: {
        ...transaction,
        chainId: 5, // override to goerli
        maxFeePerGas: maxBaseFee.mul(2), // override with defaults for now
        maxPriorityFeePerGas: maxBaseFee, // override with defaults for now
      },
      signer: realSigner,
    };
  });

  const signedBundle = await flashbotsProvider.signBundle(realBundle);
  const simulation = await flashbotsProvider.simulate(
    signedBundle,
    blockNumber + 1
  );

  console.log("flashbotsProvider", flashbotsProvider);
  console.log("authSigner", authSigner.address);
  console.log("blockNumber", blockNumber);
  console.log("block", block.hash);
  console.log("network", network.name);
  console.log("GasPrice", gasPrice.toNumber());
  // console.log("GWEI", GWEI);
  // console.log("maxBaseFee", maxBaseFee);
  console.log("signedBundle", signedBundle);
  console.log("simulation", simulation);

  return simulation;
};

const handleSubmission = async (submission: FlashbotsTransaction) => {
  if ("error" in submission) {
    window.alert(
      "There was some error in the flashbots submission, please read the bundle receipt"
    );
    console.error(submission.error);
    return submission;
  }
  const waitSubmission = await submission.wait();

  console.log(FlashbotsBundleResolution[waitSubmission]);

  if (waitSubmission === FlashbotsBundleResolution.BundleIncluded) {
    window.alert(
      "Your Bundle just got mined!, read the bundle receipt and visit etherscan to verify!"
    );
  } else if (waitSubmission === FlashbotsBundleResolution.AccountNonceTooHigh) {
    window.alert("Flashbots encountered an error: AccountNonceTooHigh");
  }
  return waitSubmission;
};

// [
//   {
//     transaction: {
//       chainId: 5,
//       type: 2,
//       // base info
//       to: "0x02B29E4F064D478B04E6bbA0e03E8f734cFf0658",
//       value: 0,
//       data: "0x",
//       // gas info
//       maxFeePerGas: maxBaseFee,
//       // maxPriorityFeePerGas: GWEI.mul(1).toNumber(),
//       gasLimit: 21000,
//     },
//     signer: txSigner,
//   },
// ]
