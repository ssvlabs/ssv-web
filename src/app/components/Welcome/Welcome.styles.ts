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
    LinkButtonWrapper: {
        width: 280,
        height: 60,
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        '&:nth-of-type(1)': {
            marginRight: '20px',
        },
    },
    OrLineWrapper: {
        marginTop: 21,
        alignItems: 'center',
    },
    Line: {
        width: 260,
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
}));