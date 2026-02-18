const isDev = import.meta.env.DEV;
export const MAINNET_HOST = isDev ? "app.localhost:3000" : "app.ssv.network";
export const HOODI_HOST = isDev
  ? "app.hoodi.localhost:3000"
  : "app.hoodi.ssv.network";

export const isMainnetEnvironment = document.location.host === MAINNET_HOST;
export const isHoodiEnvironment = document.location.host === HOODI_HOST;
