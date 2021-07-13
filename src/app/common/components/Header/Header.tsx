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
    <div className={`${centralize ? classes.centralized : ''}`}>
      <Typography className={classes.header} variant="h6" data-testid="header-title">{title}</Typography>
      <Typography className={classes.subHeader} variant="subtitle1">{subtitle}</Typography>
    </div>
  );
};

export default Header;
