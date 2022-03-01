import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Table: {
        borderRadius: 8,
        // backgroundColor: theme.colors.white,
        backgroundColor: theme.colors.applicationBackgroundColor,
    },
}));