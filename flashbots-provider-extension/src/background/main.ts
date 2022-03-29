import { sendMessage } from "webext-bridge";
import browser from "webextension-polyfill";
import { appListener } from "./app";

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import("/@vite/client");
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log("Extension installed");
});

// Open Main page when clicking extension
browser.browserAction.onClicked.addListener(async () => {
  // must be a page that has web3 injected
  browser.tabs.create({ url: "http://localhost:3000" });
});

// Accounts management
browser.runtime.onMessageExternal.addListener(appListener);
