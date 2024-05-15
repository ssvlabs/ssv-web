
import { Grid } from '@mui/material';
import styled from 'styled-components';
import config from '~app/common/config';
import LinkText from '~app/components/common/LinkText';
import Checkbox from '~app/components/common/CheckBox/CheckBox';

type TermsAndConditionsType = {
    children: JSX.Element;
    isChecked: boolean;
    toggleIsChecked: () => void;
    isMainnet: boolean;
};

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`;

const TermsAndConditionsCheckbox = ({ children, isChecked, toggleIsChecked, isMainnet } : TermsAndConditionsType) => (
    <Wrapper>
        {isMainnet && <Checkbox
          isChecked={isChecked}
            grayBackGround
            toggleIsChecked={toggleIsChecked}
            text={<Grid>I have read and agreed to the <LinkText text={'terms and conditions'} link={config.links.TERMS_OF_USE_LINK}/></Grid>}
        />}
        {children}
    </Wrapper>
);

export default TermsAndConditionsCheckbox;
