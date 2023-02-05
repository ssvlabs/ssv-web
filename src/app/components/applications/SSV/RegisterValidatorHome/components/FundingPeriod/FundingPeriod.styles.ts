import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  Section: {
    '&:nth-child(2)': {
      padding: '13px 28px 23px 32px',
      borderBottom: `solid 1px ${theme.colors.gray20}`,
    },
    '&:nth-child(3)': {
      padding: '24px 32px 24px 32px',
      borderBottom: `solid 1px ${theme.colors.gray20}`,
    },
    '&:nth-child(4)': {
      padding: '24px 32px 24px 32px',
    },

  },
  Text: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    marginBottom: 24,
    color: theme.colors.gray80,
  },
  ErrorBox: {
    marginBottom: 0,
    alignContent: 'center',
  },
  Link: {
    fontSize: 14,
    cursor: 'pointer',
    textDecoration: 'underline',
    color: theme.colors.primaryBlue,
  },
  GreyHeader: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 1.14,
    fontWeight: 600,
    color: theme.colors.gray40,
  },
  BiggerFont: {
    fontSize: 16,
  },
  Box: {
    minHeight: 64,
    borderRadius: 8,
    cursor: 'pointer',
    padding: '18px 24px',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    border: `solid 1px ${theme.colors.gray30}`,
  },
  SelectedBox: {
    border: `solid 1px ${theme.colors.primaryBlue}`,
  },
  SsvPrice: {
    fontSize: 20,
    lineHeight: 1.4,
    fontWeight: 'bold',
    color: theme.colors.gray90,
  },
  CheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: theme.colors.gray10,
    border: `solid 1px ${theme.colors.gray40}`,
  },
  CheckedCircle: {
    width: 18,
    height: 18,
    cursor: 'pointer',
    alignItems: 'center',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/blueCircle/blue_checked_circle.svg)',
  },
  TimeText: {
    fontSize: 20,
    lineHeight: 1.4,
    color: theme.colors.gray90,
  },
  DaysInput: {
    marginTop: 24,
  },
}));
