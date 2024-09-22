import { createPersistedProxyHook } from "@/lib/utils/valtio";

export const useTheme = createPersistedProxyHook(
  "ssv-web-theme",
  { dark: true },
  {
    onChange: (state) => {
      if (state.dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  },
);
