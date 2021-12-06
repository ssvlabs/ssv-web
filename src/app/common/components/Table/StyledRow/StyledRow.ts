import TableRow from '@material-ui/core/TableRow';
import { createStyles, withStyles } from '@material-ui/core/styles';

const StyledRow = withStyles(() => createStyles({
  root: {
    '&:nth-of-type(odd)': {
      // backgroundColor: '#F4F6F8',
      color: 'initial',
    },
  },
}))(TableRow);

export default StyledRow;
