import React from 'react';
import styled from 'styled-components';
import logo from '~app/common/components/AppBar/images/logo.svg';

const Logo = styled.img`
  vertical-align: center;
  display: flex;
  margin: auto auto auto 0;
`;

const LogoComponent = () => (
  <Logo src={logo} alt="SSV" />
);

export default LogoComponent;
