import { Grid } from '@mui/material';
import ProcessElement from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox/NotificationPopUp/ProcessElement';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox/NotificationPopUp/NotificationPopUp.styles';

export const PROCESS = {
  DECLARE: 1,
  WAITING: 2,
  PENDING: 3,
  UPDATED: 4
};

const PROCESSES_DATA = {
  [PROCESS.DECLARE]: {
    title: 'Declare Fee',
    text: 'Fee update process is initiated by declaring a new fee (fee increase is limited by up to a 10% from present fee).'
  },
  [PROCESS.WAITING]: {
    title: 'Waiting Period',
    text: 'After declaring a new fee, the operator must wait for a period of at least 3 days before he can execute it.'
  },
  [PROCESS.PENDING]: {
    title: 'Pending Execution',
    text: 'Once the waiting period has past, the operator will have a 7 days period in which he can execute the declared fee'
  },
  [PROCESS.UPDATED]: {
    title: 'Fee Updated',
    text: 'Once executed, the fee update process is finalized and the new fee takes effect.'
  }
};

const UpdateFeeProcesses = () => {
  const classes = useStyles({});

  return (
    <Grid className={classes.ProcessesWrapper}>
      {Object.keys(PROCESSES_DATA).map((key: any) => (
        <ProcessElement
          key={key}
          step={key}
          title={PROCESSES_DATA[key].title}
          text={PROCESSES_DATA[key].text}
        />
      ))}
    </Grid>
  );
};

export default UpdateFeeProcesses;
