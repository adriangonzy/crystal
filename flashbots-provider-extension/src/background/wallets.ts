import SimpleCrypto from "simple-crypto-js";
import bcrypt from "bcryptjs";
import { ethers } from "ethers";

const SALT_ROUNDS = 10;
const HASH_STORAGE_KEY = "hash";
const ACCOUNTS_PKS_STORAGE_KEY = "accounts";

export const reset = async (password: string): Promise<void> => {
  await checkPassword(password);
  return await browser.storage.local.set({
    [HASH_STORAGE_KEY]: null,
    [ACCOUNTS_PKS_STORAGE_KEY]: null,
  });
};

export const getStoredPasswordHash = async (): Promise<string | null> => {
  const result = await browser.storage.local.get(HASH_STORAGE_KEY);
  if (!result || !result[HASH_STORAGE_KEY]) return null;
  else return result[HASH_STORAGE_KEY];
};

export const savePassword = async (password: string): Promise<void> => {
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

export const checkPassword = async (password: string): Promise<void> => {
  const hash = await getStoredPasswordHash();
  if (!hash) throw new Error("No stored hash to compare with.");

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) =>
      result ? resolve() : reject(err)
    );
  });
};

export const getEncryptedAccountPKs = async () => {
  const { [ACCOUNTS_PKS_STORAGE_KEY]: pks } = await browser.storage.local.get(
    ACCOUNTS_PKS_STORAGE_KEY
  );
  console.log(pks);
  return pks as string[];
};

export const getDecryptedAccountPKs = async (password: string) => {
  await checkPassword(password);
  const pks = (await getEncryptedAccountPKs()).map(
    (encryptedPK) => new SimpleCrypto(password).decrypt(encryptedPK) as string
  );
  return pks;
};

export const getBurnerWalletsAddresses = async (password: string) => {
  await checkPassword(password);
  const addresses = (await getDecryptedAccountPKs(password)).map(
    (pk) => new ethers.Wallet(pk).address
  );
  console.log(addresses);
  return addresses;
};

export const addRandomBurnerWallet = async (password: string) => {
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

export const deleteWallet = async (password: string, index: number) => {
  await checkPassword(password);
  let pks = await getEncryptedAccountPKs();
  if (!pks) return;
  if (index < 0 || index > pks.length - 1) return;

  const encryptedDeleted = pks.splice(index, 1);
  console.info(`Deleted account ${encryptedDeleted}`);
  await browser.storage.local.set({ [ACCOUNTS_PKS_STORAGE_KEY]: pks });
};
