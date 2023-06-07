import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  GrayText: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.14,
    color: theme.colors.gray40,
  },
  Wrapper: {
    marginTop: 24,
  },
  Section: {
    padding: '12px 32px 32px',
  },
  BulletText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray90,
  },
  Warning: {
    gap: 10,
    height: 70,
    fontSize: 14,
    borderRadius: 2,
    fontWeight: 500,
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
}));