declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        colors?: any
        darkMode?: any
        appSpacing?: any
        applicationBackgroundColor?: any
    }

    interface ThemeOptions {
        colors?: any
        darkMode?: any
        appSpacing?: any
        applicationBackgroundColor?: any
    }
}

type ThemeParams = {
    isDarkMode?: boolean,
};

export const AppTheme = ({ isDarkMode }: ThemeParams): any => {
    return {
        spacing: 4,
        darkMode: isDarkMode,
        applicationBackgroundColor: isDarkMode ? '#011627' : '#f4f7fa',
        colors: {
            gray20: isDarkMode ? '#34455a' : '#e6eaf7',
            gray40: '#97a5ba',
            black: isDarkMode ? '#fdfefe' : '#011627',
            white: isDarkMode ? '#011627' : '#fdfefe',
            primaryBlue: '#1ba5f8',
            primaryBlueTint90: isDarkMode ? '#033a5d' : '#e8f6fe',
            squareScreenBackground: isDarkMode ? '#0b2a3c' : '#fdfefe',
            primarySuccessRegular: isDarkMode ? '#08c858' : '#08c858',
            primarySuccessDark: isDarkMode ? '#08c858' : '#06b64f',
            primaryErrorRegular: isDarkMode ? 'rgba(236, 28, 38, 0.32)' : 'rgba(236, 28, 38, 0.12)',
        },
    };
};