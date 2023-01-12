import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Wrapper: {
        alignItems: 'flex-start',
    },
    TextWrapper: {
        marginLeft: 16,
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
        backgroundImage: (props: any) => `url(${props.operatorLogo ?? '/images/operator_default_background/light.svg'})`,
    },
    OperatorTypeWrapper: {
        marginTop: 4,
    },
    Name: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: (props: any) => props.gray80 ? theme.colors.gray80 : theme.colors.gray90,
    },
    OperatorType: {
        marginTop: 5,
        marginLeft: 8,
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
}));
