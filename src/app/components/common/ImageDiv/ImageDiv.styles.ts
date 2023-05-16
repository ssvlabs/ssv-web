import { makeStyles } from '@mui/styles';
import BaseStore from '~app/common/stores/BaseStore';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
const applicationStore: ApplicationStore = BaseStore.getInstance().getStore('Application');
export const useStyles = makeStyles(() => ({
    Image: {
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: (props: any) => props.width ? props.width : '',
        height: (props: any) => props.height ? props.height : '',
        backgroundImage: (props: any) => `url(/images/${props.image}/${applicationStore.isDarkMode ? 'dark' : 'light'}.svg)`,
    },
}));
