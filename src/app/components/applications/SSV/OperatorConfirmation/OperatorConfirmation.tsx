import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import config, { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import NameAndAddress from '~app/components/common/NameAndAddress';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import { decodeParameter } from '~root/services/conversions.service';
import AddressKeyInput from '~app/components/common/AddressKeyInput';
import { useStyles } from '~app/components/applications/SSV/OperatorConfirmation/OperatorConfirmation.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getIsContractWallet, getIsMainnet } from '~app/redux/wallet.slice';
import { Grid, PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import { addNewOperator } from '~root/services/operatorContract.service.ts';
import { getOperatorByPublicKey } from '~root/services/operator.service.ts';

const OperatorConfirmation = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionButtonText, setActionButtonText] = useState('Register Operator');
  const navigate = useNavigate();
  const location = useLocation();
  const { operatorRawData, isPrivate } = location.state;
  const dispatch = useAppDispatch();
  const isContractWallet = useAppSelector(getIsContractWallet);
  const isMainnet = useAppSelector(getIsMainnet);
  const classes = useStyles();

  const onRegisterClick = async () => {
    setIsLoading(true);
    setActionButtonText('Waiting for confirmation...');
    const operatorAdded = await addNewOperator({ isContractWallet, operatorRawData, isPrivate, dispatch });
    if (operatorAdded) {
      const res = await getOperatorByPublicKey(decodeParameter('string', operatorRawData.publicKey));
      navigate(isContractWallet ? config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD : config.routes.SSV.OPERATOR.SUCCESS_PAGE, {
        state: {
          operatorRawData: {
            ...operatorRawData,
            id: res.data.id
          }
        }
      });
    } else {
      setActionButtonText('Register Operator');
    }
    setIsLoading(false);
  };

  return (
    <BorderScreen
      blackHeader
      withConversion
      sectionClass={classes.Section}
      subHeaderText={'Register Operator'}
      header={translations.OPERATOR.CONFIRMATION.TITLE}
      body={[
        <Grid container>
          <Grid container style={{ gap: 34 }}>
            <Grid container item>
              <Grid item className={classes.SubHeader}>
                Operator Key
              </Grid>
              <AddressKeyInput address={decodeParameter('string', operatorRawData.publicKey)} />
            </Grid>
            <Grid container item>
              <Grid item xs={6}>
                <NameAndAddress name={'Owner Address'} />
              </Grid>
              <Grid item xs={6} className={classes.AlignRight}>
                <NameAndAddress name={`0x${longStringShorten(operatorRawData.address.substring(2), 4)}`} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>,
        <Grid container style={{ gap: 24 }}>
          <Grid container item style={{ gap: 16 }}>
            <Grid container item>
              <Grid item className={classes.SubHeader}>
                Details
              </Grid>
            </Grid>
            <Grid container item>
              <Grid item xs={6}>
                <NameAndAddress name={'Fee'} />
              </Grid>
              <Grid item xs={6} className={classes.AlignRight}>
                <SsvAndSubTitle ssv={formatNumberToUi(operatorRawData.fee)} subText={'/year'} />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item>
            <TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)} isMainnet={isMainnet}>
              <PrimaryButton isDisabled={isMainnet && !isChecked} isLoading={isLoading} text={actionButtonText} onClick={onRegisterClick} size={ButtonSize.XL} />
            </TermsAndConditionsCheckbox>
          </Grid>
        </Grid>
      ]}
    />
  );
};

export default OperatorConfirmation;
