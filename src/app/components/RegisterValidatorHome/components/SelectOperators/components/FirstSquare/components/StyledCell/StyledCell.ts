import TableCell from '@material-ui/core/TableCell';
import { createStyles, withStyles } from '@material-ui/core/styles';

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
const StyledCell = withStyles((theme) => createStyles({
    head: {
        height: 36,
        padding: 0,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray40,
        backgroundColor: theme.colors.white,
    },
    body: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        cursor: 'pointer',
        // borderBottom: `solid 1px ${theme.colors.gray40}`,
        padding: '12px 0 12px',
        color: theme.colors.gray90,
    },
}))(TableCell);

export default StyledCell;
