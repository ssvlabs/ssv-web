import React from 'react';
import Checkbox from '~app/components/common/CheckBox/CheckBox';
// import { useStyles } from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditions.styles';

type TermsAndConditionsType = {
    setTermsAndConditions: Function;
};

const TermsAndConditionsCheckbox = ({ setTermsAndConditions } : TermsAndConditionsType) => {
    // const classes = useStyles();

    return (
        <Checkbox
            grayBackGround
            onClickCallBack={setTermsAndConditions}
            text={'I have read and agreed to the terms and conditions'}
            // checkBoxWrapperClass={classes.TermsAndConditions}
        />
    );
};

export default TermsAndConditionsCheckbox;