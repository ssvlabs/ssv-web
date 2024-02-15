import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import config, { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import NameAndAddress from '~app/components/common/NameAndAddress';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import { decodeParameter } from '~root/services/conversions.service';
import AddressKeyInput from '~app/components/common/AddressKeyInput';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { useTermsAndConditions } from '~app/hooks/useTermsAndConditions';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/applications/SSV/OperatorConfirmation/OperatorConfirmation.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';

const OperatorConfirmation = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const operatorStore: OperatorStore = stores.Operator;
  const applicationStore: ApplicationStore = stores.Application;
  const { checkedCondition } = useTermsAndConditions();
  const [actionButtonText, setActionButtonText] = useState('Register Operator');

  const disableLoadingStates = () => {
    applicationStore.setIsLoading(false);
    applicationStore.showTransactionPendingPopUp(false);
  };

  const onRegisterClick = async () => {
    try {
      applicationStore.setIsLoading(true);
      setActionButtonText('Waiting for confirmation...');
      const operatorAdded = await operatorStore.addNewOperator();
      let publicKey = operatorStore.newOperatorKeys.publicKey;
      if (operatorAdded) {
        try  {
          publicKey = String(decodeParameter('string', operatorStore.newOperatorKeys.publicKey));
        } finally {
          console.log('Decoded public key', publicKey);
        }
        for (let i = 0; i < 20 && !operatorStore.newOperatorKeys.id; i++) {
          try {
            const operator = await Operator.getInstance().getOperatorByPublicKey(publicKey, false);
            console.log('Fetched operator by public key', operator);
            if (operator?.data?.id) {
              operatorStore.newOperatorKeys = {
                ...operatorStore.newOperatorKeys,
                id: operator.data.id,
              };
              disableLoadingStates();
              navigate(config.routes.SSV.OPERATOR.SUCCESS_PAGE);
              return;
            }
          } catch (e) {
            console.error('Failed to get operator by public key', e);
          }
          // eslint-disable-next-line @typescript-eslint/no-loop-func
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        if (!operatorStore.newOperatorKeys.id) {
          disableLoadingStates();
          navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
        }
      }
      setActionButtonText('Register Operator');
    } catch (e: any) {
      setActionButtonText('Register Operator');
    }
    disableLoadingStates();
  };

  return (
      <BorderScreen
          blackHeader
          withConversion
          sectionClass={classes.Section}
          header={translations.OPERATOR.CONFIRMATION.TITLE}
          body={[
            <Grid container>
              <Grid container style={{ gap: 34 }}>
                <Grid container item>
                  <Grid item className={classes.SubHeader}>Operator Key</Grid>
                  <AddressKeyInput address={decodeParameter('string', operatorStore.newOperatorKeys.publicKey)}/>
                </Grid>
                <Grid container item>
                  <Grid item xs={6}>
                    <NameAndAddress name={'Owner Address'}/>
                  </Grid>
                  <Grid item xs={6} className={classes.AlignRight}>
                    <NameAndAddress
                        name={`0x${longStringShorten(operatorStore.newOperatorKeys.address.substring(2), 4)}`}/>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>,
            <Grid container style={{ gap: 24 }}>
              <Grid container item style={{ gap: 16 }}>
                <Grid container item>
                  <Grid item className={classes.SubHeader}>Details</Grid>
                </Grid>
                <Grid container item>
                  <Grid item xs={6}>
                    <NameAndAddress name={'Fee'}/>
                  </Grid>
                  <Grid item xs={6} className={classes.AlignRight}>
                    <SsvAndSubTitle
                        ssv={formatNumberToUi(operatorStore.newOperatorKeys.fee)}
                        subText={'/year'}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container item>
               <TermsAndConditionsCheckbox>
                 <PrimaryButton disable={!checkedCondition} children={actionButtonText} submitFunction={onRegisterClick}/>
               </TermsAndConditionsCheckbox>
              </Grid>
            </Grid>,
          ]}
      />
  );
};

export default observer(OperatorConfirmation);
