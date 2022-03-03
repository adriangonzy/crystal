import browser from "webextension-polyfill";
import SimpleCrypto from "simple-crypto-js";
import bcrypt from "bcryptjs";
import { ethers } from "ethers";

const SALT_ROUNDS = 10;
const HASH_STORAGE_KEY = "hash";
const ACCOUNTS_PKS_STORAGE_KEY = "accounts";

type ExternalMessageCallback = (
  message: any,
  sender: browser.Runtime.MessageSender
) => void | Promise<any>;

const reset = async (password: string): Promise<void> => {
  await checkPassword(password);
  return await browser.storage.local.set({
    [HASH_STORAGE_KEY]: null,
    [ACCOUNTS_PKS_STORAGE_KEY]: null,
  });
};

const getStoredPasswordHash = async (): Promise<string | null> => {
  const result = await browser.storage.local.get(HASH_STORAGE_KEY);
  if (!result || !result[HASH_STORAGE_KEY]) return null;
  else return result[HASH_STORAGE_KEY];
};

const savePassword = async (password: string): Promise<void> => {
  const result = await browser.storage.local.get(HASH_STORAGE_KEY);

  if (result && result[HASH_STORAGE_KEY])
    throw new Error("A hash is already stored");

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
      if (err) {
        reject(err);
        return;
      }
      await browser.storage.local.set({ [HASH_STORAGE_KEY]: hash });
      console.info(`saved hash: ${hash}`);
      resolve();
    });
  });
};

const checkPassword = async (password: string): Promise<void> => {
  const hash = await getStoredPasswordHash();
  if (!hash) throw new Error("No stored hash to compare with.");

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) =>
      result ? resolve() : reject(err)
    );
  });
};

const getEncryptedAccountPKs = async () => {
  const { [ACCOUNTS_PKS_STORAGE_KEY]: pks } = await browser.storage.local.get(
    ACCOUNTS_PKS_STORAGE_KEY
  );
  console.log(pks);
  return pks as string[];
};

const getBurnerWalletsAddresses = async (password: string) => {
  await checkPassword(password);
  const addresses = (await getEncryptedAccountPKs()).map(
    (encryptedPK) =>
      new ethers.Wallet(
        new SimpleCrypto(password).decrypt(encryptedPK) as string
      ).address
  );
  console.log(addresses);
  return addresses;
};

const addRandomBurnerWallet = async (password: string) => {
  await checkPassword(password);
  let pks = await getEncryptedAccountPKs();
  if (!pks) pks = [];

  const randomSigner = ethers.Wallet.createRandom();
  const encryptedPK = new SimpleCrypto(password).encrypt(
    randomSigner.privateKey
  );

  pks.push(encryptedPK);

  await browser.storage.local.set({ [ACCOUNTS_PKS_STORAGE_KEY]: pks });
  console.info(`saved account: ${randomSigner.address}`);
  return randomSigner.address;
};

const deleteWallet = async (password: string, index: number) => {
  await checkPassword(password);
  let pks = await getEncryptedAccountPKs();
  if (!pks) return;
  if (index < 0 || index > pks.length - 1) return;

  const encryptedDeleted = pks.splice(index, 1);
  console.info(`Deleted account ${encryptedDeleted}`);
  await browser.storage.local.set({ [ACCOUNTS_PKS_STORAGE_KEY]: pks });
};

let cachePWD: string | null = "secret_password";

// TODO: Should use types for better message type validation instead of just providing payload of type any
// TODO: Should use a class instance instead of a plain module. This way, main will be able to use accounts easily
export const burnerWalletsListener: ExternalMessageCallback = async (
  message,
  sender
) => {
  console.log(message, sender);

  try {
    // make sure its a valid message
    if (
      !("method" in message) ||
      ![
        "init",
        "reset",
        "unlock",
        "lock",
        "wallets",
        "add-wallet",
        "delete-wallet",
        "status",
        "ping",
      ].includes(message.method)
    ) {
      console.error("Ignored invalid message");
      return "Ignored invalid message";
    }

    switch (message.method) {
      // used for extension health status checks
      case "ping":
        return "pong";
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
      case "lock":
        if (!cachePWD) return "Must unlock first";
        cachePWD = null;
        return "locked";
      case "wallets":
        if (!cachePWD) return "Must unlock first";
        return await getBurnerWalletsAddresses(cachePWD);
      case "add-wallet":
        if (!cachePWD) return "Must unlock first";
        return await addRandomBurnerWallet(cachePWD);
      case "delete-wallet":
        if (!cachePWD) return "Must unlock first";
        return await deleteWallet(cachePWD, message.payload);
      case "reset":
        if (!cachePWD) return "Must unlock first";
        return await reset(cachePWD);
      default:
        console.error(`Unknown method: ${message.method}`);
        return `Unknown method: ${message.method}`;
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) return error.message;
    else {
      return error;
    }
  }
};
