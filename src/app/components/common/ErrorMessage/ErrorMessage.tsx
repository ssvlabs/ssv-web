import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useStyles } from './ErrorMessage.styles';
import { ReactElement } from 'react';

type MessageDivProps = {
  text: string | ReactElement;
  extendClasses?: any;
};

const ErrorMessage = ({ text, extendClasses }: MessageDivProps) => {
  const classes = useStyles();
  return <Grid className={`${classes.Wrapper} ${extendClasses}`}>{text}</Grid>;
};

export default observer(ErrorMessage);
