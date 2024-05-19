import { darkTheme as darkThemeCreator, lightTheme as lightThemeCreator } from '@rainbow-me/rainbowkit';
import { merge } from 'lodash';

type Theme = ReturnType<typeof lightThemeCreator>;

const light: Theme = merge(
  {},
  lightThemeCreator({
    accentColor: '#1BA5F8',
    fontStack: 'system',
    overlayBlur: 'small'
  }),
  {
    colors: {
      connectButtonBackground: 'red',
      closeButton: '#606565',
      closeButtonBackground: '#EEEFEF',
      menuItemBackground: '#E6EAF7',
      selectedOptionBorder: '#1BA5F8',
      profileActionHover: '#E6EAF7',
      profileForeground: '#F4F7FA',
      modalTextSecondary: '#63768B'
    },
    shadows: {
      profileDetailsAction: 'none',
      selectedOption: '0px 2px 6px 0px #0000001F'
    }
  } as Theme
);

const dark = darkThemeCreator();

export const rainbowKitTheme = {
  light,
  dark
};
