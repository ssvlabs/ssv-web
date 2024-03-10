import React from 'react';
import { Grid } from '@mui/material';
import config from '~app/common/config';
import LinkText from '~app/components/common/LinkText';
import Checkbox from '~app/components/common/CheckBox/CheckBox';
import { useTermsAndConditions } from '~app/hooks/useTermsAndConditions';
import { useStyles } from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditions.styles';
import { isMainnet } from '~root/providers/networkInfo.provider';

type TermsAndConditionsType = {
    children: JSX.Element;
};

const TermsAndConditionsCheckbox = ({ children } : TermsAndConditionsType) => {
    const classes = useStyles();
    const { checkedConditionHandler } = useTermsAndConditions();

    return (
        <Grid className={classes.BottomScreenWrapper}>
            {isMainnet() && <Checkbox
                grayBackGround
                onClickCallBack={checkedConditionHandler}
                text={<Grid>I have read and agreed to the <LinkText text={'terms and conditions'}
                                                                    link={config.links.TERMS_OF_USE_LINK}/></Grid>}
            />}
            {children}
        </Grid>
    );
};

export default TermsAndConditionsCheckbox;
