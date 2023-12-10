import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  BadgeWrapper: {
    display: 'inline-block',
  },
  Wrapper: {
    padding: '1px 8px 1px 8px',
    border: `1px solid ${theme.colors.gray30}`,
    borderRadius: 4,
    backgroundColor: theme.colors.gray20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'row-start',
    alignItems: 'center',
    overflowWrap: 'break-word',
  },
  FolderIcon: {
    width: 12,
    height: 12,
    marginRight: 9,
    cursor: 'pointer',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/folder/folder.svg)',
  },
  Text: {
    fontFamily: 'Inconsolata !important',
    fontSize: 16,
    fontWeight: 500,
    color: `${theme.colors.gray80}!important`,
  },
}));
