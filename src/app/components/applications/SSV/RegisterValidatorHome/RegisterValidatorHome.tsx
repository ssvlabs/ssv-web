import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import ToolTip from '~app/components/common/ToolTip';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/RegisterValidatorHome.styles';

type PreRequisiteType = {
  text: string;
  tooltip?: string;
  tooltipLinkText?: string;
};

const RegisterValidatorHome = () => {
  const classes = useStyles();
  const stores = useStores();
  const navigate = useNavigate();
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const validatorStore: ValidatorStore = stores.Validator;

  const preRequisites: PreRequisiteType[] = [
    {
      text: 'An active Ethereum validator (deposited to Beacon Chain)',
      tooltip: 'Don\'t have a validator?',
      tooltipLinkText: 'Create via Ethereum Launchpad',
    },
    {
      text: 'SSV tokens to cover operational fees',
    },
  ];

  useEffect(() => {
    validatorStore.clearKeyStoreFlowData();
  });

  const createValidatorsLaunchpad = () => {
    navigate(config.routes.SSV.VALIDATOR.CREATE);
  };

  const moveToSelectOperators = () => {
    processStore.setProcess({
      item: null,
      processName: 'register_validator',
    }, 2);
    operatorStore.unselectAllOperators();
    operatorStore.setClusterSize(config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS);
    navigate(config.routes.SSV.VALIDATOR.SELECT_OPERATORS);
  };

  const moveToUploadKeyshare = () => {
    processStore.setProcess({
      item: null,
      processName: 'register_validator',
    }, 2);
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEYSHARES);
  };
  

  return (
    <BorderScreen
      body={[
        <Grid container>
          <HeaderSubHeader title={'Run a Distributed Validator'}
                           subtitle={'Distribute your validation duties among a set of distributed nodes to improve your validator resilience, safety, liveliness, and diversity.'}
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
          <Grid container item style={{ gap: 12 }}>
            <PrimaryButton text={'Generate new key shares'} submitFunction={moveToSelectOperators} withoutLoader/>
            <SecondaryButton text={'I already have key shares'} submitFunction={moveToUploadKeyshare} noCamelCase withoutLoader/>
          </Grid>
        </Grid>,
      ]}
    />
  );
};

export default observer(RegisterValidatorHome);
