import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Wrapper: {
        gap: 8,
        alignItems: 'flex-start',
    },
    TextWrapper: {
        flexDirection: 'column',
    },
    Copy: {
        width: 14,
        height: 14,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        backgroundImage: `url(/images/copy/${theme.darkMode ? 'dark' : 'gray'}.svg)`,
    },
    OperatorLogo: {
        width: 40,
        height: 40,
        borderRadius: 4,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(230, 234, 247, 0.5)',
        backgroundImage: (props: any) => `url(${props.operatorLogo ? props.operatorLogo : '/images/operator_default_background/light.svg'})`,
    },
    OperatorTypeWrapper: {
        marginTop: 4,
    },
    Name: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: (props: any) => {
            if (props.isDeleted) return theme.colors.gray40;
            if (props.gray80) return theme.colors.gray80;
            return theme.colors.gray90;
        },
    },
    OperatorType: {
        marginTop: 2,
        alignSelf: 'flex-start',
    },
    Id: {
        fontSize: 14,
        marginTop: -6,
        fontWeight: 500,
        lineHeight: 1.62,
        alignItems: 'center',
        color: 'rgb(161, 172, 190)',
    },
    PrivateOperatorWrapper: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        backgroundColor : theme.colors.white,
        border: `1px solid ${theme.colors.gray10}`,
        position: 'relative',
        bottom: '14px',
        right: '14px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    PrivateOperatorLockIcon: {
        width: 16,
        height: 16,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/lock/active_${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
}));
