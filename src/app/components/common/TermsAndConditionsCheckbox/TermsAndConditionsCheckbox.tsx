import React from 'react';
import { Grid } from '@mui/material';
import LinkText from '~app/components/common/LinkText';
import Checkbox from '~app/components/common/CheckBox/CheckBox';
import { useTermsAndConditions } from '~app/hooks/useTermsAndConditions';
import { useStyles } from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditions.styles';

type TermsAndConditionsType = {
    buttonElement: JSX.Element;
};

const TermsAndConditionsCheckbox = ({ buttonElement } : TermsAndConditionsType) => {
    const classes = useStyles();
    const { checkedConditionHandler, isMainnet } = useTermsAndConditions();

    return (
        <Grid className={classes.BottomScreenWrapper}>
            {isMainnet && <Checkbox
                grayBackGround
                onClickCallBack={checkedConditionHandler}
                text={<Grid>I have read and agreed to the <LinkText text={'terms and conditions'}
                                                                    link={'https://ssv.network/terms-of-use/'}/></Grid>}
            />}
            {buttonElement}
        </Grid>
    );
};

export default TermsAndConditionsCheckbox;