import browser from "webextension-polyfill";

type ExternalMessageCallback = (
  message: any,
  sender: browser.Runtime.MessageSender
) => void | Promise<any>;

const RATITEST_TOKEN =
  "OTYwMjU0NzUxNDQwNzg5NTE1.Yknxag.xTe6KHWMXyqD1yW-XZLK0Z6r3sM";

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

// def sendMessage(self, channelID, message, nonce, tts, embed, message_reference, allowed_mentions, sticker_ids):
// 	url = self.discord+"channels/"+channelID+"/messages"
// 	body = {"content": message, "tts": tts}
// 	if nonce == "calculate":
// 		nonce = calculateNonce()
// 	else:
// 		nonce = str(nonce)
// 	body["nonce"] = nonce
// 	if embed != None:
// 		body["embed"] = embed
// 	if message_reference != None:
// 		body["message_reference"] = message_reference
// 	if allowed_mentions != None:
// 		body["allowed_mentions"] = allowed_mentions
// 	if sticker_ids != None:
// 		body["sticker_ids"] = sticker_ids
// 	return Wrapper.sendRequest(self.s, 'post', url, body, log=self.log)

/*  TODO:

POST to https://discord.com/api/v9/{server or guild id}/channels/

base = {
			"Accept": "{change here}",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": '{},{};q=0.9'.format(locale, locale.split('-')[0]),
			"Cache-Control": "no-cache",
			"Content-Type": "application/json",
			"Pragma": "no-cache",
			"Referer": "https://discord.com/channels/@me",
			"Sec-Ch-Ua": '" Not A;Brand";v="99", "Chromium";v="{0}", "Google Chrome";v="{0}"'.format(parsed_ua['user_agent']['major']),
			"Sec-Ch-Ua-Mobile": '?0',
			"Sec-Ch-Ua-Platform": '"{}"'.format(parsed_ua['os']['family']),
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "cors",
			"Sec-Fetch-Site": "same-origin",
			"User-Agent": self.__user_agent,
			"X-Debug-Options": "bugReporterEnabled",
			"X-Discord-Locale": locale,
			"Origin": "https://discord.com"
		}

Add:

Session headers: 
  - 
  - Authorization

X-Super-Properties:  {TODO: base64 superproperties} -> used for tracking with api/tracking or api/science
X-Fingerprint: -> generated on first login on client... -> used for tracking with api/tracking or api/science 
  -> this might be hard, or will not allow to just give token
  -> GET api/v9/experiments might be enough for getting the fingerprint

body: {
  data: {
    {
      "content": message
    }
  }
}

**/

export const appListener: ExternalMessageCallback = async (message, sender) => {
  try {
    // make sure its a valid message
    if (
      !("method" in message) ||
      ![
        // general
        "ping",
        "test",
      ].includes(message.method)
    ) {
      console.error("Ignored invalid message");
      return "Ignored invalid message";
    }

    if (message.method !== "ping") console.log(message, sender);

    switch (message.method) {
      // general
      // used for extension health status checks
      case "ping":
        return "pong";

      case "test":
        console.log("received test");
        // const response = await fetch("https://meditect.com");
        // console.log(await response.text());
        break;

      default:
        return "ratillas";
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) return error.message;
    else {
      return error;
    }
  }
};
