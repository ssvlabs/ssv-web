import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Wrapper: {
        gap: 10,
        borderRadius: 2,
        padding: '12px 16px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: theme.spacing(5),
        border: `solid 1px ${theme.colors.primaryError}`,
        backgroundColor: theme.colors.primaryErrorRegular,
    },
}));
