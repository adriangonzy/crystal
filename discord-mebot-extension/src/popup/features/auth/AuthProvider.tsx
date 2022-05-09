import { encodeURL } from "js-base64";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import {
  DiscordUser,
  useDiscordRemoteAuth,
} from "../discord/auth/useDiscordRemoteAuth";

export interface StoredUser {
  user: DiscordUser;
  fingerprint: string;
  token: string;
}

const USER_STORAGE_KEY = "USER";

const getStoredUser = async (): Promise<StoredUser | null> => {
  const result = await browser.storage.local.get(USER_STORAGE_KEY);
  if (!result || !result[USER_STORAGE_KEY]) return null;
  else return JSON.parse(result[USER_STORAGE_KEY]) as StoredUser;
};

const saveStorageUser = async (user: StoredUser): Promise<void> => {
  const result = await browser.storage.local.get(USER_STORAGE_KEY);

  if (result && result[USER_STORAGE_KEY])
    throw new Error("A user is already stored");

  return await browser.storage.local.set({
    [USER_STORAGE_KEY]: JSON.stringify(user),
  });
};

const clearStorageUser = async (): Promise<void> => {
  const result = await browser.storage.local.get(USER_STORAGE_KEY);

  if (result && result[USER_STORAGE_KEY])
    throw new Error("A user is already stored");

  return await browser.storage.local.set({
    [USER_STORAGE_KEY]: null,
  });
};

interface AuthContextType {
  user: StoredUser | null;
  signin: (callback: VoidFunction) => Promise<void>;
  signout: (callback: VoidFunction) => Promise<void>;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  let [user, setUser] = useState<StoredUser | null>(null);
  let [loading, setLoading] = useState<boolean>(false);
  let [fetched, setFetched] = useState<boolean>(false);
  let [signingCB, setSigningCB] = useState<VoidFunction>();

  const {
    connect,
    QRCodeURL,
    fingerprint,
    user: discordUser,
    token,
  } = useDiscordRemoteAuth();
  const navigate = useNavigate();

  // attempt to get user from local storage
  useEffect(() => {
    if (!user && !fetched && !loading) {
      setLoading(true);
      getStoredUser()
        .then((user) => {
          setUser(user);
        })
        .finally(() => {
          setLoading(false);
          setFetched(true);
        });
    }
  }, [fetched, loading, user]);

  useEffect(() => {
    if (QRCodeURL && !user)
      navigate({
        pathname: "/login",
        search: `?${createSearchParams([["qrcode", QRCodeURL]])}`,
      });
  }, [QRCodeURL, navigate, user]);

  useEffect(() => {
    if (fingerprint && discordUser && token) {
      const toSave = {
        user: discordUser,
        fingerprint,
        token,
      };
      setUser(toSave);
      saveStorageUser(toSave).then(() => {
        if (signingCB) signingCB();
      });
    }
  }, [discordUser, fingerprint, token, signingCB]);

  const signin = useCallback(
    async (callback: VoidFunction) => {
      await connect();
      setSigningCB(callback);
    },
    [connect]
  );

  const signout = async (callback: VoidFunction) => {
    setUser(null);
    await clearStorageUser();
    callback();
  };

  const value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
