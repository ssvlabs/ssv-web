import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, PrimaryButton } from '~app/atomicComponents';
import config from '~app/common/config';
import OperatorId from '~app/components/applications/SSV/MyAccount/components/OperatorId';
import { useStyles } from '~app/components/applications/SSV/OperatorSuccessPage/OperatorSuccessPage.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import LinkText from '~app/components/common/LinkText/LinkText';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setIsLoading } from '~app/redux/appState.slice';

const SetOperatorFee = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { operatorRawData } = location.state;
  console.log(operatorRawData);
  const moveToMyAccount = async () => {
    dispatch(setIsLoading(true));
    dispatch(setIsLoading(false));
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
  };

  return (
    <BorderScreen
      withoutNavigation
      body={[
        <Grid className={classes.Wrapper}>
          <Grid item className={classes.BackgroundImage} />
          <HeaderSubHeader marginBottom={13} title={'Welcome to the SSV Network!'} subtitle={'Congrats, your operator is now part of the SSV network!'} />
          <Grid container item style={{ marginBottom: 16 }}>
            <Typography className={classes.Text}>Your network identifier is:</Typography>
          </Grid>
          <Grid>
            <OperatorId successPage id={operatorRawData.id} />
          </Grid>
        </Grid>,
        <Grid className={classes.Wrapper}>
          <Typography className={classes.GreyHeader}>Next step:</Typography>
          <Grid container className={classes.BoxesWrapper}>
            <Grid className={classes.BoxWrapper} xs={12}>
              <LinkText text={'Enable MEV'} link={config.links.MONITOR_YOUR_NODE_URL} />
              to propose MEV blocks for the validators you manage.
            </Grid>
          </Grid>
          <PrimaryButton text={'Manage Operator'} onClick={moveToMyAccount} size={ButtonSize.XL} />
        </Grid>
      ]}
    />
  );
};

export default SetOperatorFee;
