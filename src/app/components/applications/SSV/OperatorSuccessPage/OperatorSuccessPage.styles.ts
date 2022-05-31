import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Wrapper: {
        position: 'relative',
    },
    BackgroundImage: {
        zIndex: 0,
        top: -95,
        width: 236,
        height: 324,
        right: -104,
        position: 'absolute',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: theme.darkMode ? 0.5 : 0.05,
        backgroundImage: `url(/images/logo/${theme.darkMode ? 'small_light' : 'small_light'}.svg)`,
    },
    Text: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
    },
    LightText: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.14,
        color: theme.colors.gray40,
    },
    OperatorAddressWrapper: {
        zIndex: 1,
        height: 50,
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 8,
        lineHeight: 1.62,
        marginBottom: 24,
        alignItems: 'center',
        color: theme.colors.gray90,
        padding: '13px 15px 10px 16px',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.white,
        border: `solid 1px ${theme.colors.gray30}`,
},
}));
