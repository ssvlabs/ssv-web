import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import Typography from '@mui/material/Typography';
import { KeyShares, KeySharesItem, SSVKeysException } from 'ssv-keys';
import { useLocation, useNavigate } from 'react-router-dom';
import Operator from '~lib/api/Operator';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import { equalsAddresses } from '~lib/utils/strings';
import LinkText from '~app/components/common/LinkText';
import config, { translations } from '~app/common/config';
import WarningBox from '~app/components/common/WarningBox';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import { AccountStore, ClusterStore, WalletStore } from '~app/common/stores/applications/SsvWeb';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import {
  useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/ImportFile.styles';
import ImportInput from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/common';
import ProcessStore, { ProcessType, SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorData
  from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/Operator/OperatorData';
import validatorRegistrationFlow, { EBulkMode, EValidatorFlowAction } from '~app/hooks/useValidatorRegistrationFlow';
import ValidatorList
  from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorList';
import ValidatorCounter
  from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorCounter';

export type KeyShareMulti = {
  version: string,
  createdAt: string,
  shares: KeyShares
};

export type KeyShareValidationResponse = {
  id: KeyShareValidationResponseId,
  name: string,
  errorMessage: string,
  subErrorMessage?: string,
};

export enum KeyShareValidationResponseId {
  OK_RESPONSE_ID,
  OPERATOR_NOT_EXIST_ID,
  OPERATOR_NOT_MATCHING_ID,
  VALIDATOR_EXIST_ID,
  ERROR_RESPONSE_ID,
  PUBLIC_KEY_ERROR_ID,
  INCONSISTENT_OPERATOR_CLUSTER,
}

type ValidatorType = {
  ownerNonce: number,
  publicKey: string,
  registered: boolean,
  errorMessage: string,
  isSelected: boolean,
  sharesData: string,
};

type SelectedOperatorData = {
  key: string,
  hasError: boolean,
  operatorLogo: string,
  operatorId: string,
};

const KeyShareFlow = () => {
    const stores = useStores();
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef(null);
    const removeButtons = useRef(null);
    const walletStore: WalletStore = stores.Wallet;
    const accountStore: AccountStore = stores.Account;
    const processStore: ProcessStore = stores.Process;
    const clusterStore: ClusterStore = stores.Cluster;
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;
    const applicationStore: ApplicationStore = stores.Application;
    const [warningMessage, setWarningMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState('');
    const [validatorsList, setValidatorsList] = useState<Record<string, ValidatorType>>({});
    const [processingFile, setProcessFile] = useState(false);
    const [validatorsCount, setValidatorsCount] = useState(Object.values(validatorsList).length);
    const {
      getNextNavigation,
      isBulkMode,
      getMaxValidatorsCountPerRegistration,
    } = validatorRegistrationFlow(location.pathname);
    const [selectedOperatorsData, setSelectedOperatorsData] = useState<SelectedOperatorData[]>([]);
    const [validationError, setValidationError] = useState<KeyShareValidationResponse>({
      id: KeyShareValidationResponseId.OK_RESPONSE_ID,
      name: '',
      errorMessage: '',
      subErrorMessage: '',
    });
    const keyShareFileIsJson = validatorStore.isJsonFile(validatorStore.keyShareFile);
    const [maxAvailableValidatorsCount, setMaxAvailableValidatorsCount] = useState<number>(getMaxValidatorsCountPerRegistration());

    useEffect(() => {
      validatorStore.clearKeyShareFlowData();
    }, []);

    // TODO this is better but still not good. improve later
    function getResponse(keyShareResponseId: KeyShareValidationResponseId, errorMsg?: string): KeyShareValidationResponse {
      const { KEYSHARE_RESPONSE } = translations.VALIDATOR;
      switch (keyShareResponseId) {
        case KeyShareValidationResponseId.OK_RESPONSE_ID: {
          return { ...KEYSHARE_RESPONSE.OK_RESPONSE, id: KeyShareValidationResponseId.OK_RESPONSE_ID };
        }
        case KeyShareValidationResponseId.OPERATOR_NOT_EXIST_ID: {
          return {
            ...KEYSHARE_RESPONSE.OPERATOR_NOT_EXIST_RESPONSE,
            id: KeyShareValidationResponseId.OPERATOR_NOT_EXIST_ID,
          };
        }
        case KeyShareValidationResponseId.OPERATOR_NOT_MATCHING_ID: {
          return {
            ...KEYSHARE_RESPONSE.OPERATOR_NOT_MATCHING_RESPONSE,
            id: KeyShareValidationResponseId.OPERATOR_NOT_MATCHING_ID,
          };
        }
        case KeyShareValidationResponseId.VALIDATOR_EXIST_ID: {
          return { ...KEYSHARE_RESPONSE.VALIDATOR_EXIST_RESPONSE, id: KeyShareValidationResponseId.VALIDATOR_EXIST_ID };
        }
        case KeyShareValidationResponseId.ERROR_RESPONSE_ID: {
          if (!errorMsg) {
            throw Error('Missing error message');
          }
          return {
            ...KEYSHARE_RESPONSE.CATCH_ERROR_RESPONSE,
            id: KeyShareValidationResponseId.ERROR_RESPONSE_ID,
            errorMessage: errorMsg,
          };
        }
        case KeyShareValidationResponseId.PUBLIC_KEY_ERROR_ID: {
          return { ...KEYSHARE_RESPONSE.VALIDATOR_PUBLIC_KEY_ERROR, id: KeyShareValidationResponseId.PUBLIC_KEY_ERROR_ID };
        }
        case KeyShareValidationResponseId.INCONSISTENT_OPERATOR_CLUSTER: {
          return {
            ...KEYSHARE_RESPONSE.INCONSISTENT_OPERATOR_CLUSTER,
            id: KeyShareValidationResponseId.INCONSISTENT_OPERATOR_CLUSTER,
          };
        }
      }
    }

    function parseToMultiShareFormat(fileJson: string): KeyShareMulti {
      // TODO replace with call to shares.unified() from ssv-key sdk, per defined the doc 'Multi and single shares specification'
      let parsedFile = JSON.parse(fileJson);
      if (!('shares' in parsedFile)) {
        parsedFile.shares = [{ data: parsedFile.data, payload: parsedFile.payload }];
        delete parsedFile.data;
        delete parsedFile.payload;
      }
      return parsedFile;
    }

    const validateConsistentOperatorIds = (keyShare: KeySharesItem, consistentOperatorIds: number[]) => {
      const payloadOperatorIds = keyShare.payload.operatorIds.sort().toString();
      const dataOperatorIds = keyShare.data.operators?.map((operator: {
        id: number,
        operatorKey: string
      }) => operator.id).sort().toString();

      return payloadOperatorIds === dataOperatorIds && dataOperatorIds === consistentOperatorIds.sort().toString();
    };

    async function validateKeyShareFile(keyShareMulti: KeyShares): Promise<KeyShareValidationResponse> {
      const shares = keyShareMulti.list();
      try {
        if (processStore.secondRegistration) {
          const process: SingleCluster = processStore.process;
          const clusterOperatorsIds = process.item.operators.map((operator: {
            id: number,
            operatorKey: string
          }) => operator.id).sort();
          if (shares.some((keyShare: KeySharesItem) => !validateConsistentOperatorIds(keyShare, clusterOperatorsIds))) {
            return getResponse(KeyShareValidationResponseId.INCONSISTENT_OPERATOR_CLUSTER);
          }
        } else {
          const consistentOperatorIds = shares[0].payload.operatorIds.sort(); // Taking first slot in array just to get any ids. should be consistent across all shares.
          const selectedOperators = await Operator.getInstance().getOperatorsByIds(consistentOperatorIds);
          const selectedOperatorsIds = selectedOperators.map((operator: IOperator) => operator.id);
          if (!selectedOperators.length) {
            return getResponse(KeyShareValidationResponseId.OPERATOR_NOT_EXIST_ID);
          } else if (shares.some((keyShare: KeySharesItem) => !validateConsistentOperatorIds(keyShare, selectedOperatorsIds))) {
            return getResponse(KeyShareValidationResponseId.INCONSISTENT_OPERATOR_CLUSTER);
          }
          operatorStore.selectOperators(selectedOperators);
        }
      } catch (e: any) {
        return getResponse(KeyShareValidationResponseId.ERROR_RESPONSE_ID, 'Failed to process KeyShares file');
      }
      return getResponse(KeyShareValidationResponseId.OK_RESPONSE_ID);
    }

    async function storeKeyShareData(keyShareMulti: KeyShares) {
      try {
        validatorStore.setProcessedKeyShare(keyShareMulti);
        const keyShares = keyShareMulti.list();
        if (keyShares.length === 1 && isBulkMode(EBulkMode.SINGLE)) {
          validatorStore.setKeySharePublicKey(keyShares[0].payload.publicKey);
        }
        const validators: Record<string, ValidatorType> = keyShareMulti.list().reduce((acc: Record<string, ValidatorType>, keyShare: KeySharesItem) => {
          const { publicKey, ownerNonce } = keyShare.data;
          acc[publicKey as string] = {
            ownerNonce: ownerNonce as number,
            publicKey: publicKey as string,
            registered: false,
            errorMessage: '',
            isSelected: false,
            sharesData: keyShare.payload.sharesData as string,
          };
          return acc;
        }, {});

        await accountStore.getOwnerNonce(walletStore.accountAddress);
        const { ownerNonce } = accountStore;

        const promises = Object.values(validators).map((validator: ValidatorType) => new Promise(async (resolve, reject) => {
          try {
            const res = await Validator.getInstance().getValidator(validator.publicKey, true);
            if (res && equalsAddresses(res.owner_address, walletStore.accountAddress)) {
              validators[`0x${res.public_key}`].registered = true;
            }
            if (!validators[validator.publicKey].registered && !validators[validator.publicKey].errorMessage) {
              validators[validator.publicKey].isSelected = true;
            }
            resolve(res);
          } catch (e) {
            reject(false);
          }
        }));

        await Promise.all(promises);

        const validatorsArray: ValidatorType[] = Object.values(validators);
        let currentNonce = ownerNonce;
        let incorrectNonceFlag = false;
        let warningTextMessage = '';
        let maxValidatorsCount = validatorsArray.filter((validator: ValidatorType) => validator.isSelected).length < getMaxValidatorsCountPerRegistration() ? validatorsArray.filter((validator: ValidatorType) => validator.isSelected).length : getMaxValidatorsCountPerRegistration();
        let previousSmallCount = validatorStore.validatorsCount;

        const operatorsData: SelectedOperatorData[] = Object.values(operatorStore.selectedOperators).map((operator: IOperator) => {
          const availableValidatorsAmount = operatorStore.operatorValidatorsLimit - operator.validators_count;
          let hasError = false;
          if (availableValidatorsAmount < validatorStore.validatorsCount && availableValidatorsAmount > 0) {
            hasError = true;
            if (availableValidatorsAmount < previousSmallCount && maxAvailableValidatorsCount > 0) {
              previousSmallCount = availableValidatorsAmount;
              warningTextMessage = `The number of validators you wish to onboard would exceed the maximum validator capacity for one of your selected operators. You may proceed with onboarding only ${availableValidatorsAmount} validators.`;
              maxValidatorsCount = availableValidatorsAmount;
            }
          }
          if (availableValidatorsAmount <= 0) {
            maxValidatorsCount = 0;
            warningTextMessage = translations.VALIDATOR.BULK_REGISTRATION.OPERATOR_REACHED_MAX_VALIDATORS;
            hasError = true;
          }
          return ({
            key: operator.id.toString(),
            hasError,
            operatorLogo: operator.logo ?? '',
            operatorId: operator.id.toString(),
          });
        });

        for (let i = 0; i < Object.values(validators).length; i++) {
          let indexToSkip = 0;
          const incorrectOwnerNonceCondition = incorrectNonceFlag && indexToSkip !== i && !validators[validatorsArray[i].publicKey].registered || i > 0 &&
            validatorsArray[i - 1].errorMessage && !validators[validatorsArray[i].publicKey].registered ||
            currentNonce !== validators[validatorsArray[i].publicKey].ownerNonce && !validators[validatorsArray[i].publicKey].registered;

          if (i > 0 && validatorsArray && !validatorsArray[i - 1].registered && validatorsArray[i].registered) {
            indexToSkip = i;
            incorrectNonceFlag = true;
          }

          if (incorrectOwnerNonceCondition) {
            validators[validatorsArray[i].publicKey].errorMessage = translations.VALIDATOR.BULK_REGISTRATION.INCORRECT_OWNER_NONCE_ERROR_MESSAGE;
            validators[validatorsArray[i].publicKey].isSelected = false;
          }

          if (validators[validatorsArray[i].publicKey].isSelected && currentNonce - ownerNonce >= maxValidatorsCount) {
            validators[validatorsArray[i].publicKey].isSelected = false;
          }

          if (!validatorsArray[i].registered) {
            await keyShares[i].validateSingleShares(validatorsArray[i].sharesData, {
              ownerAddress: walletStore.accountAddress,
              ownerNonce: currentNonce,
              publicKey: validatorsArray[i].publicKey,
            });
            currentNonce += 1;
          }
        }

        maxValidatorsCount = maxValidatorsCount > config.GLOBAL_VARIABLE.MAX_VALIDATORS_COUNT_PER_BULK_TRANSACTION ? config.GLOBAL_VARIABLE.MAX_VALIDATORS_COUNT_PER_BULK_TRANSACTION : maxValidatorsCount;
        setValidatorsList(validators);
        setWarningMessage(warningTextMessage);
        setValidatorsCount(maxValidatorsCount);
        setSelectedOperatorsData(operatorsData);
        setMaxAvailableValidatorsCount(maxValidatorsCount);
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

    async function processKeyShareFile(): Promise<KeyShareValidationResponse> {
      try {
        if (!validatorStore.keyShareFile) {
          throw Error('KeyShares file undefined.');
        }
        const fileJson = await validatorStore.keyShareFile.text();
        const keyShareMulti: KeyShareMulti = parseToMultiShareFormat(fileJson);
        const keyShares: KeyShares = await KeyShares.fromJson(keyShareMulti);
        const validationResponse: KeyShareValidationResponse = await validateKeyShareFile(keyShares);
        if (validationResponse.id !== KeyShareValidationResponseId.OK_RESPONSE_ID) {
          return validationResponse;
        }
        await storeKeyShareData(keyShares);
        return getResponse(KeyShareValidationResponseId.OK_RESPONSE_ID);
      } catch (e: any) {
        let errorMsg = 'Cannot process KeyShares file';
        if (e instanceof SSVKeysException) {
          errorMsg = e.message;
        }
        setValidatorsList({});
        setValidatorsCount(0);
        return getResponse(KeyShareValidationResponseId.ERROR_RESPONSE_ID, errorMsg);
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
      setValidationError({ id: KeyShareValidationResponseId.OK_RESPONSE_ID, name: '', errorMessage: '' });
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
      return <Grid item className={fileClass}/>;
    };

    const renderFileText = () => {
      if (!validatorStore.keyShareFile) {
        return (
          <Grid item xs={12} className={classes.FileText}>
            Drag and drop files or <LinkText text={'browse'}/>
          </Grid>
        );
      }

      if (!keyShareFileIsJson) {
        return (
          <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
            Keyshares file must be in a JSON format.
            <RemoveButton/>
          </Grid>
        );
      }

      if (validationError.id !== 0) {
        return (
          <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
            {validationError.errorMessage}
            {validationError.subErrorMessage && <Grid item>{validationError.subErrorMessage}</Grid>}
            <RemoveButton/>
          </Grid>
        );
      }

      if (keyShareFileIsJson) {
        return (
          <Grid item xs={12} className={`${classes.FileText} ${classes.SuccessText}`}>
            {validatorStore.keyShareFile.name}
            <RemoveButton/>
          </Grid>
        );
      }
    };

    const RemoveButton = () => <Grid ref={removeButtons} onClick={removeFile} className={classes.Remove}>Remove</Grid>;

    const submitHandler = async () => {
      try {
        applicationStore.setIsLoading(true);
        validatorStore.registrationMode = 0;
        let nextRouteAction = EValidatorFlowAction.FIRST_REGISTER;
        validatorStore.setRegisterValidatorsPublicKeys(Object.values(validatorsList).filter((validator: any) => validator.isSelected).map((validator: any) => validator.publicKey));
        if (validatorsCount === 1) {
          validatorStore.setKeySharePublicKey(validatorStore.registerValidatorsPublicKeys[0]);
        }
        if (!processStore.secondRegistration) {
          await clusterStore.getClusterData(clusterStore.getClusterHash(Object.values(operatorStore.selectedOperators)), true).then((clusterData) => {
            if (clusterData?.validatorCount !== 0 || clusterData?.index > 0 || !clusterData?.active) {
              processStore.setProcess({
                item: clusterData,
                processName: 'cluster_registration',
              }, ProcessType.Validator);
              nextRouteAction = EValidatorFlowAction.SECOND_REGISTER;
            }
          });
        } else {
          nextRouteAction = EValidatorFlowAction.SECOND_REGISTER;
        }
        validatorStore.setMultiSharesMode(validatorsCount);
        navigate(getNextNavigation(nextRouteAction));
      } catch (error: any) {
        GoogleTagManager.getInstance().sendEvent({
          category: 'validator_register',
          action: 'upload_file',
          label: 'invalid_file',
        });
        setErrorMessage(translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_FILE);
      }
      applicationStore.setIsLoading(false);
    };

    const buttonDisableConditions = processingFile || validationError.id !== 0 || !keyShareFileIsJson || !!errorMessage || validatorStore.validatorPublicKeyExist || !validatorsCount;
    const MainMultiKeyShare = <Grid className={classes.SummaryWrapper}>
      <Typography className={classes.KeysharesSummaryTitle}>Keyshares summary</Typography>
      <Grid className={classes.SummaryInfoFieldWrapper}>
        <Typography className={classes.SummaryText}>Validators</Typography>
        <Typography className={classes.SummaryText}>{validatorStore.validatorsCount}</Typography>
      </Grid>
      <Grid
        className={classes.SummaryInfoFieldWrapper}>
        <Typography className={classes.SummaryText}>Operators</Typography>
        <Grid className={classes.OperatorsWrapper}>
          {selectedOperatorsData.map((operator: SelectedOperatorData) => {
            return (<OperatorData {...operator}/>);
          })}
        </Grid>
      </Grid>
      {warningMessage && <WarningBox
        text={warningMessage}/>}
    </Grid>;

    const MainScreen = <BorderScreen
      blackHeader
      withoutNavigation={processStore.secondRegistration}
      header={translations.VALIDATOR.IMPORT.KEY_SHARES_TITLE}
      wrapperClass={classes.marginNone}
      body={[
        <Grid item container>
          <ImportInput
            removeButtons={removeButtons} processingFile={processingFile} fileText={renderFileText}
            fileHandler={fileHandler} fileImage={renderFileImage}/>
          {Object.values(validatorsList).length > 0 && !processingFile && MainMultiKeyShare}
        </Grid>,
      ]}
    />;

    const SecondScreen = <BorderScreen
      withoutNavigation
      blackHeader
      header={translations.VALIDATOR.BULK_REGISTRATION.SELECTED_VALIDATORS}
      wrapperClass={processStore.secondRegistration ? classes.marginNone : classes.marginTop}
      sideElement={<ValidatorCounter
        selectLastValidValidator={selectLastValidValidator}
        unselectLastValidator={unselectLastValidator}
        maxCount={ownerNonceIssueCondition ? 0 : maxAvailableValidatorsCount}
        countOfValidators={ownerNonceIssueCondition ? 0 : validatorsCount}/>}
      tooltipText={translations.VALIDATOR.BULK_REGISTRATION.SELECTED_VALIDATORS_TOOLTIP} body={[
      <Grid item container>
        {ownerNonceIssueCondition && <ErrorMessage
          text={<Typography className={classes.ErrorMessageText}>Validators within this file have an incorrect <LinkText
            textSize={14} link={config.links.INCORRECT_OWNER_NONCE_LINK}
            text={'registration nonce'}/>.<br/> Please split the
            validator keys to new key shares aligned with the correct one.</Typography>}/>}
        <ValidatorList validatorsList={Object.values(validatorsList)}/>
        <Grid container item xs={12}>
          <PrimaryButton text={'Next'} submitFunction={submitHandler} disable={buttonDisableConditions}/>
        </Grid>
      </Grid>,
    ]}
    />;

    if (processStore.secondRegistration) {
      return (
        <>
          <NewWhiteWrapper
            type={0}
            header={'Cluster'}
          />
          <Grid className={classes.KeysharesWrapper}>
            {MainScreen}
            {validatorStore.validatorsCount > 0 && !validationError.errorMessage && !processingFile && SecondScreen}
          </Grid>
        </>
      );
    }

    return <Grid className={classes.KeysharesWrapper}>
      {MainScreen}
      {validatorStore.validatorsCount > 0 && !validationError.errorMessage && !processingFile && SecondScreen}
    </Grid>;
  }
;

export default observer(KeyShareFlow);