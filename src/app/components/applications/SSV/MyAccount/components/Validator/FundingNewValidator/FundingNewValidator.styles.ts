import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';


const daysText = {
  fontSize: 20,
  lineHeight: 1.4,
  fontWeight: 'normal',
};

export const useStyles = makeStyles((theme: Theme) => ({
  Text: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    marginBottom: 24,
    color: theme.colors.gray80,
  },
  NegativeDays: {
    ...daysText,
    color: theme.colors.primaryError,
  },
  PositiveDays: {
    ...daysText,
    color: '#08c858',
  },
  BoldGray: {
    fontSize: 20,
    lineHeight: 1.4,
    fontWeight: 'bold',
    color: theme.colors.gray60,
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
    fontSize: 20,
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 1.14,
    fontWeight: 'bold',
    color: theme.colors.gray40,
  },
  LightGreyHeader: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 1.62,
    fontWeight: 'bold',
    color: theme.colors.gray40,
  },
  BiggerFont: {
    fontSize: 16,
  },
  FieldBox: {
    borderRadius: 8,
    minHeight: 118.5,
    cursor: 'pointer',
    padding: '18px 24px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    border: `solid 1px ${theme.colors.gray30}`,
  },
  OptionBox: {
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
  ToolTip: {
    marginBottom: 6,
  },
  DaysText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    marginBottom: -2,
    alignSelf: 'end',
    color: theme.colors.gray40,
  },
  Bold: {
    fontSize: 24,
    fontWeight: 800,
    lineHeight: 1.24,
    letterSpacing: -0.25,
    color: theme.colors.gray90,
  },
  LessBold: {
    fontWeight: 'normal',
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
