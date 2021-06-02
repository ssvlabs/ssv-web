import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '~app/common/components/Header/Header.styles';

type HeaderProps = {
  title: string,
  subtitle: string,
  centralize?: boolean
};

const Header = ({ title, subtitle, centralize }: HeaderProps) => {
  const classes = useStyles();
  return (
    <div className={`${classes.header} ${centralize ? classes.centralized : ''}`}>
      <Typography variant="h6" data-testid="header-title">{title}</Typography>
      <Typography variant="subtitle1" style={{ fontSize: 13 }} data-testid="sub-header-title">{subtitle}</Typography>
    </div>
  );
};

export default Header;
