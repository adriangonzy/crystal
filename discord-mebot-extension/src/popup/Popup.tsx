import { useAuth } from "./features/auth/AuthProvider";
import { useDiscordApi } from "./features/discord/api/useDiscordApi";

export const Popup = () => {
  const { user } = useAuth();
  useDiscordApi();

  return (
    <div className="popup-container">
      <h1 className="text-lg text-white">Hi {user?.user.username} !</h1>
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
