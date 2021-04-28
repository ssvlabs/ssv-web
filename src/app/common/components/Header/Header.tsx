import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '~app/common/components/Header/Header.styles';

type HeaderProps = {
  title: string,
  subtitle: string
};

const Header = ({ title, subtitle }: HeaderProps) => {
  const classes = useStyles();
  return (
    <div className={classes.header}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="subtitle1" style={{ fontSize: 13 }}>{subtitle}</Typography>
    </div>
  );
};

export default Header;
