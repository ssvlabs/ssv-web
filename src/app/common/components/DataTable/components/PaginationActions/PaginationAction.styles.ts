import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => createStyles({
    Root: {
        flexShrink: 0,
        alignItems: 'center',
        marginLeft: theme.spacing(2.5),
    },
    PageRangeText: {
        height: 26,
        margin: '5px 180px 5px 0',
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray60,
    },
}));