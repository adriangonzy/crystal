import { useAuth } from "./features/auth/AuthProvider";

export const Popup = () => {
  const { user } = useAuth();

  return <div className="popup-container">POPUP YO AFTER LOGIN {{ user }}</div>;
};

// TODO:
/**
 - [] faire une mini lib / hook pour envoyer des messages sur un channel d’un server discord
 - [] mettre un moyen de listen les reponses aux messages pour reagir
 - [] formulaire pour configurer ajout de token, serveur ids, channels
  -> on stock le token encrypte et on met un password ?
 */
