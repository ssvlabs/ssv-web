import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import ToolTip from '~app/components/common/ToolTip';
import config, { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import validatorRegistrationFlow, { EValidatorFlowAction } from '~app/hooks/useValidatorRegistrationFlow';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/RegisterValidatorHome.styles';
import { ProcessType } from '~app/model/processes.model';
import SecondaryButton from '~app/atomics/SecondaryButton';
import { ButtonSize } from '~app/enums/Button.enum';
import PrimaryButton from '~app/atomics/PrimaryButton';

type PreRequisiteType = {
  text: string;
  tooltip?: string;
  tooltipLinkText?: string;
};


const ButtonSeparator = styled.div`
  width: 100%;
  height: 12px;
`;

const preRequisites: PreRequisiteType[] = [
  {
    text: translations.VALIDATOR.HOME.PREREQUISITES[0],
    tooltip: translations.VALIDATOR.HOME.TOOLTIP.TEXT,
    tooltipLinkText: translations.VALIDATOR.HOME.TOOLTIP.LINK_TEXT,
  },
  {
    text: translations.VALIDATOR.HOME.PREREQUISITES[1],
  },
];

const RegisterValidatorHome = () => {
  const classes = useStyles();
  const stores = useStores();
  const navigate = useNavigate();
  const location = useLocation();
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const validatorStore: ValidatorStore = stores.Validator;
  const { getNextNavigation } = validatorRegistrationFlow(location.pathname);

  useEffect(() => {
    validatorStore.clearKeyStoreFlowData();
  }, []);

  const createValidatorsLaunchpad = () => {
    navigate(config.routes.SSV.VALIDATOR.CREATE);
  };

  const moveToSelectOperators = () => {
    processStore.setProcess({
      item: null,
      processName: 'register_validator',
    }, ProcessType.Validator);
    operatorStore.unselectAllOperators();
    operatorStore.setClusterSize(config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS);
    navigate(getNextNavigation(EValidatorFlowAction.GENERATE_NEW_SHARE));
  };

  const moveToUploadKeyshare = () => {
    processStore.setProcess({
      item: null,
      processName: 'register_validator',
    }, ProcessType.Validator);
    navigate(getNextNavigation(EValidatorFlowAction.ALREADY_HAVE_SHARES));
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
            {preRequisites.map((preRequisite: PreRequisiteType, index: number) => {
              return <Grid container item key={index} style={{ alignItems: 'center', gap: 14 }}>
                <Grid item className={classes.GreenV}></Grid>
                <Typography className={classes.Text}>{preRequisite.text}</Typography>
                {preRequisite.tooltip &&
									<ToolTip text={<Grid className={classes.TooltipText}>{preRequisite.tooltip}
                    &nbsp;
                    <Grid onClick={createValidatorsLaunchpad}
                          className={classes.TooltipLink}>{preRequisite.tooltipLinkText}</Grid>
                  </Grid>}/>
                }
              </Grid>;
            })}
          </Grid>
          <PrimaryButton onClick={moveToSelectOperators} text={translations.VALIDATOR.HOME.BUTTON.NEW_KEYS} size={ButtonSize.XL}/>
          <ButtonSeparator/>
          <SecondaryButton onClick={moveToUploadKeyshare} text={translations.VALIDATOR.HOME.BUTTON.EXISTING_KEYS} size={ButtonSize.XL}/>
        </Grid>,
      ]}
    />
  );
};

export default observer(RegisterValidatorHome);
