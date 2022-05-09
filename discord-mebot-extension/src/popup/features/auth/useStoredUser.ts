import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DiscordUser } from "./useDiscordRemoteAuth";

export interface StoredUser {
  user: DiscordUser;
  fingerprint: string;
  token: string;
}

const USER_STORAGE_KEY = "USER";

export const getStoredUser = async (): Promise<StoredUser | null> => {
  const result = await browser.storage.local.get(USER_STORAGE_KEY);
  if (!result || !result[USER_STORAGE_KEY]) return null;
  else return JSON.parse(result[USER_STORAGE_KEY]) as StoredUser;
};

const saveUser = async (user: StoredUser): Promise<void> => {
  const result = await browser.storage.local.get(USER_STORAGE_KEY);

  if (result && result[USER_STORAGE_KEY])
    throw new Error("A user is already stored");

  return await browser.storage.local.set({
    [USER_STORAGE_KEY]: JSON.stringify(user),
  });
};

export const useUser = (): {
  user: StoredUser | null;
  saveUser: (user: StoredUser) => Promise<void>;
} => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getStoredUser().then((user) => {
      if (!user) navigate("/login");
      setUser(user);
    });
  });

  return {
    user,
    saveUser,
  };
};
