import { useEffect, useState } from "react";
import { RemoteAuthClient } from "./discord-remote-auth";

const client = new RemoteAuthClient(true);

export interface DiscordUser {
  id: string;
  discriminator: string;
  avatar: string;
  username: string;
}

export interface UseDiscordRemoteAuthReturn {
  connect: () => Promise<void>;
  QRCodeURL?: string;
  fingerprint?: string;
  token?: string;
  user?: DiscordUser;
}

export const useDiscordRemoteAuth = (): UseDiscordRemoteAuthReturn => {
  const [QRCodeURL, setQRCodeURL] = useState<string | undefined>();
  const [fingerprint, setFingerprint] = useState<string | undefined>();
  const [token, setToken] = useState<string | undefined>();
  const [user, setUser] = useState<DiscordUser | undefined>();

  useEffect(() => {
    const handleRemoteInit = (e: Event) => {
      const fingerprint = (e as CustomEvent).detail;
      setFingerprint(fingerprint);
      const data = `https://discordapp.com/ra/${fingerprint}`;
      setQRCodeURL(
        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${data}`
      );
    };
    const handlePendingFinish = (e: Event) => {
      const user = (e as CustomEvent).detail as DiscordUser;
      setUser(user);
    };
    const handleFinish = (e: Event) => {
      const token = (e as CustomEvent).detail;
      setToken(token);
    };
    const handleClose = () => {};

    client.addEventListener("pendingRemoteInit", handleRemoteInit);
    client.addEventListener("pendingFinish", handlePendingFinish);
    client.addEventListener("finish", handleFinish);
    client.addEventListener("close", handleClose);
    return () => {
      client.removeEventListener("pendingRemoteInit", handleRemoteInit);
      client.removeEventListener("pendingFinish", handlePendingFinish);
      client.removeEventListener("finish", handleFinish);
      client.removeEventListener("close", handleClose);
    };
  }, []);

  return {
    connect: async () => {
      await client.init();
      client.connect();
    },
    QRCodeURL,
    fingerprint,
    user,
    token,
  };
};
