import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import Checkbox from '@material-ui/core/Checkbox';
import { useStyles } from './Confirmation.styles';
import Header from '~app/common/components/Header';
import SsvStore from '~app/common/stores/Ssv.store';
import Typography from '@material-ui/core/Typography';
import config, { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet.store';
import DataSection from '~app/common/components/DataSection';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import BackNavigation from '~app/common/components/BackNavigation';

const UnderLine = styled.div`
  display: flex;
  width: 100%;
  border-bottom: solid 1px #efefef;
  margin-bottom: 10px;
  margin-top: 20px;
`;

const ConfirmationScreen = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const ssv: SsvStore = stores.ssv;
    const wallet: WalletStore = stores.wallet;
    const checkboxLabelStyle = { fontSize: '14px' };
    const registerButtonStyle = { width: '100%', marginTop: 30 };
    const [userAgreed, setUserAgreed] = useState(false);

    useEffect(() => {
        const shouldRedirect = !ssv.newOperatorKeys.pubKey && !ssv.newOperatorKeys.name;
        if (shouldRedirect) history.push(config.routes.OPERATOR.START);
    }, [ssv.newOperatorKeys.pubKey, ssv.newOperatorKeys.name]);

    const onRegisterClick = async () => {
        await wallet.connect();
         ssv.addNewOperator().then(() => {
             history.push(config.routes.OPERATOR.SUCCESS_PAGE);
         }).catch((error) => {
             history.push(config.routes.OPERATOR.SUCCESS_PAGE);
             console.log(error);
         });
    };

    const keyDisplayName = (key: string) => {
        return `${key.substr(0, 10)}...${key.substr(key.length - 10, 10)}`;
    };

    const normalizeNumber = (number: number) => {
        return number.toFixed(2);
    };

    return (
      <Paper className={classes.mainContainer}>
        <BackNavigation to={config.routes.OPERATOR.START} text="Register Operator" />
        <Header title={translations.OPERATOR.CONFIRMATION.TITLE} subtitle={translations.OPERATOR.CONFIRMATION.DESCRIPTION} />
        <Grid container direction="column" justify="center" alignItems="center">
          <DataSection withTitle title={'Operator'}>
            <p>name</p>
            <p>{ssv.newOperatorKeys.name}</p>
          </DataSection>
          <DataSection withTitle={false}>
            <p>key</p>
            <p>{keyDisplayName(ssv.newOperatorKeys.pubKey)}</p>
          </DataSection>
          <UnderLine />
          <DataSection withTitle title={'Est. Transaction Cost'}>
            <p>Transaction fee</p>
            <p>{ssv.estimationGas}ETH <strong>${normalizeNumber(ssv.dollarEstimationGas)}</strong></p>
          </DataSection>
          <DataSection withTitle={false}>
            <p><strong>Total</strong></p>
            <p><strong>${normalizeNumber(ssv.dollarEstimationGas)}</strong></p>
          </DataSection>
          <UnderLine />
          <Grid container direction="row" justify="space-between" alignItems="center" item xs={12} spacing={1}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={userAgreed}
                  onChange={(event) => { setUserAgreed(event.target.checked); }}
                  color="primary"
                        />
                    )}
              label={<Typography style={checkboxLabelStyle}>I have read and agree to the terms & conditions</Typography>}
              style={checkboxLabelStyle}
                />
            <Button
              disabled={!userAgreed}
              variant="contained"
              color="primary"
              style={registerButtonStyle}
              onClick={onRegisterClick}
              >
              Register Operator
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
};

export default observer(ConfirmationScreen);
