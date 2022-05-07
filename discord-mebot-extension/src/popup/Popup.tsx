import { useCallback, useEffect } from "react";
import { useDiscordRemoteAuth } from "./useDiscordRemoteAuth";
import { useExtension } from "./useExtension";

export const Popup = () => {
  const { sendMessage, extensionInstalled } = useExtension();

  const { connect, QRCodeURL } = useDiscordRemoteAuth();

  const onClick = useCallback(async () => {
    connect();
    sendMessage({
      method: "test",
    });
  }, [sendMessage, connect]);

  console.log(QRCodeURL);

  return (
    <div className="popup-container">
      <button className="btn" onClick={onClick}>
        Send Message
      </button>
    </div>
  );
};

// TODO:
/**
 - [] faire une mini lib / hook pour envoyer des messages sur un channel d’un server discord
 - [] mettre un moyen de listen les reponses aux messages pour reagir
 - [] formulaire pour configurer ajout de token, serveur ids, channels
  -> on stock le token encrypte et on met un password ?
 */
