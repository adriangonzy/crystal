/* eslint-disable no-console */
import React from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import { ContentApp } from "./views/ContentApp";

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info("[vitesse-webext] Hello world from content script");

  // mount component to context window
  const container = document.createElement("div");
  const root = document.createElement("div");
  const styleEl = document.createElement("link");
  const shadowDOM =
    container.attachShadow?.({ mode: __DEV__ ? "open" : "closed" }) ||
    container;
  styleEl.setAttribute("rel", "stylesheet");
  styleEl.setAttribute(
    "href",
    browser.runtime.getURL("dist/contentScripts/style.css")
  );
  shadowDOM.appendChild(styleEl);
  shadowDOM.appendChild(root);
  document.body.appendChild(container);

  ReactDOM.render(
    <React.StrictMode>
      <ContentApp />
    </React.StrictMode>,
    root
  );
})();
