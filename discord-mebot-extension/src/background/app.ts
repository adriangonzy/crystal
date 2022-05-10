import browser from "webextension-polyfill";

type ExternalMessageCallback = (
  message: any,
  sender: browser.Runtime.MessageSender
) => void | Promise<any>;

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
