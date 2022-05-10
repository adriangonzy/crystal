// Send API request with headers:

import { getSuperproperties } from "../utils/getSuperproperties";

// POST to https://discord.com/api/v9/{server or guild id}/channels/

// "Referer": "https://discord.com/channels/@me",
// Origin -> discord.com
// X-Super-Properties:  {TODO: base64 superproperties} -> used for tracking with api/tracking or api/science
// X-Fingerprint: -> generated on first login on client... -> used for tracking with api/tracking or api/science

// body: {
//   data: {
//     {
//       "content": message
//     }
//   }
// }

// TODO:
// - [ ] Test remote auth lib on backscript or popup script -> gateway
// - [ ] rest api wrapper
//    -> get fingerprint -> can get from gateway login probably
//    -> get x-propterties -> easy
// - [ ] get guilds -> rest api
// - [ ] get guild channels -> rest api
// - [ ] get last messages -> rest api
// - [ ] send message -> rest api

// Du coup ce que je vais faire:
// login screen -> scan qrcode
// optional -> provide password for localy encrypting token -> might do later
// get user guilds / servers
// Create a “chatbot” for one channel -> might be able to make many at the same time
// ask user to select guild / server
// get guild / server channels
// ask user to select channel
// get messages from channel periodically -> every 10 sec ? 1m ?
// check if replies maybe ?
// send message every X time to channel -> query IA api and provide last messages from channel to react realistically
// possible issues for slow time channels ?
// Allow for disabling chatbots, or deleting
// Logout
// Then, we can do nft checking stuff on top wen a proto is ready (or in //)

export const useDiscordApi = () => {
  getSuperproperties().then((props) => console.log(props));
  return {};
};
