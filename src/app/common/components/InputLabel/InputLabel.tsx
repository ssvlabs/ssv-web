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
`;

const Bar = styled.div`
  display: block;
  margin: 15px 0;
`;

type InputLabelProps = {
  children: any,
  title?: string
  withHint?: boolean
  toolTipText?: string
};

const InputLabel = ({ children, title, withHint, toolTipText }: InputLabelProps) => {
  return (
    <InputLabelWrapper>
      <InputHeader>
        {title}
        {withHint && <Tooltip text={toolTipText} />}
      </InputHeader>
      <Bar />
      {children}
    </InputLabelWrapper>
  );
};

export default InputLabel;
