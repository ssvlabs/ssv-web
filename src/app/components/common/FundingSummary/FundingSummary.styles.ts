import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  Wrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Title: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.gray40,
  },
  Value: {
    fontSize: 16,
    fontWeight: 500,
    color: theme.colors.gray90,
  },
  FundingSummaryColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  FeeColumn: {
    marginLeft: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  ValidatorsColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  SubtotalColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
}));

