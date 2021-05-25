import React from 'react';
import { observer } from 'mobx-react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Main from '~app/components/Routes';
import AppBar from '~app/common/components/AppBar';

const App = () => {
  return (
    <>
      <AppBar />
      <Main />
      <CssBaseline />
    </>
  );
};

export default observer(App);
