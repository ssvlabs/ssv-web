import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Wrapper: {
        alignItems: 'center',
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
        backgroundImage: (props: any) => `url(${props.logo ?? '/images/operator_default_background/light.svg'})`,
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
    },
    Address: {
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.5,
        color: 'rgb(161, 172, 190)',
    },
}));
