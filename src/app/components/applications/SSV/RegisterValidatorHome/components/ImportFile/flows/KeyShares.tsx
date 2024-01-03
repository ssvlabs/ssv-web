import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import Typography from '@mui/material/Typography';
import { KeyShares, SSVKeysException } from 'ssv-keys';
import Operator from '~lib/api/Operator';
import Validator from '~lib/api/Validator';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { equalsAddresses } from '~lib/utils/strings';
import LinkText from '~app/components/common/LinkText';
import config, { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { AccountStore, WalletStore } from '~app/common/stores/applications/SsvWeb';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import {
  useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/ImportFile.styles';
import ImportInput from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/common';
import OperatorData
  from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/Operator/OperatorData';
import ValidatorList
  from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorList';
import ValidatorCounter
  from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorCounter';
import validatorRegistrationFlow from '~app/hooks/validatorRegistrationFlow';


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
};

const KeyShareFlow = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { getNextNavigation } = validatorRegistrationFlow(location.pathname);
  const inputRef = useRef(null);
  const removeButtons = useRef(null);
  const walletStore: WalletStore = stores.Wallet;
  const accountStore: AccountStore = stores.Account;
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const validatorStore: ValidatorStore = stores.Validator;
  const applicationStore: ApplicationStore = stores.Application;
  const [errorMessage, setErrorMessage] = useState('');
  const [processingFile, setProcessFile] = useState(false);
  const [validatorsList, setValidatorsList] = useState({});
  const [validatorsCount, setValidatorsCount] = useState(Object.values(validatorsList).length);
  const [validationError, setValidationError] = useState<KeyShareValidationResponse>({
    id: KeyShareValidationResponseId.OK_RESPONSE_ID,
    name: '',
    errorMessage: '',
    subErrorMessage: '',
  });
  const keyShareFileIsJson = validatorStore.isJsonFile(validatorStore.keyShareFile);

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

  async function validateKeyShareFile(keyShareMulti: KeyShares): Promise<KeyShareValidationResponse> {
    const shares = keyShareMulti.list();
    let consistentOperatorIds: number[] | null = [];
    if (!shares.length) {
      return getResponse(KeyShareValidationResponseId.OK_RESPONSE_ID);
    }
    if (shares.length > 1) {
      validatorStore.setMultiSharesMode(shares.length);
    }
    consistentOperatorIds = shares[0].payload.operatorIds.sort(); // Taking first slot in array just to get any ids. should be consistent across all shares.
    try {
      for (let keyShare of shares) {
        let { payload, data } = keyShare;
        const keyShareOperatorIds = payload.operatorIds.sort();
        if (consistentOperatorIds.toString() !== keyShareOperatorIds.toString()) {
          return getResponse(KeyShareValidationResponseId.INCONSISTENT_OPERATOR_CLUSTER);
        }
        const operatorPublicKeys = data.operators?.map((operator: {
          id: number,
          operatorKey: string
        }) => operator.operatorKey);
        if (processStore.secondRegistration) {
          const process: SingleCluster = processStore.process;
          const clusterOperatorsIds = process.item.operators.map((operator: {
            id: number,
            operatorKey: string
          }) => operator.id).sort();
          if (!clusterOperatorsIds.every((val: number, index: number) => val === keyShareOperatorIds[index])) {
            return getResponse(KeyShareValidationResponseId.OPERATOR_NOT_MATCHING_ID);
          }
        } else {
          const selectedOperators = await Operator.getInstance().getOperatorsByIds(keyShareOperatorIds);
          if (!selectedOperators.length) {
            return getResponse(KeyShareValidationResponseId.OPERATOR_NOT_EXIST_ID);
          } else if (selectedOperators?.some((operator: IOperator) => !operatorPublicKeys?.includes(operator.public_key))) {
            return getResponse(KeyShareValidationResponseId.OPERATOR_NOT_MATCHING_ID);
          }
          operatorStore.selectOperators(selectedOperators);
        }
        const validatorExist = !!(await Validator.getInstance().getValidator(payload.publicKey, true));
        if (validatorExist && !validatorStore.isMultiSharesMode) {
          return getResponse(KeyShareValidationResponseId.VALIDATOR_EXIST_ID);
        }
        await accountStore.getOwnerNonce(walletStore.accountAddress);
        const { ownerNonce } = accountStore;
        await keyShare.validateSingleShares(payload.sharesData, {
          ownerAddress: walletStore.accountAddress,
          ownerNonce: ownerNonce,
          publicKey: payload.publicKey,
        });
      }
    } catch (e) {
      getResponse(KeyShareValidationResponseId.ERROR_RESPONSE_ID, 'Failed to process KeyShares file');
    }
    return getResponse(KeyShareValidationResponseId.OK_RESPONSE_ID);
  }

  async function storeKeyShareData(keyShareMulti: KeyShares) {
    try {
      validatorStore.setProcessedKeyShare(keyShareMulti);
      const keyShares = keyShareMulti.list();
      if (keyShares.length == 1) {
        validatorStore.setKeySharePublicKey(keyShares[0].payload.publicKey);
      }
      await accountStore.getOwnerNonce(walletStore.accountAddress);
      const { ownerNonce } = accountStore;
      const validators: Record<string, ValidatorType> = {};

      keyShareMulti.list().forEach((keyShare: any) => {
        validators[keyShare.data.publicKey] = {
          ownerNonce: keyShare.data.ownerNonce,
          publicKey: keyShare.data.publicKey,
          registered: false,
          errorMessage: '',
          isSelected: false,
        };
      });



      const promises = Object.values(validators).map((validator: ValidatorType) => new Promise(async (resolve) => {
        // try {
        const res = await Validator.getInstance().getValidator(validator.publicKey);
        if (res && equalsAddresses(res.owner_address, walletStore.accountAddress)) {
          validators[`0x${res.public_key}`].registered = true;
        }
        if (!validators[validator.publicKey].registered && !validators[validator.publicKey].errorMessage) {
          validators[validator.publicKey].isSelected = true;
        }


        resolve(res);
        // } catch (err) {
        //   console.log(err);
        //   resolve(false);
        // }
      }));

      // try {
      await Promise.all(promises);
      // } catch (err) {
      //   console.log('inAllPromisses catch');
      //   console.log(err);
      // }

      let currentNonce = ownerNonce;

      let incorrectNonceFlag = false;


      for (let i = 0; i < Object.values(validators).length; i++) {
        let indexToSkip = 0;
        const validatorsArray: ValidatorType[] = Object.values(validators);
        if (i > 0 && validatorsArray && !validatorsArray[i - 1].registered && validatorsArray[i].registered) {
          indexToSkip = i;
          incorrectNonceFlag = true;
        }

        if (incorrectNonceFlag && indexToSkip !== i && !validators[validatorsArray[i].publicKey].registered || i > 0 &&
          validatorsArray[i - 1].errorMessage && !validators[validatorsArray[i].publicKey].registered ||
          currentNonce !== validators[validatorsArray[i].publicKey].ownerNonce && !validators[validatorsArray[i].publicKey].registered
        ) {
          validators[validatorsArray[i].publicKey].errorMessage = 'Incorrect owner-nonce';
          validators[validatorsArray[i].publicKey].isSelected = false;
        }
        if (!validatorsArray[i].registered) {
          currentNonce += 1;
        }

        if (validators[validatorsArray[i].publicKey].isSelected && i >= config.GLOBAL_VARIABLE.MAX_VALIDATORS_COUNT_PER_BULK_TRANSACTION) {
          validators[validatorsArray[i].publicKey].isSelected = false;
        }
      }

      setValidatorsList(validators);
      setValidatorsCount(Object.values(validators).filter((validator: ValidatorType) => validator.isSelected).length > config.GLOBAL_VARIABLE.MAX_VALIDATORS_COUNT_PER_BULK_TRANSACTION ? config.GLOBAL_VARIABLE.MAX_VALIDATORS_COUNT_PER_BULK_TRANSACTION : Object.values(validators).filter((validator: ValidatorType) => validator.isSelected).length);
    } catch (err) {
      console.log(err);
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
      if (validatorsCount === 1) {

      }
      navigate(getNextNavigation());
      validatorStore.setMultiSharesMode(validatorsCount);
      validatorStore.setRegisterValidatorsPublicKeys(Object.values(validatorsList).filter((validator: any) => validator.isSelected).map((validator: any) => validator.publicKey));
      if (validatorsCount === 1) {
        validatorStore.setKeySharePublicKey(validatorStore.registerValidatorsPublicKeys[0]);
      }
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

  const buttonDisableConditions = processingFile || validationError.id !== 0 || !keyShareFileIsJson || !!errorMessage || validatorStore.validatorPublicKeyExist || validatorStore.isMultiSharesMode && !validatorsCount;
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
        {Object.values(validatorsList).length > 0 && !processingFile && <Grid className={classes.SummaryWrapper}>
          <Typography className={classes.KeysharesSummaryTitle}>Keyshares summary</Typography>
          <Grid className={classes.SummaryInfoFieldWrapper}>
            <Typography className={classes.SummaryText}>Validators</Typography>
            <Typography className={classes.SummaryText}>{validatorStore.validatorsCount}</Typography>
          </Grid>
          <Grid
            className={classes.SummaryInfoFieldWrapper}>
            <Typography className={classes.SummaryText}>Operators</Typography>
            <Grid className={classes.OperatorsWrapper}>
              {Object.values(operatorStore.selectedOperators).map((operator: IOperator) => {
                return (< OperatorData
                  operatorLogo={operator.logo} operatorId={operator.id}/>);
              })}
            </Grid>
          </Grid>
        </Grid>}
        <Grid container item xs={12}>
          {!validatorStore.isMultiSharesMode &&
            <PrimaryButton text={'Next'} submitFunction={submitHandler} disable={buttonDisableConditions}/>}
        </Grid>
      </Grid>,
    ]}
  />;

  const SecondScreen = <BorderScreen
    withoutNavigation
    blackHeader
    header={translations.VALIDATOR.BULK_REGISTRATION.SELECTED_VALIDATORS}
    wrapperClass={classes.marginTop}
    sideElement={<ValidatorCounter
      selectLastValidValidator={selectLastValidValidator}
      unselectLastValidator={unselectLastValidator}
      maxCount={ownerNonceIssueCondition ? 0 : config.GLOBAL_VARIABLE.MAX_VALIDATORS_COUNT_PER_BULK_TRANSACTION}
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
      <Grid container>
        <NewWhiteWrapper
          type={0}
          header={'Cluster'}
        />
        {MainScreen}
        {validatorStore.isMultiSharesMode && !processingFile && SecondScreen}
      </Grid>
    );
  }

  return <Grid className={classes.KeysharesWrapper}>
    {MainScreen}
    {validatorStore.isMultiSharesMode && !processingFile && SecondScreen}
  </Grid>;
};

export default observer(KeyShareFlow);