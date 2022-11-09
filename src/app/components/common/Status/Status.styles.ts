import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Status: {
        borderRadius: 4,
        '& p': {
            fontSize: 14,
            margin: 'auto',
            fontWeight: 500,
            textTransform: 'capitalize',
            // padding: '1px 6px',
        },
    },
    Active: {
        width: 54,
        height: 26,
        color: theme.colors.primarySuccessDark,
        backgroundColor: theme.colors.primarySuccessRegularOpacity,

    },
    NoValidators: {
        width: 99,
        height: 26,
        color: theme.colors.gray80,
        backgroundColor: theme.colors.gray20,
    },
    Inactive: {
        width: 65,
        height: 26,
        color: theme.colors.primaryError,
        backgroundColor: theme.colors.primaryErrorRegular,
    },
}));