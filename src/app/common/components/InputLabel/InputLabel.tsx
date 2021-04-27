import React from 'react';
import styled from 'styled-components';

const InputLabelWrapper = styled.div`
  display: block;
  font-size: 14px;
`;

type InputLabelProps = {
  children: any,
  title?: string
};

const InputLabel = ({ children, title }: InputLabelProps) => {
  return (
    <InputLabelWrapper>
      {title}
      <br />
      {children}
    </InputLabelWrapper>
  );
};

export default InputLabel;
