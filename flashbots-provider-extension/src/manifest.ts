import fs from "fs-extra";
import type { Manifest } from "webextension-polyfill";
import type PkgType from "../package.json";
import { isDev, port, r } from "../scripts/utils";

export async function getManifest() {
  const pkg = (await fs.readJSON(r("package.json"))) as typeof PkgType;

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    browser_action: {
      default_icon: "./assets/icon-512.png",
      // default_popup: './dist/popup/index.html',
    },
    options_ui: {
      page: "./dist/options/index.html",
      open_in_tab: true,
      chrome_style: false,
    },
    background: {
      page: "./dist/background/index.html",
      // persistent: true
    },
    icons: {
      16: "./assets/icon-512.png",
      48: "./assets/icon-512.png",
      128: "./assets/icon-512.png",
    },
    permissions: ["tabs", "storage", "activeTab", "http://*/", "https://*/"],
  };

  if (isDev) {
    // this is required on dev for Vite script to load
    manifest.content_security_policy = `script-src \'self\' http://localhost:${port}; object-src \'self\'`;
  }

  return {...manifest, 
    externally_connectable: {
      matches: ["*://localhost:*/*"]
    }
  };
}
