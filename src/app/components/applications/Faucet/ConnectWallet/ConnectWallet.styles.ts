import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  Warning: {
    gap: 10,
    height: 70,
    fontSize: 14,
    marginTop: 20,
    width: '100%',
    borderRadius: 2,
    fontWeight: 500,
    marginBottom: 40,
    display: 'flex',
    lineHeight: 1.62,
    padding: '12px 16px',
    alignItems: 'center',
    flexDirection: 'row',
    color: theme.colors.gray90,
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.primaryWarningRegular,
    border: `solid 1px ${theme.colors.primaryWarningRegular}`,
  },
  SubHeader: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray90,
  },
}));
