import { useCallback } from "react";
import { useExtension } from "./useExtension";

export const Popup = () => {
  const { sendMessage, extensionInstalled } = useExtension();

  const onClick = useCallback(() => {
    sendMessage({
      method: "test",
    });
  }, []);

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
