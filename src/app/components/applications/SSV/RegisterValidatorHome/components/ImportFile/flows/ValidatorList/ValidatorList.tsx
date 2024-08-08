import Grid from '@mui/material/Grid';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorList.styles';
import Typography from '@mui/material/Typography';
import ValidatorSlot from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorSlot';
import { ValidatorType } from '~root/services/keyShare.service';

const ValidatorList = ({ validatorsList }: { validatorsList: ValidatorType[] }) => {
  const classes = useStyles();
  return (
    <Grid className={classes.TableWrapper}>
      <Grid className={classes.TableHeader}>
        <Typography className={classes.HeaderText}>Public Key</Typography>
      </Grid>
      {validatorsList.map((validator: ValidatorType, index: number) => (
        <ValidatorSlot
          key={index}
          isSelected={validator.isSelected}
          validatorPublicKey={validator.publicKey}
          registered={validator.registered}
          errorMessage={validator.errorMessage}
        />
      ))}
    </Grid>
  );
};

export default ValidatorList;
