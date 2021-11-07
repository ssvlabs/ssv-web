type ThemeParams = {
  isDarkMode?: boolean,
};

export const grayBackgroundColor = '#A1ACBE';

export const infoIconStyle = {
  fontSize: 14,
  color: grayBackgroundColor,
};

export const defaultFont = '"Encode Sans", "Roboto", "Helvetica", "Arial", sans-serif';

export const AppTheme = ({ isDarkMode }: ThemeParams): any => {
  return {
    palette: {
      type: isDarkMode ? 'dark' : 'light',
      divider: '#5B6C84',
    },
    typography: {
      fontFamily: defaultFont,
      color: '#2A323E',
      h1: {
        fontSize: 28,
        fontFamily: defaultFont,
        fontWeight: 900,
        color: '#20EEC8',
        verticalAlign: 'middle',
        paddingTop: 24,
        paddingBottom: 24,
      },
    },
  };
};
