import browser from "webextension-polyfill";
import { appListener } from "./app";

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import("/@vite/client");
}

// Accounts management
browser.runtime.onMessage.addListener(appListener);
