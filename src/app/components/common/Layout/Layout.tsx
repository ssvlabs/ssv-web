import Grid from '@mui/material/Grid';
import { TransactionPendingPopUp } from '~app/components/applications/SSV/TransactionPendingPopUp';
import { useStyles } from '~app/components/common/Layout/Layout.styles';
import { cn } from '~lib/utils/tailwind';

const Layout = ({ children }: any) => {
  const classes = useStyles();

  return (
    <>
      <div className={cn(classes.Root, 'flex flex-col h-screen overflow-auto')}>{children}</div>
      <TransactionPendingPopUp />
    </>
  );

  return (
    <Grid container className={classes.Root} spacing={0} justifyContent="center">
      <Grid item xs={12}></Grid>
      <TransactionPendingPopUp />
    </Grid>
  );
};

export default Layout;
