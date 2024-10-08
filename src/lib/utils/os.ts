import bowser from "bowser";
export const OSName = bowser.getParser(window.navigator.userAgent).getOSName();

export const isWindows = bowser
  .getParser(window.navigator.userAgent)
  .getOSName(true)
  .includes("windows");

export const isMac = bowser
  .getParser(window.navigator.userAgent)
  .getOSName(true)
  .includes("mac");

export const isLinux = bowser
  .getParser(window.navigator.userAgent)
  .getOSName(true)
  .includes("linux");

export const getOSName = (): "windows" | "linux" | "mac" => {
  if (isWindows) return "windows";
  if (isMac) return "mac";
  if (isLinux) return "linux";
  return "windows";
};
