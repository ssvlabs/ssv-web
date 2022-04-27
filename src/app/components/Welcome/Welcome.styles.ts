import screenSizes from '~lib/utils/screenSizes';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Header: {
        fontSize: 20,
        lineHeight: 1.4,
        fontWeight: 'bold',
        color: theme.colors.gray90,
        marginBottom: theme.spacing(3),
    },
    SubHeader: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
        marginBottom: theme.spacing(10),
    },
    LinkButtonsWrapper: {
        justify: 'space-evenly',
        width: '100%',
        [screenSizes.xs]: {
            flexDirection: 'column',
        },
    },
    LinkButtonWrapper: {
        height: 60,
        width: 280,
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        '&:nth-of-type(1)': {
            marginRight: '20px',
        },
        [screenSizes.xs]: {
            width: '100%',
            '&:nth-of-type(1)': {
                marginBottom: '20px',
            },
        },
        [screenSizes.md]: {
            width: 182,
        },
    },
    OrLineWrapper: {
        marginTop: 21,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(5),
    },
    Line: {
        height: 1,
        border: `solid 1px ${theme.colors.gray20}`,
    },
    Or: {
        width: 64,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.62,
        textAlign: 'center',
        color: theme.colors.gray40,
    },
    ConnectButton: {
        height: 60,
        width: '100%',
        marginTop: 30,
        color: theme.colors.white,
        backgroundColor: theme.colors.primaryBlue,
        '&:hover': {
            backgroundColor: theme.colors.shade20,
        },
        '&:focus': {
            backgroundColor: theme.colors.shade40,
        },
        '&:disable': {
            color: theme.colors.gray40,
            backgroundColor: theme.colors.gray20,
        },
    },
    ImageWrapper: {
        width: 256,
        height: 220,
        margin: 'auto',
        cursor: 'pointer',
        marginBottom: 40,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/claim/light.svg)',
    },
}));