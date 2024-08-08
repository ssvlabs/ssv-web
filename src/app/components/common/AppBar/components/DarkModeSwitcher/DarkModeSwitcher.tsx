import Grid from '@mui/material/Grid';
import { useStyles } from './DarkModeSwitcher.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getIsDarkMode, toggleDarkMode } from '~app/redux/appState.slice';

type Props = {
  margin?: boolean;
};

const DarkModeSwitcher = (props: Props) => {
  const { margin } = props;
  const isDarkMode = useAppSelector(getIsDarkMode);
  const dispatch = useAppDispatch();
  const classes = useStyles({ isDarkMode, margin });

  return <Grid item className={classes.Image} onClick={() => dispatch(toggleDarkMode())} />;
};

export default DarkModeSwitcher;
