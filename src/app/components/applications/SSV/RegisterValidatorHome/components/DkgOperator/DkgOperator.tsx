import React from 'react';
import Grid from '@mui/material/Grid';
import { truncateText } from '~lib/utils/strings';
import { checkDkgAddress } from '~lib/utils/operatorMetadataHelper';
import { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import AnchorTooltip from '~app/components/common/ToolTip/components/AnchorTooltip/AnchorTooltIp';
import {
    useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/DkgOperator/DkgOperator.styles';

const DkgOperator = ({ operator }: { operator: IOperator }) => {
    const dkgEnabled = !checkDkgAddress(operator.dkg_address ?? '');
    const classes = useStyles({ operatorLogo: operator.logo, dkgEnabled });

    return (
        <Grid className={classes.OperatorDetails}>
            <Grid className={classes.OperatorNameAndIdWrapper}>
                <Grid className={classes.OperatorLogo}/>
                <Grid>
                    {operator.name.length > 12 ? <AnchorTooltip title={operator.name} placement={'top'}>
                        {truncateText(operator.name, 12)}
                    </AnchorTooltip> : operator.name}
                    <Grid className={classes.OperatorId}>ID: {operator.id}</Grid>
                </Grid>
            </Grid>
            <Grid className={classes.DkgEnabledBudge}>DKG {dkgEnabled ? 'Enabled' : 'Disabled'}</Grid>
        </Grid>
    );
};

export default DkgOperator;