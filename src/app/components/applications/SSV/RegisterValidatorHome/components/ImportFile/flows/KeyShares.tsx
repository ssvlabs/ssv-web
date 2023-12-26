import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useStyles } from '../ImportFile.styles';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import config, { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import ImportInput from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/common';
import OperatorData
  from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/Operator/OperatorData';
import ValidatorList
  from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorList';
import ValidatorCounter
  from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorCounter';
import { KeyShares, SSVKeysException } from 'ssv-keys';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper';
// import { KeySharesPayload } from 'ssv-keys';
// import { KeySharesData } from 'ssv-keys';


// export type KeyShareSingle = {
//   version: string,
//   createdAt: string,
//   data: KeySharesData,
//   payload: KeySharesPayload
// };

export type KeyShareMulti = {
  version: string,
  createdAt: string,
  shares: KeyShares
};

// export type Share = {
//   data: ShareData,
//   payload: SharePayload
// };
//
// export type ShareData = {
//   ownerNonce: number,
//   ownerAddress: string,
//   publicKey: string,
//   operators: ShareOperatorData[]
// };
//
// export type SharePayload = {
//   publicKey: string,
//   operatorIds: number[],
//   sharesData: string,
// };
//
// export type ShareOperatorData = {
//   id: number,
//   operatorKey: string
// };

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
}


const VALIDATORS_TEMPLATE = [{
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}];
// const VALIDATORS_TEMPLATE = [{
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }];
const KeyShareFlow = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const removeButtons = useRef(null);
  const processStore: ProcessStore = stores.Process;
  const validatorStore: ValidatorStore = stores.Validator;
  const applicationStore: ApplicationStore = stores.Application;
  const operatorStore: OperatorStore = stores.Operator;
  const [errorMessage, setErrorMessage] = useState('');
  const [processingFile, setProcessFile] = useState(false);
  const [validatorsCount, setValidatorsCount] = useState(VALIDATORS_TEMPLATE.length); // TODO replace. should be updated in validator store.
  const [validationError, setValidationError] = useState<KeyShareValidationResponse>({ id: KeyShareValidationResponseId.OK_RESPONSE_ID, name:'', errorMessage: '', subErrorMessage: '' });
  const keyShareFileIsJson = validatorStore.isJsonFile(validatorStore.keyShareFile);

  useEffect(() => {
    validatorStore.clearKeyShareFlowData();
  }, []);

  function getResponse(keyShareResponseId: KeyShareValidationResponseId, errorMsg?: string): KeyShareValidationResponse{
    const { KEYSHARE_RESPONSE } = translations.VALIDATOR;
    switch (keyShareResponseId) {
      case KeyShareValidationResponseId.OK_RESPONSE_ID: {
        return { ...KEYSHARE_RESPONSE.OK_RESPONSE, id: KeyShareValidationResponseId.OK_RESPONSE_ID };
      }
      case KeyShareValidationResponseId.OPERATOR_NOT_EXIST_ID: {
        return { ...KEYSHARE_RESPONSE.OPERATOR_NOT_EXIST_RESPONSE, id: KeyShareValidationResponseId.OPERATOR_NOT_EXIST_ID };
      }
      case KeyShareValidationResponseId.OPERATOR_NOT_MATCHING_ID: {
        return { ...KEYSHARE_RESPONSE.OPERATOR_NOT_MATCHING_RESPONSE, id: KeyShareValidationResponseId.OPERATOR_NOT_MATCHING_ID };
      }
      case KeyShareValidationResponseId.VALIDATOR_EXIST_ID: {
        return { ...KEYSHARE_RESPONSE.VALIDATOR_EXIST_RESPONSE, id: KeyShareValidationResponseId.VALIDATOR_EXIST_ID };
      }
      case KeyShareValidationResponseId.ERROR_RESPONSE_ID: {
        if (!errorMsg){
          throw Error('Missing error message');
        }
        return { ...KEYSHARE_RESPONSE.CATCH_ERROR_RESPONSE, id: KeyShareValidationResponseId.ERROR_RESPONSE_ID, errorMessage: errorMsg };
      }
      case KeyShareValidationResponseId.PUBLIC_KEY_ERROR_ID: {
        return { ...KEYSHARE_RESPONSE.VALIDATOR_PUBLIC_KEY_ERROR, id: KeyShareValidationResponseId.PUBLIC_KEY_ERROR_ID };
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

  // function validateKeyShareFile(keyShareMulti: KeyShareMulti): KeyShareValidationResponse {
  //   try {
  //     for (let { payload: KeySharesPayload, data: KeySharesData } of keyShareMulti.shares) {
  //
  //     }
  //   }
  //   catch (e) {
  //
  //   }
  // }

  // function validateKeyShareFile(keyShareMulti: KeyShareMulti): KeyShareValidationResponse {
  //   try {
  //     for (let { payload, data } of keyShareMulti.shares) {
  //       const keyShareOperators = payload.operatorIds.sort();
  //       const operatorPublicKeys = data.operators.map((operator: any) => operator.operatorKey);
  //       if (payload.publicKey.length !== 98) {
  //         return getResponse(KeyShareValidationResponseId.PUBLIC_KEY_ERROR_ID);
  //       }
  //       if (processStore.secondRegistration) {
  //         const process: SingleCluster = processStore.process;
  //         const clusterOperatorsIds = process.item.operators.map((operator: any) => operator.id ).sort();
  //         if (!clusterOperatorsIds.every((val: number, index: number) => val === keyShareOperators[index])) {
  //           return getResponse(KeyShareValidationResponseId.OPERATOR_NOT_MATCHING_ID);
  //         }
  //       } else {
  //         const selectedOperators = await Operator.getInstance().getOperatorsByIds(keyShareOperators);
  //         if (!selectedOperators) {
  //           return getResponse(KeyShareValidationResponseId.OPERATOR_NOT_EXIST_ID);
  //         }
  //         if (typeof selectedOperators !== 'boolean' && selectedOperators?.some((operator: IOperator) => !operatorPublicKeys.includes(operator.public_key))) {
  //           return getResponse(KeyShareValidationResponseId.OPERATOR_NOT_MATCHING_ID);
  //         }
  //         operatorStore.selectOperators(selectedOperators);
  //       }
  //       const validatorExist = !!(await getValidator(payload.publicKey, true));
  //       if (validatorExist) {
  //         return getResponse(KeyShareValidationResponseId.VALIDATOR_EXIST_ID);
  //       }
  //       await accountStore.getOwnerNonce(walletStore.accountAddress);
  //       const { ownerNonce } = accountStore;
  //       await keyShares.validateSingleShares(payload.sharesData, { ownerAddress: walletStore.accountAddress, ownerNonce: ownerNonce, publicKey: payload.publicKey } );
  //     }
  //     return getResponse(KeyShareValidationResponseId.OK_RESPONSE_ID);
  //   }
  //   catch (e: any) {
  //     return getResponse(KeyShareValidationResponseId.ERROR_RESPONSE_ID, 'Failed to process KeyShares file');
  //   }
  // }

  function storeKeyShareData(keyShareMulti: KeyShares) {
    validatorStore.setProcessedKeyShare(keyShareMulti);
  }

  async function processKeyShareFile(): Promise<KeyShareValidationResponse> {
    try {
      if (!validatorStore.keyShareFile) {
        throw Error('KeyShares file undefined.');
      }
      const fileJson = await validatorStore.keyShareFile.text();
      const keyShareMulti: KeyShareMulti = parseToMultiShareFormat(fileJson);
      const keyShares: KeyShares = await KeyShares.fromJson(keyShareMulti);
      // const validationResponse: KeyShareValidationResponse = validateKeyShareFile(keyShareMulti); // TODO add validations according to PRD.
      // if(validationResponse.id !== KeyShareValidationResponseId.OK_RESPONSE_ID) {
      //   return validationResponse
      // }
      storeKeyShareData(keyShares);
      return getResponse(KeyShareValidationResponseId.OK_RESPONSE_ID);
    }
    catch (e: any) {
      let errorMsg = 'Cannot process KeyShares file';
      if (e instanceof SSVKeysException) {
        console.log('SSVKeysException validation error');
        errorMsg = e.message;
        // TODO handle each exception seperatly
      }
      console.log(e);
      return getResponse(KeyShareValidationResponseId.ERROR_RESPONSE_ID, errorMsg);
    }
  }

  const fileHandler = (file: any) => {
    setProcessFile(true);
    validatorStore.setKeyShareFile(file, async () => {
      const response = await processKeyShareFile();
      console.log(response);
      setValidationError(response);
      setProcessFile(false);
    });
  };

  const ownerNonceIssueCondition = VALIDATORS_TEMPLATE.every((validator: any) => validator.errorMessage);

  const removeFile = () => {
    setProcessFile(true);
    validatorStore.clearKeyShareFlowData();
    setValidationError({ id: KeyShareValidationResponseId.OK_RESPONSE_ID, name: '', errorMessage: '' });
    validatorStore.keyShareFile = null;
    setProcessFile(false);

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
      navigate(config.routes.SSV.VALIDATOR.FUNDING_PERIOD_PAGE);
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

  const buttonDisableConditions = processingFile || validationError.id !== 0 || !keyShareFileIsJson || !!errorMessage || validatorStore.validatorPublicKeyExist;

  const MainScreen = <BorderScreen
    blackHeader
    withoutNavigation={processStore.secondRegistration}
    header={translations.VALIDATOR.IMPORT.KEY_SHARES_TITLE}
    wrapperClass={classes.marginNone}
    body={[
      <Grid item container>
        <Grid item xs={12} className={classes.SubHeader}>Upload the generated <b>keyshares.json</b> file below</Grid>
        <ImportInput removeButtons={removeButtons} processingFile={processingFile} fileText={renderFileText}
                     fileHandler={fileHandler} fileImage={renderFileImage}/>
        <Grid className={classes.SummaryWrapper}>
          <Typography className={classes.KeysharesSummaryTitle}>Keyshares summary</Typography>
          <Grid className={classes.SummaryInfoFieldWrapper}>
            <Typography className={classes.SummaryText}>Validators</Typography>
            <Typography className={classes.SummaryText}>100</Typography>
          </Grid>
          <Grid
            className={classes.SummaryInfoFieldWrapper}>
            <Typography className={classes.SummaryText}>Operators</Typography>
            <Grid className={classes.OperatorsWrapper}>
              {Object.values(operatorStore.selectedOperators).map((operator: IOperator) => <OperatorData
                operatorLogo={operator.logo} operatorId={operator.id}/>)}
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <PrimaryButton text={'Next'} submitFunction={submitHandler} disable={buttonDisableConditions}/>
        </Grid>
      </Grid>,
    ]}
  />;

  const SecondScreen = <BorderScreen
      withoutNavigation
      blackHeader
      header={translations.VALIDATOR.BULK_REGISTRATION.SELECTED_VALIDATORS}
      wrapperClass={classes.marginTop}
      sideElement={<ValidatorCounter maxCount={ownerNonceIssueCondition ? 0 : VALIDATORS_TEMPLATE.length} countOfValidators={ownerNonceIssueCondition ? 0 : validatorsCount}
                                     changeValidatorsCount={setValidatorsCount}/>}
      tooltipText={translations.VALIDATOR.BULK_REGISTRATION.SELECTED_VALIDATORS_TOOLTIP} body={[
    <Grid item container>
      {ownerNonceIssueCondition && <ErrorMessage
          text={<Typography className={classes.ErrorMessageText}>Validators within this file have an incorrect <LinkText
              textSize={14} link={config.links.INCORRECT_OWNER_NONCE_LINK}
              text={'registration nonce'}/>.<br/> Please split the
            validator keys to new key shares aligned with the correct one.</Typography>}/>}
      <ValidatorList validatorsList={VALIDATORS_TEMPLATE} countOfValidators={validatorsCount}/>
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
        </Grid>
    );
  }

  return <Grid className={classes.KeysharesWrapper}>
    {MainScreen}
    {SecondScreen}
  </Grid>;
};

export default observer(KeyShareFlow);