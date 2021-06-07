import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import { translations } from '~app/common/config';
import Header from '~app/common/components/Header';
import { useStyles } from '~app/components/SuccessScreen/SuccessScreen.styles';
import ContractOperator from '~app/common/stores/contract/ContractOperator.store';
import ContractValidator from '~app/common/stores/contract/ContractValidator.store';

const SuccessScreen = () => {
  const stores = useStores();
  const classes = useStyles();
  const { redirectUrl, history } = useUserFlow();

  useEffect(() => {
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  const contractOperator: ContractOperator = stores.ContractOperator;
  const contractValidator: ContractValidator = stores.ContractValidator;
  let header: any = '';

  if (contractOperator.newOperatorRegisterSuccessfully) {
    header =
      <Header centralize title={translations.SUCCESS.TITLE} subtitle={translations.SUCCESS.OPERATOR_DESCRIPTION} />;
  } else if (contractValidator.newValidatorReceipt) {
    header =
      <Header centralize title={translations.SUCCESS.TITLE} subtitle={translations.SUCCESS.VALIDATOR_DESCRIPTION} />;
  }

  return (
    <Paper data-testid={'success-page'} className={classes.mainContainer}>
      <Grid className={classes.gridContainer} container direction="column" justify="center" alignItems="center">
        <img className={classes.successIcon} src={'/images/checked.svg'} />
        {header}
        <img className={classes.congratsImage} src={'/images/congrats.svg'} />
        <Paper className={classes.guideStepsContainerPaper}>
          <Grid container wrap="nowrap" spacing={1}>
            <Grid item md={8} xs={8}>
              <Typography noWrap variant="h6" className={classes.guideStepText}>Monitor Validator</Typography>
              <Typography noWrap variant="caption">View your operator performance in our explorer</Typography>
            </Grid>
            <Grid item md={4} xs={4}>
              <ArrowForwardIosIcon data-testid={'success-image'} className={classes.arrowIcon} />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Paper>
  );
};

export default observer(SuccessScreen);
