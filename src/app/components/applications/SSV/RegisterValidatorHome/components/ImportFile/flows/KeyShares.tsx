import { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeyShares, KeySharesItem } from 'ssv-keys';
import config, { translations } from '~app/common/config';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/ImportFile.styles';
import ImportInput from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/common';
import OperatorData from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/Operator/OperatorData';
import ValidatorCounter from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorCounter';
import ValidatorList from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorList';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import LinkText from '~app/components/common/LinkText';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper';
import WarningBox from '~app/components/common/WarningBox';
import { useStores } from '~app/hooks/useStores';
import validatorRegistrationFlow, { EBulkMode, EValidatorFlowAction } from '~app/hooks/useValidatorRegistrationFlow';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { IOperator } from '~app/model/operator.model';
import { getAccountAddress } from '~app/redux/wallet.slice';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { isEqualsAddresses } from '~lib/utils/strings';
import { getOwnerNonce } from '~root/services/account.service';
import { getClusterData, getClusterHash } from '~root/services/cluster.service';
import {
  createValidatorsRecord,
  getResponse,
  getTooltipText,
  getValidatorCountErrorMessage,
  KeyShareMulti,
  KeyShareValidationResponse,
  KeyShareValidationResponseId,
  KeyShareValidationResult,
  parseToMultiShareFormat,
  SelectedOperatorData,
  validateConsistentOperatorIds,
  ValidatorType
} from '~root/services/keyShare.service';
import { getOperatorsByIds } from '~root/services/operator.service';
import { fetchIsRegisteredValidator } from '~root/services/validator.service';
import { isJsonFile } from '~root/utils/dkg.utils';
import { PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import { getNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import { getClusterSize, getOperatorValidatorsLimit, getSelectedOperators, selectOperators, setClusterSize, unselectAllOperators } from '~app/redux/operator.slice.ts';
import { canAccountUseOperator } from '~lib/utils/operatorMetadataHelper';
import { getIsClusterSelected, getSelectedCluster, setExcludedCluster } from '~app/redux/account.slice.ts';

const KeyShareFlow = () => {
  const accountAddress = useAppSelector(getAccountAddress);
  const { liquidationCollateralPeriod, minimumLiquidationCollateral } = useAppSelector(getNetworkFeeAndLiquidationCollateral);
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const inputRef = useRef(null);
  const removeButtons = useRef(null);
  const validatorStore: ValidatorStore = stores.Validator;
  const cluster = useAppSelector(getSelectedCluster);
  const isSecondRegistration = useAppSelector(getIsClusterSelected);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validatorsList, setValidatorsList] = useState<Record<string, ValidatorType>>({});
  const [processingFile, setProcessFile] = useState(false);
  const [hasPermissionedOperator, setHasPermissionedOperator] = useState(false);
  const [validatorsCount, setValidatorsCount] = useState(Object.values(validatorsList).length);
  const { getNextNavigation, isBulkMode, getMaxValidatorsCountPerRegistration } = validatorRegistrationFlow(location.pathname);
  const [selectedOperatorsData, setSelectedOperatorsData] = useState<SelectedOperatorData[]>([]);
  const [validationError, setValidationError] = useState<KeyShareValidationResponse>({
    id: KeyShareValidationResponseId.OK_RESPONSE_ID,
    name: '',
    errorMessage: '',
    subErrorMessage: ''
  });
  const selectedStoreOperators = useAppSelector(getSelectedOperators);
  const clusterSize = useAppSelector(getClusterSize);
  const keyShareFileIsJson = validatorStore.keyShareFile && isJsonFile(validatorStore.keyShareFile);
  const [maxAvailableValidatorsCount, setMaxAvailableValidatorsCount] = useState<number>(getMaxValidatorsCountPerRegistration(clusterSize));
  const [isLoading, setIsLoading] = useState(false);
  const operatorValidatorsLimit = useAppSelector(getOperatorValidatorsLimit);

  useEffect(() => {
    if (!isSecondRegistration) {
      dispatch(unselectAllOperators());
    }
    validatorStore.clearKeyShareFlowData();
  }, []);

  async function validateKeyShareFile(keyShareMulti: KeyShares): Promise<KeyShareValidationResult> {
    const shares = keyShareMulti.list();
    try {
      let operatorsData = Object.values(selectedStoreOperators);
      let clusterSizeData = clusterSize;
      if (isSecondRegistration) {
        const clusterOperatorsIds = cluster.operators.map((operator: IOperator) => operator.id).sort();
        if (shares.some((keyShare: KeySharesItem) => !validateConsistentOperatorIds(keyShare, clusterOperatorsIds))) {
          return {
            response: getResponse(KeyShareValidationResponseId.INCONSISTENT_OPERATOR_CLUSTER),
            operatorsData,
            clusterSizeData
          };
        }
      } else {
        const consistentOperatorIds = shares[0].payload.operatorIds.sort(); // Taking first slot in array just to get any ids. should be consistent across all shares.
        const selectedOperators = await getOperatorsByIds(consistentOperatorIds);
        const selectedOperatorsIds = selectedOperators.map((operator: IOperator) => operator.id);
        if (!selectedOperators.length) {
          return {
            response: getResponse(KeyShareValidationResponseId.OPERATOR_NOT_EXIST_ID),
            operatorsData,
            clusterSizeData
          };
        } else if (shares.some((keyShare: KeySharesItem) => !validateConsistentOperatorIds(keyShare, selectedOperatorsIds))) {
          return {
            response: getResponse(KeyShareValidationResponseId.INCONSISTENT_OPERATOR_CLUSTER),
            operatorsData,
            clusterSizeData
          };
        }

        operatorsData = dispatch(selectOperators(selectedOperators)).payload;
        clusterSizeData = dispatch(setClusterSize(selectedOperators.length)).payload;
      }

      if (isSecondRegistration) {
        for (const keyShare of shares) {
          if (
            keyShare.data.operators?.some((operatorData: { id: number; operatorKey: string }) => {
              const selectedOperator = Object.values(selectedStoreOperators).find((selected: IOperator) => selected.id === operatorData.id);
              return !selectedOperator || selectedOperator.public_key.toLowerCase() !== operatorData.operatorKey.toLowerCase();
            })
          ) {
            return {
              response: getResponse(KeyShareValidationResponseId.OPERATOR_NOT_MATCHING_ID),
              operatorsData,
              clusterSizeData
            };
          }
        }
      }
      return {
        response: getResponse(KeyShareValidationResponseId.OK_RESPONSE_ID),
        operatorsData,
        clusterSizeData
      };
    } catch (e: any) {
      return {
        response: getResponse(KeyShareValidationResponseId.ERROR_RESPONSE_ID, 'Failed to process KeyShares file'),
        operatorsData: [],
        clusterSizeData: 0
      };
    }
  }

  async function storeKeyShareData(keyShareMulti: KeyShares, clusterSizeData: number, selectedOperatorsData: IOperator[]) {
    // eslint-disable-next-line no-useless-catch
    try {
      validatorStore.setProcessedKeyShare(keyShareMulti);
      const keyShares = keyShareMulti.list();
      if (keyShares.length === 1 && isBulkMode(EBulkMode.SINGLE)) {
        validatorStore.setKeySharePublicKey(keyShares[0].payload.publicKey);
      }
      const validators: Record<string, ValidatorType> = createValidatorsRecord(keyShareMulti);
      const ownerNonce = await getOwnerNonce({ address: accountAddress });

      if (ownerNonce === undefined || ownerNonce === null) {
        // TODO: add proper error handling
        return;
      }
      const promises = Object.values(validators).map(
        (validator: ValidatorType) =>
          // eslint-disable-next-line no-async-promise-executor
          new Promise(async (resolve, reject) => {
            try {
              const res = await fetchIsRegisteredValidator(validator.publicKey);
              if (res.data && isEqualsAddresses(res.data.ownerAddress, accountAddress)) {
                validators[res.data.publicKey].registered = true;
              }
              if (!validators[validator.publicKey].registered && !validators[validator.publicKey].errorMessage) {
                validators[validator.publicKey].isSelected = true;
              }
              resolve(true);
            } catch (e) {
              reject(false);
            }
          })
      );

      await Promise.all(promises);

      const validatorsArray: ValidatorType[] = Object.values(validators);
      let currentNonce = ownerNonce;
      let warningTextMessage = '';
      let maxValidatorsCount =
        validatorsArray.filter((validator: ValidatorType) => validator.isSelected).length < getMaxValidatorsCountPerRegistration(clusterSizeData)
          ? validatorsArray.filter((validator: ValidatorType) => validator.isSelected).length
          : getMaxValidatorsCountPerRegistration(clusterSizeData);
      let previousSmallCount = validatorStore.validatorsCount;

      const operatorsData = await Promise.all(
        selectedOperatorsData.map(async (operator: IOperator) => {
          const availableValidatorsAmount = operatorValidatorsLimit - operator.validators_count;
          let hasError = false;
          if (availableValidatorsAmount < validatorStore.validatorsCount && availableValidatorsAmount > 0) {
            hasError = true;
            if (availableValidatorsAmount < previousSmallCount && maxAvailableValidatorsCount > 0) {
              previousSmallCount = availableValidatorsAmount;
              warningTextMessage = getValidatorCountErrorMessage(availableValidatorsAmount);
              maxValidatorsCount = availableValidatorsAmount > maxAvailableValidatorsCount ? maxAvailableValidatorsCount : availableValidatorsAmount;
            }
          }
          if (availableValidatorsAmount <= 0) {
            maxValidatorsCount = 0;
            warningTextMessage = translations.VALIDATOR.BULK_REGISTRATION.OPERATOR_REACHED_MAX_VALIDATORS;
            hasError = true;
          }
          const canUseOperator = await canAccountUseOperator(accountAddress, operator);
          if (!canUseOperator) {
            warningTextMessage = translations.VALIDATOR.BULK_REGISTRATION.WHITELIST_OPERATOR;
            setHasPermissionedOperator(true);
            hasError = true;
          }
          return {
            key: operator.id,
            hasError,
            name: operator.name,
            type: operator.type,
            operatorLogo: operator.logo ?? '',
            operatorId: operator.id
          };
        })
      );

      for (let i = 0; i < Object.values(validators).length; i++) {
        const validatorPublicKey = validatorsArray[i].publicKey;
        if (!validatorsArray[i].registered && currentNonce !== validators[validatorPublicKey].ownerNonce) {
          validators[validatorPublicKey].errorMessage = translations.VALIDATOR.BULK_REGISTRATION.INCORRECT_OWNER_NONCE_ERROR_MESSAGE;
          validators[validatorPublicKey].isSelected = false;
        } else if (!validatorsArray[i].registered) {
          await keyShares[i].validateSingleShares(validatorsArray[i].sharesData, {
            ownerAddress: accountAddress,
            ownerNonce: currentNonce,
            publicKey: validatorsArray[i].publicKey
          });
          currentNonce += 1;
        }
        if (currentNonce - ownerNonce > maxValidatorsCount) {
          validators[validatorPublicKey].isSelected = false;
        }
      }

      const selectedValidatorsCount = Object.values(validators).filter((validator: ValidatorType) => validator.isSelected).length;
      setValidatorsList(validators);
      setWarningMessage(warningTextMessage);
      setValidatorsCount(selectedValidatorsCount);
      setSelectedOperatorsData(operatorsData);
      setMaxAvailableValidatorsCount(selectedValidatorsCount < maxValidatorsCount ? selectedValidatorsCount : maxValidatorsCount);
    } catch (err) {
      throw err;
    }
  }

  const selectLastValidValidator = () => {
    const validators: Record<string, ValidatorType> = validatorsList;
    const lastSelectedValidator: any = Object.values(validatorsList).find((validator: any) => !validator.errorMessage && !validator.isSelected && !validator.registered);
    if (lastSelectedValidator && !lastSelectedValidator.errorMessage && !lastSelectedValidator.registered) {
      validators[lastSelectedValidator.publicKey].isSelected = true;
      setValidatorsCount((prevCount: number) => prevCount + 1);
    }
    setValidatorsList(validators);
  };

  const unselectLastValidator = () => {
    const validators: Record<string, ValidatorType> = validatorsList;
    const lastSelectedValidator: any = Object.values(validatorsList).reduceRight((found, item: any) => found || (item.isSelected ? item : null), null);
    validators[lastSelectedValidator.publicKey].isSelected = false;
    setValidatorsCount((prevCount: number) => prevCount - 1);
    setValidatorsList(validators);
  };

  const changeCountOfValidators = (value: number): void => {
    if (Number(value) === 0) {
      value = config.GLOBAL_VARIABLE.MIN_VALIDATORS_COUNT_PER_BULK_REGISTRATION;
    }
    if (Number(value) > maxAvailableValidatorsCount) {
      value = maxAvailableValidatorsCount;
    }
    const validatorsInSelectCount = Math.abs(validatorsCount - Number(value));
    for (let i = 0; i < validatorsInSelectCount; i++) {
      if (Number(value) < validatorsCount) {
        unselectLastValidator();
      } else {
        selectLastValidValidator();
      }
    }
  };

  async function processKeyShareFile(): Promise<KeyShareValidationResponse> {
    try {
      if (!validatorStore.keyShareFile) {
        setValidatorsList({});
        setValidatorsCount(0);
        return getResponse(KeyShareValidationResponseId.ERROR_RESPONSE_ID, 'KeyShares file undefined.');
      }
      const fileJson = await validatorStore.keyShareFile.text();
      const keyShareMulti: KeyShareMulti = parseToMultiShareFormat(fileJson);
      const keyShares: KeyShares = await KeyShares.fromJson(keyShareMulti);
      const validationResponse: KeyShareValidationResult = await validateKeyShareFile(keyShares);
      if (validationResponse.response.id !== KeyShareValidationResponseId.OK_RESPONSE_ID) {
        return validationResponse.response;
      }
      await storeKeyShareData(keyShares, validationResponse.clusterSizeData, validationResponse.operatorsData);
      return getResponse(KeyShareValidationResponseId.OK_RESPONSE_ID);
    } catch (e: any) {
      setValidatorsList({});
      setValidatorsCount(0);
      if (e.message.includes('The keyshares file you are attempting to reuse does not have the same version')) {
        return getResponse(
          KeyShareValidationResponseId.ERROR_RESPONSE_ID,
          <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
            The keyshares file you are attempting to use appears to be from an older version. Please update ssv-keys to the latest version{' '}
            <LinkText withoutUnderline link={config.links.SSV_KEYS_RELEASES_URL} text={'(v1.1.0)'} /> and generate your keyshares again.
          </Grid>
        );
      }
      return getResponse(KeyShareValidationResponseId.ERROR_RESPONSE_ID, e?.message);
    }
  }

  const fileHandler = (file: any) => {
    setProcessFile(true);
    validatorStore.setKeyShareFile(file, async () => {
      const response = await processKeyShareFile();
      setValidationError(response);
      setProcessFile(false);
    });
  };

  const ownerNonceIssueCondition = Object.values(validatorsList).length && Object.values(validatorsList).every((validator: any) => validator.errorMessage);

  const removeFile = () => {
    setProcessFile(true);
    validatorStore.clearKeyShareFlowData();
    setValidationError({
      id: KeyShareValidationResponseId.OK_RESPONSE_ID,
      name: '',
      errorMessage: ''
    });
    validatorStore.keyShareFile = null;
    setProcessFile(false);
    setValidatorsCount(0);
    setValidatorsList({});
    try {
      // @ts-ignore
      inputRef.current.value = null;
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const renderFileImage = () => {
    let fileClass: any = classes.FileImage;
    if (validationError.id !== 0) {
      fileClass += ` ${classes.Fail}`;
    } else if (keyShareFileIsJson) {
      fileClass += ` ${classes.Success}`;
    } else if (!keyShareFileIsJson && validatorStore.keyShareFile) {
      fileClass += ` ${classes.Fail}`;
    }
    return <Grid item className={fileClass} />;
  };

  const renderFileText = () => {
    if (!validatorStore.keyShareFile) {
      return (
        <Grid item xs={12} className={classes.FileText}>
          Drag and drop files or <LinkText text={'browse'} />
        </Grid>
      );
    }

    if (!keyShareFileIsJson) {
      return (
        <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
          Keyshares file must be in a JSON format.
          <RemoveButton />
        </Grid>
      );
    }

    if (validationError.id !== 0) {
      return (
        <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
          {validationError.errorMessage}
          {validationError.subErrorMessage && <Grid item>{validationError.subErrorMessage}</Grid>}
          <RemoveButton />
        </Grid>
      );
    }

    if (keyShareFileIsJson) {
      return (
        <Grid item xs={12} className={`${classes.FileText} ${classes.SuccessText}`}>
          {validatorStore.keyShareFile.name}
          <RemoveButton />
        </Grid>
      );
    }
  };

  const RemoveButton = () => (
    <Grid ref={removeButtons} onClick={removeFile} className={classes.Remove}>
      Remove
    </Grid>
  );

  const submitHandler = async () => {
    try {
      setIsLoading(true);
      validatorStore.registrationMode = 0;
      let nextRouteAction = EValidatorFlowAction.FIRST_REGISTER;
      validatorStore.setRegisterValidatorsPublicKeys(
        Object.values(validatorsList)
          .filter((validator: any) => validator.isSelected)
          .map((validator: any) => validator.publicKey)
      );
      if (validatorsCount === 1) {
        validatorStore.setKeySharePublicKey(validatorStore.registerValidatorsPublicKeys[0]);
      }
      if (!isSecondRegistration) {
        await getClusterData(getClusterHash(Object.values(selectedStoreOperators), accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral, true).then(
          (clusterData) => {
            if (clusterData?.validatorCount !== 0 || clusterData?.index > 0 || !clusterData?.active) {
              dispatch(
                setExcludedCluster({
                  ...clusterData,
                  operators: Object.values(selectedStoreOperators)
                })
              );
              nextRouteAction = EValidatorFlowAction.SECOND_REGISTER;
            }
          }
        );
      } else {
        nextRouteAction = EValidatorFlowAction.SECOND_REGISTER;
      }
      validatorStore.setMultiSharesMode(validatorsCount);
      navigate(getNextNavigation(nextRouteAction));
    } catch (error: any) {
      GoogleTagManager.getInstance().sendEvent({
        category: 'validator_register',
        action: 'upload_file',
        label: 'invalid_file'
      });
      setErrorMessage(translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_FILE);
    }
    setIsLoading(false);
  };

  const availableToRegisterValidatorsCount = Object.values(validatorsList).filter((validator: ValidatorType) => !validator.registered && !validator.errorMessage).length;
  const buttonDisableConditions =
    processingFile || validationError.id !== 0 || !keyShareFileIsJson || !!errorMessage || validatorStore.validatorPublicKeyExist || !validatorsCount || hasPermissionedOperator;
  const MainMultiKeyShare = (
    <Grid className={classes.SummaryWrapper}>
      <Typography className={classes.KeysharesSummaryTitle}>Keyshares summary</Typography>
      <Grid className={classes.SummaryInfoFieldWrapper}>
        <Typography className={classes.SummaryText}>Validators</Typography>
        <Typography className={classes.SummaryText}>{validatorStore.validatorsCount}</Typography>
      </Grid>
      <Grid className={classes.SummaryInfoFieldWrapper}>
        <Typography className={classes.SummaryText}>Operators</Typography>
        <Grid className={classes.OperatorsWrapper}>
          {selectedOperatorsData.map((operator: SelectedOperatorData) => {
            return <OperatorData {...operator} />;
          })}
        </Grid>
      </Grid>
      {warningMessage && <WarningBox text={warningMessage} />}
    </Grid>
  );

  const MainScreen = (
    <BorderScreen
      blackHeader
      withoutNavigation={isSecondRegistration}
      header={translations.VALIDATOR.IMPORT.KEY_SHARES_TITLE}
      wrapperClass={classes.marginNone}
      body={[
        <Grid item container>
          <ImportInput removeButtons={removeButtons} processingFile={processingFile} fileText={renderFileText} fileHandler={fileHandler} fileImage={renderFileImage} />
          {Object.values(validatorsList).length > 0 && !processingFile && MainMultiKeyShare}
        </Grid>
      ]}
    />
  );

  const SecondScreen = (
    <BorderScreen
      withoutNavigation
      blackHeader
      header={translations.VALIDATOR.BULK_REGISTRATION.SELECTED_VALIDATORS}
      wrapperClass={isSecondRegistration ? classes.marginNone : classes.marginTop}
      sideElement={
        <ValidatorCounter
          changeCountOfValidators={changeCountOfValidators}
          selectLastValidValidator={selectLastValidValidator}
          unselectLastValidator={unselectLastValidator}
          maxCount={ownerNonceIssueCondition ? 0 : maxAvailableValidatorsCount}
          countOfValidators={ownerNonceIssueCondition ? 0 : validatorsCount}
        />
      }
      tooltipText={getTooltipText(maxAvailableValidatorsCount, maxAvailableValidatorsCount !== 0 && maxAvailableValidatorsCount < availableToRegisterValidatorsCount)}
      body={[
        <Grid item container>
          {ownerNonceIssueCondition && (
            <ErrorMessage
              text={
                <Typography className={classes.ErrorMessageText}>
                  Validators within this file have an incorrect <LinkText textSize={14} link={config.links.INCORRECT_OWNER_NONCE_LINK} text={'registration nonce'} />
                  .<br /> Please split the validator keys to new key shares aligned with the correct one.
                </Typography>
              }
            />
          )}
          <ValidatorList validatorsList={Object.values(validatorsList)} />
          <Grid container item xs={12}>
            <PrimaryButton text={'Next'} onClick={submitHandler} isDisabled={buttonDisableConditions} size={ButtonSize.XL} isLoading={isLoading} />
          </Grid>
        </Grid>
      ]}
    />
  );

  if (isSecondRegistration) {
    return (
      <>
        <NewWhiteWrapper type={0} header={'Cluster'} />
        <Grid className={classes.KeysharesWrapper}>
          {MainScreen}
          {validatorStore.validatorsCount > 0 && !validationError.errorMessage && !processingFile && SecondScreen}
        </Grid>
      </>
    );
  }

  return (
    <Grid className={classes.KeysharesWrapper}>
      {MainScreen}
      {validatorStore.validatorsCount > 0 && !validationError.errorMessage && !processingFile && SecondScreen}
    </Grid>
  );
};
export default observer(KeyShareFlow);
