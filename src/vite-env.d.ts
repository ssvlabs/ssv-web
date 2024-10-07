/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SSV_NETWORKS: {
    networkId: number;
    api: string;
    apiVersion: string;
    apiNetwork: string;
    explorerUrl: string;
    insufficientBalanceUrl: string;
    googleTagSecret?: string;
    tokenAddress: `0x${string}`;
    setterContractAddress: `0x${string}`;
    getterContractAddress: `0x${string}`;
  }[];
}

declare const APP_VERSION: string;
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.avif" {
  const src: string;
  export default src;
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import type * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}
declare module "*.svg?react" {
  import type { FunctionComponent, SVGAttributes } from "react";
  const content: FunctionComponent<SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
