import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Text: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
    },
    SubHeader: {
        marginBottom: theme.spacing(5),
    },
    SubImageText: {
        marginBottom: theme.spacing(10),
    },
    SuccessLogo: {
        height: 320,
        width: '100%',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginBottom: theme.spacing(5),
    },
    Operator: {
        backgroundImage: `url(/images/success_screen/operator/${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    Validator: {
        backgroundImage: `url(/images/success_screen/validator/${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
}));
