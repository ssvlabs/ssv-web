import TableCell from '@material-ui/core/TableCell';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
const StyledCell = withStyles((theme: Theme) => createStyles({
  head: {
    color: '#7F7F7F',
    height: 62,
  },
  body: {
    fontSize: 14,
    height: 62,
  },
}))(TableCell);

export default StyledCell;
