import Grid from '@mui/material/Grid';
import { useStyles } from './WarningBox.styles';
import LinkText from '~app/components/common/LinkText';

type InputProps = {
  text: string;
  link?: string;
  textLink?: string;
  extendClass?: any;
};

const WarningBox = ({ text, link, textLink, extendClass }: InputProps) => {
  const classes = useStyles();

  return (
    <Grid container className={`${classes.Wrapper} ${extendClass}`}>
      {text}
      {link && textLink && <LinkText text={textLink} link={link} />}
    </Grid>
  );
};

export default WarningBox;
