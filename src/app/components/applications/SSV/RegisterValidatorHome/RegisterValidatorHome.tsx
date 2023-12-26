import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config, { translations } from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import ToolTip from '~app/components/common/ToolTip';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ProcessStore, { ProcessType } from '~app/common/stores/applications/SsvWeb/Process.store';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/RegisterValidatorHome.styles';
import styled from 'styled-components';

type PreRequisiteType = {
  text: string;
  tooltip?: string;
  tooltipLinkText?: string;
};


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
    operatorStore.unselectAllOperators(); // TODO should later update these from the keyshares file info
    operatorStore.setClusterSize(config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS); // TODO should later change this from the keyshares file info
    navigate(config.routes.SSV.VALIDATOR.SELECT_OPERATORS);
  };

  const moveToUploadKeyshare = () => {
    processStore.setProcess({
      item: null,
      processName: 'register_validator',
    }, ProcessType.Validator);
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEYSHARES);
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
                    <Grid onClick={createValidatorsLaunchpad} className={classes.TooltipLink}>{preRequisite.tooltipLinkText}</Grid>
                  </Grid>}/>
                }
              </Grid>;
            })}
          </Grid>
          <PrimaryButton text={translations.VALIDATOR.HOME.BUTTON.NEW_KEYS} submitFunction={moveToSelectOperators} withoutLoader/>
          <ButtonSeparator />
            <SecondaryButton text={translations.VALIDATOR.HOME.BUTTON.EXISTING_KEYS} submitFunction={moveToUploadKeyshare} noCamelCase withoutLoader/>
        </Grid>,
      ]}
    />
  );
};

export default observer(RegisterValidatorHome);
