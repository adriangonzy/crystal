import {
  FlashbotsBundleRawTransaction,
  FlashbotsBundleTransaction,
} from '@flashbots/ethers-provider-bundle'

export declare type FlashbotsBundle = Array<
  FlashbotsBundleTransaction | FlashbotsBundleRawTransaction
>
