import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import UnStyledLink from '~app/common/components/UnStyledLink';

type ConditionalLinkParams = {
    children: any,
    to: string,
    condition: string | boolean,
    onClick: React.Dispatch<void>,
};
const RouteLink = UnStyledLink(RouterLink);
const styled = { cursor: 'pointer' };
const ConditionalLink = ({ children, to, condition, onClick }: ConditionalLinkParams) => (!!condition && to)
    ? <RouteLink data-testid={to} to={to}>{children}</RouteLink>
    : React.cloneElement(<div style={styled}>{children}</div>, {
        onClick,
    });

export default ConditionalLink;
