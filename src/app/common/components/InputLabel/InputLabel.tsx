import React from 'react';
import styled from 'styled-components';
import Tooltip from '~app/common/components/Tooltip/Tooltip';

const InputLabelWrapper = styled.div`
  display: block;
  font-size: 14px;
`;

const InputHeader = styled.div`
  display: flex;
  width: 100%;
  justifyContent: 'space-between';
  align-items: center;
`;

const Bar = styled.div`
  display: block;
  margin: 15px 0;
`;

const Header = styled.p`
  white-space: nowrap;
  text-transform: none;
  display: inline-flex;
  font-family: 'Roboto-Regular', 'Roboto', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 18px;
`;
const SubHeader = styled.p`
  display: inline-flex;
  margin: 5px 5px 3px 5px;
  font-family: 'Roboto-Regular', 'Roboto', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 15px;
  color: #AAAAAA;
`;

type InputLabelProps = {
  children: any,
  title?: string,
  subTitle?: string,
  withHint?: boolean,
  toolTipText?: string,
  toolTipLink?: string
};

const InputLabel = ({ children, title, subTitle, withHint, toolTipText, toolTipLink }: InputLabelProps) => {
  return (
    <InputLabelWrapper>
      <InputHeader>
        <Header>{title}</Header>
        <SubHeader>{subTitle}</SubHeader>
        {withHint && <Tooltip text={toolTipText} link={toolTipLink} />}
      </InputHeader>
      <Bar />
      {children}
    </InputLabelWrapper>
  );
};

export default InputLabel;
