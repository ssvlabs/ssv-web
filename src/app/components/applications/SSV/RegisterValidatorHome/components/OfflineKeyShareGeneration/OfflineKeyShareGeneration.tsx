import { observer } from 'mobx-react';
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import { useStyles } from './OfflineKeyShareGeneration.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';

const OfflineKeyShareGeneration = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const operatorStore: OperatorStore = stores.Operator;
  const [selectedBox, setSelectedBox] = useState(0);
  const [textCopied, setTextCopied] = useState(false);
  const notificationsStore: NotificationsStore = stores.Notifications;

  const isSelected = (id: number) => selectedBox === id;
  const goToNextPage = () => navigate(config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.UPLOAD_KEYSHARES);
  const { operatorsIds, operatorsKeys } = Object.values(operatorStore.selectedOperators).reduce((aggr, operator: IOperator) => {
    // @ts-ignore
    aggr.operatorsIds.push(operator.id);
    // @ts-ignore
    aggr.operatorsKeys.push(operator.public_key);
    return aggr;
  }, {
    operatorsIds: [],
    operatorsKeys: [],
  });
  const cliCommand = `--operators-keys=${operatorsKeys.join(',')} --operators-ids=${operatorsIds.join(',')}`;

  const instructions = [
    { id: 1, instructions: [
        <Grid>1. Download the <b>MacOS</b> executable from  <LinkText text={'SSV-Keys Github'} link={'https://github.com/bloxapp/ssv-keys/releases'} /></Grid>,
        '2. Launch your terminal',
        '3. Navigate to the directory you downladed the CLI tool',
        '4. Run the tool with the following command:',
      ],
    },
    { id: 2, instructions: [
        '1. Download the MacOS app from  the Starkeys Github',
        '2.Run the Starkeys app',
        '3. When prompted, copy and paste the following command:',
      ],
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cliCommand);
    notificationsStore.showMessage('Copied to clipboard.', 'success');
    setTextCopied(true);
  };

  const checkBox = (id: number) => {
    setTextCopied(false);
    setSelectedBox(id);
  };

  const copyButton = () => {
    if (!textCopied) return <Grid item className={classes.CopyButton} onClick={copyToClipboard}>Copy</Grid>;
    return <Grid onClick={copyToClipboard} container item className={classes.ButtonCopied}>
      <Typography className={classes.TextCopied}>Copied</Typography>
      <Grid className={classes.V} />
    </Grid>;
  };

  return (
      <BorderScreen
          blackHeader
          header={'How do you want to generate your keyshares?'}
          body={[
            <Grid container style={{ gap: 24 }}>
              <Grid container item style={{ gap: 24 }}>
                <Grid container item className={`${classes.Box} ${isSelected(1) ? classes.BoxSelected : ''}`}
                      onClick={() => checkBox(1)}>
                  <Grid item xs={12} className={classes.Image}/>
                  <Typography className={classes.BlueText}>Command Line Interface</Typography>
                </Grid>
                <Grid container item className={`${classes.Box} ${isSelected(2) ? classes.BoxSelected : ''}`}
                      onClick={() => checkBox(2)}>
                  <Grid item xs={12} className={`${classes.Image} ${classes.Desktop}`}/>
                  <Typography className={classes.BlueText}>Desktop App</Typography>
                </Grid>
              </Grid>
              {selectedBox === 2 && <Grid container item className={classes.UnofficialTool}>
                This app is an unofficial tool built as a public good by the OneStar team.
              </Grid>}
              {selectedBox !== 0 && <Grid container item>
                <Typography className={classes.GrayText} style={{ marginBottom: 16 }}>instructions:</Typography>
                <Grid container item style={{ gap: 24 }}>
                  {instructions.map((instruction) => {
                    if (instruction.id === selectedBox) {
                      return instruction.instructions.map((text, index: number) => {
                        return <Typography key={index} className={classes.BlackText}>{text}</Typography>;
                      });
                    }
                  })}
                </Grid>
              </Grid>
              }
              {selectedBox !== 0 && <Grid container item className={classes.CopyWrapper} style={{ gap: textCopied ? 7 : 40 }}>
                <Grid item xs className={classes.CopyText}>{cliCommand}</Grid>
                {copyButton()}
              </Grid>
              }
              <PrimaryButton text={'Next'} submitFunction={goToNextPage} disable={!textCopied} />
            </Grid>,
          ]}
      />
  );
};

export default observer(OfflineKeyShareGeneration);
