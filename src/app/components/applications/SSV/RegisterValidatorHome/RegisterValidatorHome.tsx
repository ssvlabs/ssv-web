import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config, { translations } from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ProcessStore, { ProcessType } from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/RegisterValidatorHome.styles';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import styled from 'styled-components';
import { useStyles as secondaryUseStyle } from '~app/components/common/Button/SecondaryButton/SecondaryButton.styles';


const ButtonSeparator = styled.div`
  width: 100%;
  height: 12px;
`;


const RegisterValidatorHome = () => {
  const classes = useStyles();
  const stores = useStores();
  const navigate = useNavigate();
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const validatorStore: ValidatorStore = stores.Validator;
  const secondaryClasses = secondaryUseStyle({ noCamelCase: true });


  useEffect(() => {
      validatorStore.clearKeyStoreFlowData();
  });

  const moveToSelectOperators = () => {
    processStore.setProcess({
      item: null,
      processName: 'register_validator',
    }, ProcessType.Validator);
    operatorStore.unselectAllOperators(); // TODO should later update these from the keyshares file info
    operatorStore.setClusterSize(config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS); // TODO should later change this from the keyshares file info
    navigate(config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.UPLOAD_KEYSHARES);
  };

  const moveToEnterKeySharesFile = () => {
    processStore.setProcess({
      item: null,
      processName: 'register_validator',
    }, ProcessType.Validator);
    operatorStore.unselectAllOperators();
    operatorStore.setClusterSize(config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS);
    navigate(config.routes.SSV.VALIDATOR.SELECT_OPERATORS);
  };

  return (
    <BorderScreen
      body={[
        <Grid container>
          <HeaderSubHeader title={translations.VALIDATOR.HOME.TITLE}
            subtitle={translations.VALIDATOR.HOME.SUB_TITLE}
          />
          <Typography className={classes.GrayText}>Prerequisites</Typography>
          <Grid container item style={{ gap: 8, marginBottom: 24 }}>
            {translations.VALIDATOR.HOME.PREREQUISITES.map((preRequisite: string, index: number)=>{
              return <Grid container item key={index} style={{ alignItems: 'center', gap: 14 }}>
                <Grid item className={classes.GreenV}></Grid>
                <Typography className={classes.Text}>{preRequisite}</Typography>
                {index == 0 && <Tooltip
                    text={<Grid>{translations.VALIDATOR.HOME.TOOLTIP.TEXT}<LinkText
                          text={translations.VALIDATOR.HOME.TOOLTIP.LINK_TEXT}
                          link={config.routes.SSV.VALIDATOR.CREATE}/></Grid>}/>}
              </Grid>;
            })}
          </Grid>
          <PrimaryButton text={translations.VALIDATOR.HOME.BUTTON.NEW_KEYS} submitFunction={moveToEnterKeySharesFile} withoutLoader/>
          <ButtonSeparator />
          <SecondaryButton text={translations.VALIDATOR.HOME.BUTTON.EXISTING_KEYS} className={secondaryClasses.SecondaryButton} submitFunction={moveToSelectOperators}/>
        </Grid>,
      ]}
    />
  );
};

export default observer(RegisterValidatorHome);
