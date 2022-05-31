import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    ScreenWrapper: {
        width: '100%',
        marginBottom: 100,
        marginTop: (props: any) => props.editPage ? '' : 28,
        '@media only screen and (max-width: 1400px)': {
            marginTop: 24,
            marginBottom: 24,
        },
    },
    DeleteOperator: {
        top: -10,
        width: 22,
        right: -10,
        height: 22,
        borderRadius: 100,
        cursor: 'pointer',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: theme.colors.gray40,
    },
    whiteLine: {
        width: 10,
        height: 1.6,
        marginTop: 10,
        margin: 'auto',
        backgroundColor: theme.colors.white,
    },
    BoxesWrapper: {
        '@media only screen and (max-width: 1400px)': {
            justifyContent: 'space-between',
        },
    },
    SelectedOperatorBox: {
        width: 360,
        height: 97,
        fontSize: 16,
        fontWeight: 500,
        borderRadius: 8,
        lineHeight: 1.62,
        position: 'relative',
        color: theme.colors.gray30,
        marginBottom: theme.spacing(5),
        padding: '28px 20px 29px 20px',
        backgroundColor: theme.colors.white,
        border: `solid 1px ${theme.colors.gray20}`,
        '@media only screen and (max-width: 1400px)': {
            maxWidth: 300,
        },
    },

    BoxPlaceHolder: {
        width: 360,
        height: 97,
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        borderRadius: 8,
        color: theme.colors.gray30,
        marginBottom: theme.spacing(5),
        padding: '24px 100px 47px 20px',
        backgroundColor: theme.colors.gray10,
        border: `dashed 1px ${theme.colors.gray30}`,
        '@media only screen and (max-width: 1400px)': {
            maxWidth: 300,
        },
    },
    WarningMessage: {
        gap: 8,
        fontSize: 14,
        borderRadius: 2,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray90,
        padding: theme.spacing(3, 4),
        marginBottom: theme.spacing(5),
        backgroundColor: 'rgba(255, 210, 10, 0.2)',
        border: `solid 1px ${theme.colors.primaryWarningRegular}`,
    },
    WarningHeader: {
        fontWeight: 'bold',
    },
    NotVerifiedText: {
        cursor: 'pointer',
        fontWeight: 'bold',
        textDecoration: 'underline',
        color: theme.colors.primaryBlue,
    },
    TotalFeesWrapper: {
        marginBottom: theme.spacing(10),
    },
    TotalFeesHeader: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray90,
        justifyContent: 'space-between',
    },
}));
