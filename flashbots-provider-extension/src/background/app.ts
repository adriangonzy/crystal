import browser from "webextension-polyfill";
import { simulateBundle } from "./flashbots";
import {
  reset,
  savePassword,
  checkPassword,
  getStoredPasswordHash,
  deleteWallet,
  addRandomBurnerWallet,
  getBurnerWalletsAddresses,
} from "./wallets";

type ExternalMessageCallback = (
  message: any,
  sender: browser.Runtime.MessageSender
) => void | Promise<any>;

let cachePWD: string | null = "secret_password";

// TODO: Should use types for better message type validation instead of just providing payload of type any
// TODO: Should use a class instance instead of a plain module. This way, main will be able to use accounts easily
export const appListener: ExternalMessageCallback = async (message, sender) => {
  try {
    // make sure its a valid message
    if (
      !("method" in message) ||
      ![
        // general
        "ping",
        // wallets
        "init",
        "reset",
        "unlock",
        "lock",
        "wallets",
        "add-wallet",
        "delete-wallet",
        "status",
        // flashbots
        "simulate",
        "send",
      ].includes(message.method)
    ) {
      console.error("Ignored invalid message");
      return "Ignored invalid message";
    }

    if (message.method !== "ping") console.log(message, sender);

    switch (message.method) {
      // general
      // used for extension health status checks
      case "ping":
        return "pong";
      // wallets
      // used for app status checks
      case "status":
        const hash = await getStoredPasswordHash();
        if (!hash) return "not-initialized";
        return cachePWD ? "unlocked" : "locked";
      case "init":
        await savePassword(message.payload);
        cachePWD = message.payload;
        setTimeout(() => (cachePWD = null), 5 * 60 * 1000); // 5 min sessions
        return "initialized";
      case "unlock":
        await checkPassword(message.payload);
        cachePWD = message.payload;
        setTimeout(() => (cachePWD = null), 5 * 60 * 1000); // 5 min sessions
        return "unlocked";
      default:
        if (!cachePWD) return "Must unlock first";
        switch (message.method) {
          case "lock":
            cachePWD = null;
            return "locked";
          case "wallets":
            return await getBurnerWalletsAddresses(cachePWD);
          case "add-wallet":
            return await addRandomBurnerWallet(cachePWD);
          case "delete-wallet":
            return await deleteWallet(cachePWD, message.payload);
          case "reset":
            return await reset(cachePWD);
          // flashbots
          case "simulate":
            return await simulateBundle(cachePWD, message.payload);
          default:
            console.error(`Unknown method: ${message.method}`);
            return `Unknown method: ${message.method}`;
        }
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) return error.message;
    else {
      return error;
    }
  }
};
