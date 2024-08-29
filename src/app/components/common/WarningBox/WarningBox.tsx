import Grid from '@mui/material/Grid';
import { useStyles } from './WarningBox.styles';
import LinkText from '~app/components/common/LinkText';
import styled from 'styled-components';

type InputProps = {
  text: string;
  link?: string;
  textLink?: string;
  extendClass?: any;
  withLogo?: boolean;
};

const WarningLogo = styled.div`
  width: 46px;
  height: 24px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(/images/warning/warning.svg);
`;

const WarningBox = ({ text, link, textLink, extendClass, withLogo }: InputProps) => {
  const classes = useStyles();

  return (
    <Grid container className={`${classes.Wrapper} ${extendClass}`}>
      {withLogo && <WarningLogo />}
      {text}
      {link && textLink && <LinkText text={textLink} link={link} />}
    </Grid>
  );
};

export default WarningBox;
