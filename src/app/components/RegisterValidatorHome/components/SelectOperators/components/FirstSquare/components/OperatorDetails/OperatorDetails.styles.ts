import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Wrapper: {
        maxWidth: 269,
    },
    OperatorLogo: {
        width: 40,
        height: 40,
        borderRadius: 4,
        alignContent: 'flex-end',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginRight: theme.spacing(4),
        backgroundColor: 'rgba(230, 234, 247, 0.5)',
        backgroundImage: 'url(/images/operator_default_background/light.svg)',
    },
    OperatorTypeWrapper: {
        marginTop: 4,
    },
    Name: {
        fontSize: 16,
        marginRight: 8,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray90,
    },
    OperatorType: {
      marginTop: 4,
    },
    Address: {
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: 1.5,
        color: 'rgb(161, 172, 190)',
    },
}));
