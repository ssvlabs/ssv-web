import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { DropzoneArea } from 'material-ui-dropzone';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import InputLabel from '~app/common/components/InputLabel';
import BackNavigation from '~app/common/components/BackNavigation';
import ContractValidator from '~app/common/stores/contract/ContractValidator.store';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';

const DropZoneContainer = styled.div`
  & .MuiDropzoneArea-root {
    border: 1px dashed rgba(0, 0, 0, 0.12);
  }
  & .MuiDropzoneArea-text {
    padding-top: 30px;
    color: rgba(215, 215, 215, 1);
    font-size: 18px;
  }
  & .MuiDropzoneArea-icon {
    color: rgba(215, 215, 215, 1);
  }
  & .MuiDropzonePreviewList-imageContainer {
    margin: auto;
  }
  & .MuiDropzonePreviewList-image {
    margin-top: 20px;
    width: 30px;
    height: 30px;
  }
`;

const ImportValidator = () => {
  const classes = useStyles();
  const history = useHistory();
  const stores = useStores();
  const validatorStore: ContractValidator = stores.ContractValidator;
  const { getUserFlow } = useUserFlow();
  
  useEffect(() => {
    if (validatorStore.validatorPrivateKeyFile) {
      history.push(config.routes.VALIDATOR.DECRYPT);
    }
  }, [validatorStore.validatorPrivateKeyFile]);

  const onFileChange = (file: any[]) => {
    if (file.length !== 0) {
      validatorStore.setValidatorPrivateKeyFile(file[0]);
    }
  };

  const getBackNavigationTitle = (): string => {
    const userFlow = getUserFlow();
    if (config.routes.VALIDATOR.CREATE === userFlow) {
      return 'Create Validator';
    }
    return 'Run Validator with the SSV Network';
  };

  return (
    <Paper className={classes.mainContainer}>
      <BackNavigation to={config.routes.VALIDATOR.HOME} text={getBackNavigationTitle()} />
      <Header title={translations.VALIDATOR.IMPORT.TITLE} subtitle={translations.VALIDATOR.IMPORT.DESCRIPTION} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <br />
          <br />
          <DropZoneContainer>
            <InputLabel
              title="Keystore File"
              subTitle="generated from CLI">
              <DropzoneArea
                showPreviews={false}
                onChange={onFileChange}
                filesLimit={1}
                maxFileSize={5000000}
              />
            </InputLabel>
          </DropZoneContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(ImportValidator);
