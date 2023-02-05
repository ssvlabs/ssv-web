import { TableRow } from '@mui/material';
import { createStyles, withStyles } from '@mui/styles';
import BaseStore from '~app/common/stores/BaseStore';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';

const applicationStore: ApplicationStore = BaseStore.getInstance().getStore('Application');

// @ts-ignore
const StyledRow = withStyles(() => createStyles({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: applicationStore.isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#F4F6F8',
      color: applicationStore.isDarkMode ? '#A1ACBE' : 'initial',
    },
  },
}))(TableRow);

export default StyledRow;
