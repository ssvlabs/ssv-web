import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  Wrapper: {
    gap: 12,
    fontSize: 14,
    borderRadius: 2,
    fontWeight: 500,
    lineHeight: 1.62,
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    color: theme.colors.gray90,
    justifyContent: 'space-between',
    border: `solid 1px ${theme.colors.warning}`,
    backgroundColor: theme.colors.primaryWarningRegular
  }
}));
