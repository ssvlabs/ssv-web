import { TableCell } from '@mui/material';
import { createStyles, withStyles } from '@mui/styles';

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
// @ts-ignore
const StyledCell = withStyles((theme) => createStyles({
    head: {
        height: 36,
        padding: 0,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray40,
        backgroundColor: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.gray20}`,
    },
    body: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        cursor: 'pointer',
        padding: '12px 0 12px',
        color: theme.colors.gray90,
        borderBottom: `1px solid ${theme.colors.gray20}`,
    },
}))(TableCell);

export default StyledCell;
