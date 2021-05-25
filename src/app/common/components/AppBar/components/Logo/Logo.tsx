import React from 'react';
import styled from 'styled-components';

const Logo = styled.img`
  vertical-align: center;
  display: flex;
  margin: auto auto auto 0;
`;

const LogoComponent = () => (
  <Logo src="/images/logo.svg" alt="SSV" />
);

export default LogoComponent;
