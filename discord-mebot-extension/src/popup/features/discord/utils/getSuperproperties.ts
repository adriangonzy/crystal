import UAParser from "ua-parser-js";
import { getBuildNumber } from "./getBuildNumber";

const getNavigatorLanguage = () => {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0];
  } else {
    return navigator.language || "en";
  }
};

export const getSuperproperties = async () => {
  const channel = "stable";
  const build = await getBuildNumber(channel);
  const ua = new UAParser().getResult();

  return {
    os: ua.os.name,
    browser: ua.browser.name,
    system_locale: getNavigatorLanguage(),
    browser_user_agent: ua.ua,
    browser_version: ua.browser.version,
    os_version: ua.os.version,
    release_channel: channel,
    client_build_number: build.buildNum,
    device: "",
    referrer: "",
    referring_domain: "",
    referrer_current: "",
    referring_domain_current: "",
    client_event_source: "",
  };
};
