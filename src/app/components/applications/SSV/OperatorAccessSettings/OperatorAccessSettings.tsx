import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import config, { translations } from '~app/common/config';
import InputLabel from '~app/components/common/InputLabel';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import BorderScreen from '~app/components/common/BorderScreen';
import { validateAddressInput } from '~lib/utils/validatesInputs';
import { useStyles } from '~app/components/applications/SSV/OperatorAccessSettings/OperatorAccessSettings.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { SingleCluster } from '~app/model/processes.model';
import { getIsContractWallet, getIsMainnet } from '~app/redux/wallet.slice';
import { PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { updateOperatorAddressWhitelist } from '~root/services/operatorContract.service';
import { getProcess } from '~app/redux/process.slice.ts';

const INITIAL_ERROR_STATE = { shouldDisplay: false, errorMessage: '' };

const OperatorAccessSettings = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const process: SingleCluster | undefined = useAppSelector(getProcess);
  const operator = process?.item;
  const whiteListAddress = operator.address_whitelist !== config.GLOBAL_VARIABLE.DEFAULT_ADDRESS_WHITELIST ? operator.address_whitelist : '';
  const isOperatorPermissioned = !!operator.address_whitelist && operator.address_whitelist !== config.GLOBAL_VARIABLE.DEFAULT_ADDRESS_WHITELIST;
  const [address, setAddress] = useState(whiteListAddress);
  const [readOnly, setReadOnly] = useState(true);
  const [addressError, setAddressError] = useState(INITIAL_ERROR_STATE);
  const [isPermissionedOperator, setIsPermissionedOperator] = useState(isOperatorPermissioned);
  const isFirstUsage = !operator?.address_whitelist && address === config.GLOBAL_VARIABLE.DEFAULT_ADDRESS_WHITELIST;
  const btnDisabledCondition = addressError.shouldDisplay || !address || isFirstUsage || address.toString() === operator.address_whitelist?.toString();
  const classes = useStyles({ isPermissionedOperator });
  const isMainnet = useAppSelector(getIsMainnet);
  const [isChecked, setIsChecked] = useState(false);
  const isContractWallet = useAppSelector(getIsContractWallet);

  const changeAddressHandler = (e: any) => {
    const { value } = e.target;
    setAddress(value.trim());
    validateAddressInput(value, setAddressError, true);
  };

  const updateAddressHandler = async () => {
    const res = await updateOperatorAddressWhitelist({ operator, address, isContractWallet, dispatch });
    if (res) {
      navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
    }
  };

  const permissionedOperatorHandler = () => {
    if (isPermissionedOperator) {
      setIsPermissionedOperator(false);
      setAddress(config.GLOBAL_VARIABLE.DEFAULT_ADDRESS_WHITELIST);
    } else {
      setIsPermissionedOperator(true);
      setAddress(operator.address_whitelist !== config.GLOBAL_VARIABLE.DEFAULT_ADDRESS_WHITELIST ? operator.address_whitelist : '');
    }
  };

  return (
    <BorderScreen
      blackHeader
      header={translations.OPERATOR_WHITELIST_ADDRESS.TITLE}
      body={[
        <Grid container item style={{ gap: 14 }}>
          <Grid className={classes.HeaderWrapper} container style={{ gap: 16 }}>
            <Grid className={classes.HeaderInner}>
              <Typography className={classes.InfoText}>{translations.OPERATOR_WHITELIST_ADDRESS.SECOND_TITLE}</Typography>
              <Tooltip
                text={
                  <Grid>
                    Read more on <LinkText textSize={12} text={'Permissioned Operators'} link={config.links.SSV_DOCUMENTATION} />
                  </Grid>
                }
              />
            </Grid>
            <Switch checked={isPermissionedOperator} className={classes.SwitchClassName} onChange={permissionedOperatorHandler} />
          </Grid>
          <Grid container gap={{ gap: 17 }}>
            <Typography className={classes.Text}>{translations.OPERATOR_WHITELIST_ADDRESS.TEXT}</Typography>
            {isPermissionedOperator && (
              <Grid item container>
                <Grid className={classes.InputLabelWrapper}>
                  <InputLabel title={translations.OPERATOR_WHITELIST_ADDRESS.INPUT_LABEL} />
                  <Tooltip text={translations.OPERATOR_WHITELIST_ADDRESS.INPUT_LABEL_TOOLTIP} />
                </Grid>
                <TextInput
                  value={address}
                  disable={readOnly}
                  onChangeCallback={changeAddressHandler}
                  icon={<Grid onClick={() => setReadOnly(false)} className={classes.EditIcon} />}
                />
                <Typography className={classes.ErrorMessage}>{addressError.errorMessage}</Typography>
              </Grid>
            )}
            <TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)} isMainnet={isMainnet}>
              <PrimaryButton isDisabled={btnDisabledCondition} text={'Update'} onClick={updateAddressHandler} size={ButtonSize.XL} />
            </TermsAndConditionsCheckbox>
          </Grid>
        </Grid>
      ]}
    />
  );
};

export default OperatorAccessSettings;
