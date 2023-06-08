import React from 'react';
import { Grid } from '@mui/material';
import LinkText from '~app/components/common/LinkText';
import Checkbox from '~app/components/common/CheckBox/CheckBox';

type TermsAndConditionsType = {
    setTermsAndConditions: Function;
};

const TermsAndConditionsCheckbox = ({ setTermsAndConditions } : TermsAndConditionsType) => (
        <Checkbox
            grayBackGround
            onClickCallBack={setTermsAndConditions}
            text={<Grid>I have read and agreed to the <LinkText text={'terms and conditions'} link={'https://ssv.network/terms-of-use/'}/></Grid>}
        />
    );

export default TermsAndConditionsCheckbox;