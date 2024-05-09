import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import config, { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import NameAndAddress from '~app/components/common/NameAndAddress';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import { decodeParameter } from '~root/services/conversions.service';
import AddressKeyInput from '~app/components/common/AddressKeyInput';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from '~app/components/applications/SSV/OperatorConfirmation/OperatorConfirmation.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { setIsShowTxPendingPopup } from '~app/redux/appState.slice';
import { getOperatorByPublicKey } from '~root/services/operator.service';
import { getIsContractWallet, getIsMainnet } from '~app/redux/wallet.slice';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';

const OperatorConfirmation = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionButtonText, setActionButtonText] = useState('Register Operator');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isContractWallet = useAppSelector(getIsContractWallet);
  const isMainnet = useAppSelector(getIsMainnet);
  const stores = useStores();
  const classes = useStyles();
  const operatorStore: OperatorStore = stores.Operator;

  const disableLoadingStates = () => {
    setIsLoading(false);
    dispatch(setIsShowTxPendingPopup(false));
  };

  const onRegisterClick = async () => {
    try {
      setIsLoading(true);
      setActionButtonText('Waiting for confirmation...');
      operatorStore.newOperatorKeys.id = 0;
      const operatorAdded = await operatorStore.addNewOperator(isContractWallet, dispatch);
      let publicKey = operatorStore.newOperatorKeys.publicKey;
      if (operatorAdded) {
        try {
          publicKey = String(decodeParameter('string', operatorStore.newOperatorKeys.publicKey));
        } finally {
          console.log('Decoded public key', publicKey);
        }
        for (let i = 0; i < 20 && !operatorStore.newOperatorKeys.id; i++) {
          try {
            const operator = await getOperatorByPublicKey(publicKey, false);
            console.log('Fetched operator by public key', operator);
            if (operator?.data?.id) {
              operatorStore.newOperatorKeys = {
                ...operatorStore.newOperatorKeys,
                id: operator.data.id,
              };
              if (!isContractWallet) {
                disableLoadingStates();
                navigate(config.routes.SSV.OPERATOR.SUCCESS_PAGE);
              }
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
            <TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)}
                                        isMainnet={isMainnet}>
              <PrimaryButton isDisabled={isMainnet && !isChecked} isLoading={isLoading} text={actionButtonText}
                             onClick={onRegisterClick} size={ButtonSize.XL}/>
            </TermsAndConditionsCheckbox>
          </Grid>
        </Grid>,
      ]}
    />
  );
};

export default observer(OperatorConfirmation);
