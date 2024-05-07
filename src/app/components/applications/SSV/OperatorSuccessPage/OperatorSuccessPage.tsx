
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import LinkText from '~app/components/common/LinkText/LinkText';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import OperatorId from '~app/components/applications/SSV/MyAccount/components/OperatorId';
import { useStyles } from '~app/components/applications/SSV/OperatorSuccessPage/OperatorSuccessPage.styles';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setIsLoading } from '~app/redux/appState.slice';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';


const SetOperatorFee = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const operatorStore: OperatorStore = stores.Operator;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const dispatch = useAppDispatch();

  const moveToMyAccount = async () => {
    dispatch(setIsLoading(true));
    await myAccountStore.getOwnerAddressOperators({}).then(() => {
      dispatch(setIsLoading(false));
      navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
    });
  };

  return (
    <BorderScreen
      withoutNavigation
      body={[
        <Grid className={classes.Wrapper}>
          <Grid item className={classes.BackgroundImage}/>
          <HeaderSubHeader
            marginBottom={13}
            title={'Welcome to the SSV Network!'}
            subtitle={'Congrats, your operator is now part of the SSV network!'}
          />
          <Grid container item style={{ marginBottom: 16 }}>
            <Typography className={classes.Text}>Your network identifier is:</Typography>
          </Grid>
          <Grid>
            <OperatorId successPage id={operatorStore.newOperatorKeys.id}/>
          </Grid>
        </Grid>,
        <Grid className={classes.Wrapper}>
          <Typography className={classes.GreyHeader}>Next step:</Typography>
          <Grid container className={classes.BoxesWrapper}>
            <Grid className={classes.BoxWrapper} xs={12}>
              <LinkText text={'Enable MEV'} link={config.links.MONITOR_YOUR_NODE_URL}/>to propose MEV blocks for the
              validators you manage.
            </Grid>
          </Grid>
          <PrimaryButton text={'Manage Operator'} onClick={moveToMyAccount} size={ButtonSize.XL}/>
        </Grid>,
      ]}
    />
  );
};

export default observer(SetOperatorFee);
