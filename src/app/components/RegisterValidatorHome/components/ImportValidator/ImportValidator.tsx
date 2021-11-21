import { observer } from 'mobx-react';
import styled from 'styled-components';
import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { isMobile } from 'react-device-detect';
import { useHistory } from 'react-router-dom';
import { DropzoneArea } from 'material-ui-dropzone';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import InputLabel from '~app/common/components/InputLabel';
import ValidatorStore from '~app/common/stores/Validator.store';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';

const DropZoneContainer = styled.div`
  & .MuiDropzoneArea-root {
    background-image: url('/images/drop_zone_icon.svg'), url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='rgba(91, 108, 132, 1)' stroke-width='3' stroke-dasharray='10%2c 10' stroke-dashoffset='30' stroke-linecap='square'/%3e%3c/svg%3e");
    background-repeat: no-repeat, repeat;
    animation: none;
    background-color: #FAFAFA;
    animation: none !important;
    background-position: center !important;
    border: none;
    background-size: auto !important;
    border-radius: 4px;
  }
  & .MuiDropzoneArea-active {
    background-color: red !important;
  }
  & .MuiDropzoneArea-text {
    padding-top: 30px;
    color: rgba(215, 215, 215, 1);
    font-size: 18px;
  }
  & .MuiDropzoneArea-icon {
    display: none;
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

const actionButtonMargin = isMobile ? '90px' : '120px';

const ImportValidator = () => {
  const classes = useStyles();
  const history = useHistory();
  const stores = useStores();
  const validatorStore: ValidatorStore = stores.Validator;
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
    <Screen
      navigationText={getBackNavigationTitle()}
      navigationLink={config.routes.VALIDATOR.HOME}
      title={translations.VALIDATOR.IMPORT.TITLE}
      subTitle={translations.VALIDATOR.IMPORT.DESCRIPTION}
      styleOptions={{ actionButtonMarginTop: actionButtonMargin }}
      body={(
        <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            <DropZoneContainer>
              <InputLabel
                title="Keystore File"
                subTitle="generated from CLI">
                <DropzoneArea
                  dropzoneText={''}
                  showPreviews={false}
                  onChange={onFileChange}
                  filesLimit={1}
                  maxFileSize={5000000}
                />
              </InputLabel>
            </DropZoneContainer>
          </Grid>
        </Grid>  
      )}
      actionButton={(
        <CTAButton
          testId={'confirm-button'}
          disable
          text={'Next'}
        />
      )}
    />
  );
};

export default observer(ImportValidator);
