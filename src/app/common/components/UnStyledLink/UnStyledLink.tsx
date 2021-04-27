import styled from 'styled-components';

const UnStyledLink = (BaseComponent: any) => {
  return styled(BaseComponent)<Record<string, any>>`
    color: initial;
    text-decoration: none;
    &:hover {
      text-decoration: none;
      color: initial;
    }
  `;
};

export default UnStyledLink;
