import Grid from '@mui/material/Grid';
import { truncateText } from '~lib/utils/strings';
import { isDkgAddressValid } from '~lib/utils/operatorMetadataHelper';
import AnchorTooltip from '~app/components/common/ToolTip/components/AnchorTooltip/AnchorTooltIp';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/DkgOperator/DkgOperator.styles';
import { IOperator } from '~app/model/operator.model';

const DkgOperator = ({ operator }: { operator: IOperator }) => {
  const isDkgEnabled = isDkgAddressValid(operator.dkg_address ?? '');
  const classes = useStyles({ operatorLogo: operator.logo, dkgEnabled: isDkgEnabled });

  return (
    <Grid className={classes.OperatorDetails}>
      <Grid className={classes.OperatorNameAndIdWrapper}>
        <Grid className={classes.OperatorLogo} />
        <Grid className={classes.OperatorName}>
          {operator.name.length > 12 ? (
            <AnchorTooltip title={operator.name} placement={'top'}>
              {truncateText(operator.name, 12)}
            </AnchorTooltip>
          ) : (
            operator.name
          )}
          <Grid className={classes.OperatorId}>ID: {operator.id}</Grid>
        </Grid>
      </Grid>
      <Grid className={classes.DkgEnabledBudge}>DKG {isDkgEnabled ? 'Enabled' : 'Disabled'}</Grid>
    </Grid>
  );
};

export default DkgOperator;
