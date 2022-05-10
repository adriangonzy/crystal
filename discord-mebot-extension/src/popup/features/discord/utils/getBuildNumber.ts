const channels = ["canary", "ptb", "stable"];

export const getBuildNumber = async (channel = "stable") => {
  if (!channels.includes(channel))
    throw new Error("Given channel does not exist!");

  const channelPrefix = channel === "stable" ? "" : channel + ".";
  const mainurl = `https://${channelPrefix}discordapp.com/app`;

  const response = await fetch(mainurl);
  const headers = response.headers;
  const buildID = headers.get("x-build-id");

  const appHTML = await response.text();
  const jsFiles = appHTML.match(/([a-zA-z0-9]+)\.js/g);
  const cssFiles = appHTML.match(/((1.|0.)[a-zA-z0-9]+)\.css/g);
  const lastJSFile = jsFiles?.[jsFiles.length - 1];

  const source = await fetch(
    `https://${channelPrefix}discordapp.com/assets/${lastJSFile}`
  );
  const sourceData = await source.text();
  const buildNumberRegex = /Build Number: [0-9]+, Version Hash: [A-Za-z0-9]+/g;
  const buildstrings = sourceData
    .match(buildNumberRegex)?.[0]
    .replace(" ", "")
    .split(",");

  const [buildNum, buildHash] = buildstrings?.map((str) =>
    str.split(":").pop()?.replace(" ", "")
  ) || ["", ""];

  return {
    buildID,
    buildNum,
    buildHash,
    jsFiles,
    cssFiles,
  };
};
