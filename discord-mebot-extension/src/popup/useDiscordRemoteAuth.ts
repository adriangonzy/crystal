import { useEffect, useState } from "react";
import { RemoteAuthClient } from "../remote_auth/discord-remote-auth";

const client = new RemoteAuthClient(true);

export interface DiscordUser {
  id: string;
  discriminator: string;
  avatar: string;
  username: string;
}

export const useDiscordRemoteAuth = () => {
  const [QRCodeURL, setQRCodeURL] = useState<string | undefined>();

  useEffect(() => {
    client.addEventListener("pendingRemoteInit", (e) => {
      const fingerprint = (e as CustomEvent).detail;
      const data = `https://discordapp.com/ra/${fingerprint}`;
      setQRCodeURL(
        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${data}`
      );
    });

    client.addEventListener("pendingFinish", (e) => {
      const user = (e as CustomEvent).detail as DiscordUser;
      console.log("Incoming User:", user);
    });
    client.addEventListener("finish", (e) => {
      const token = (e as CustomEvent).detail;
      console.log("Token:", token);
    });
    client.addEventListener("close", () => {
      console.log("Closed connection");
    });
  }, []);

  return {
    connect: async () => {
      await client.init();
      client.connect();
    },
    QRCodeURL,
  };
};
