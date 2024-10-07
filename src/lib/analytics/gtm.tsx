import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useEffect, useRef } from "react";

export const GOOGLE_TAG_MANAGER_URL =
  "https://www.googletagmanager.com/gtm.js?id=";

export const GTMFrame = () => {
  const scriptCreatedRef = useRef(false);
  const ssvNetwork = useSSVNetworkDetails();

  useEffect(() => {
    if (!scriptCreatedRef.current) {
      // @ts-expect-error window.dataLayer is not defined in the global scope
      window.dataLayer = window.dataLayer || [];
      // @ts-expect-error window.dataLayer is not defined in the global scope
      window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });

      const scriptElement = document.createElement("script");
      scriptElement.src = `${GOOGLE_TAG_MANAGER_URL}${ssvNetwork.googleTagSecret}`;

      const container = document.getElementById("root");
      container?.appendChild(scriptElement);

      scriptCreatedRef.current = true;
    }
  }, [ssvNetwork.googleTagSecret]);

  return (
    <noscript>
      <div id="gtmContainer" />;
    </noscript>
  );
};
