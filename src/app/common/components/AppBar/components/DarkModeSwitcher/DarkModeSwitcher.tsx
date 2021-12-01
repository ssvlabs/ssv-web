import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/Application.store';

const DarkModeButton = styled(IconButton)`
  cursor: pointer;
`;

const DarkModeSwitcher = ({ style }: { style?: any }) => {
    const stores = useStores();
    const applicationStore: ApplicationStore = stores.Application;

    return (
      <DarkModeButton onClick={() => applicationStore.switchDarkMode()} aria-label="Switch Dark/Light Mode" style={style ?? {}}>
        {!applicationStore.isDarkMode && <Brightness4Icon style={{ color: 'white' }} /> }
        {applicationStore.isDarkMode && <Brightness7Icon style={{ color: 'white' }} /> }
      </DarkModeButton>
    );
};

export default observer(DarkModeSwitcher);
