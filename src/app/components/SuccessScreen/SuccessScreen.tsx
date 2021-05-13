import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import { useStyles } from '~app/components/SuccessScreen/SuccessScreen.styles';
import ContractOperator from '~app/common/stores/contract/ContractOperator.store';

const SuccessScreen = () => {
    const stores = useStores();
    const history = useHistory();
    const classes = useStyles();
    const contractOperator: ContractOperator = stores.ContractOperator;

    useEffect(() => {
        if (!contractOperator.newOperatorRegisterSuccessfully) {
            history.push(config.routes.OPERATOR.HOME);
        }
    }, [contractOperator.newOperatorRegisterSuccessfully]);

    return (
      <Paper className={classes.mainContainer}>
        <Grid className={classes.gridContainer} container direction="column" justify="center" alignItems="center">
          <img className={classes.successIcon} src={'/images/checked.svg'} />
          <Header centralize title={translations.OPERATOR.SUCCESS.TITLE} subtitle={translations.OPERATOR.SUCCESS.DESCRIPTION} />
          <img className={classes.congratsIcon} src={'/images/congrats.svg'} />
          <Paper className={classes.guideStepsContainerPaper}>
            <Grid container wrap="nowrap" spacing={1}>
              <Grid item md={8} xs={8}>
                <Typography noWrap variant="h6" className={classes.guideStepText}>Monitor Node</Typography>
                <Typography noWrap variant="caption">View yout operator performance in out explorer</Typography>
              </Grid>
              <Grid item md={4} xs={4}>
                <ArrowForwardIosIcon className={classes.arrowIcon} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Paper>
    );
};

export default observer(SuccessScreen);
