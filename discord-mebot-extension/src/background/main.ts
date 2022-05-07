import browser from "webextension-polyfill";
import { appListener } from "./app";

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import("/@vite/client");
}

// allows popup to open websocket connection to discord login gateway
browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    for (const h of details.requestHeaders ?? [])
      if (h.name.toLowerCase() === "origin") h.value = "https://discord.com";
    return {
      requestHeaders: details.requestHeaders,
    };
  },
  { urls: ["wss://remote-auth-gateway.discord.gg/?v=1"] },
  ["requestHeaders", "extraHeaders", "blocking"]
);

// Accounts management
browser.runtime.onMessage.addListener(appListener);
