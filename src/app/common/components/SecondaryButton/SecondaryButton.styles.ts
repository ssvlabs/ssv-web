import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    SecondaryButton: {
        height: 60,
        width: '100%',
        fontSize: 16,
        fontWeight: 600,
        borderRadius: 8,
        lineHeight: 1.25,
        transition: 'none',
        textTransform: (props: any) => props.noCamelCase ? 'none' : 'capitalize',
        color: theme.colors.primaryBlue,
        fontFamily: 'Manrope !important',
        backgroundColor: theme.colors.tint90,
        '&:hover': {
            backgroundColor: theme.colors.tint80,
        },
        '&:active': {
            backgroundColor: theme.colors.tint70,
        },
        '&:disable': {
            color: theme.colors.gray40,
            backgroundColor: theme.colors.gray20,
        },
    },
}));