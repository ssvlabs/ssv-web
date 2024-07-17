import {
  darkTheme as darkThemeCreator,
  lightTheme as lightThemeCreator,
} from "@rainbow-me/rainbowkit";
import merge from "lodash-es/merge";

type Theme = ReturnType<typeof lightThemeCreator>;

const light: Theme = merge(
  {},
  lightThemeCreator({
    accentColor: "#1BA5F8",
    fontStack: "system",
    overlayBlur: "small",
  }),
  {
    colors: {
      connectButtonBackground: "red",
      closeButton: "#606565",
      closeButtonBackground: "#EEEFEF",
      menuItemBackground: "#E6EAF7",
      selectedOptionBorder: "#1BA5F8",
      profileActionHover: "#E6EAF7",
      profileForeground: "#F4F7FA",
      modalTextSecondary: "#63768B",
    },
    shadows: {
      profileDetailsAction: "none",
      selectedOption: "none",
      dialog: "none",
    },
  } as Theme,
);

const dark = merge(
  {},
  darkThemeCreator({
    accentColor: "#1BA5F8",
    fontStack: "system",
    overlayBlur: "small",
  }),
  {
    colors: {
      connectButtonBackground: "red",
      closeButton: "#CBD3E5",
      closeButtonBackground: "#102434",
      menuItemBackground: "#34455A",
      selectedOptionBorder: "#1BA5F8",
      profileAction: "#0B2A3C",
      profileActionHover: "#34455A",
      profileForeground: "#011627",
      modalTextSecondary: "#63768B",
      modalBackground: "#0B2A3C",
      modalBackdrop: "rgba(253, 254, 254, 0.2)",
      modalBorder: "transparent",
    },
    shadows: {
      profileDetailsAction: "none",
      selectedOption: "none",
      dialog: "none",
    },
  } as Theme,
);

export const rainbowKitTheme = {
  light,
  dark,
};
