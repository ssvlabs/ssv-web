import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

type Props = {
  errorSpinner?: boolean;
  isWhite?: boolean;
};

export const useStyles = makeStyles((theme: Theme) => ({
  SpinnerWrapper: {
    marginRight: 20,
    color: (props: Props) => {
      return props.isWhite ? theme.colors.white : props.errorSpinner ? theme.colors.primaryError : theme.colors.tint20;
    }
  }
}));
