import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { getCurrentNetwork, NETWORKS } from '~lib/utils/envHelper';
import { useStyles } from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditions.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';

export const useTermsAndConditions = () => {
    const classes = useStyles();
    const { networkId } = getCurrentNetwork();
    const [checkedCondition, setCheckedCondition] = useState(networkId !== NETWORKS.MAINNET);

    const checkedConditionHandler = () => checkedCondition ?  setCheckedCondition(false) : setCheckedCondition(true);

    const termsConditionWrapper = (buttonElement : JSX.Element) => ( <Grid className={classes.BottomScreenWrapper}>
            {networkId === NETWORKS.MAINNET &&
                <TermsAndConditionsCheckbox setTermsAndConditions={checkedConditionHandler}/>}
            {buttonElement}
        </Grid>
    );

    return { termsConditionWrapper, checkedCondition };
};
