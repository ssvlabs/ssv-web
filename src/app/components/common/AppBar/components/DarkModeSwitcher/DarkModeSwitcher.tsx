import React from 'react';
import { Grid } from '@mui/material';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from './DarkModeSwitcher.styles';

type Props = {
    margin?: boolean,
};

const DarkModeSwitcher = (props: Props) => {
    const stores = useStores();
    const { margin } = props;
    const applicationStore: ApplicationStore = stores.Application;
    const classes = useStyles({ isDarkMode: applicationStore.darkMode, margin });

    return (
      <Grid item container onClick={() => { applicationStore.switchDarkMode(!applicationStore.darkMode); }}>
        <Grid item className={classes.Image} />
      </Grid>
    );
};

export default observer(DarkModeSwitcher);
