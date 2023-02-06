import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  Wrapper: {
    height: 50,
    borderRadius: 8,
    backgroundColor: theme.colors.gray10,
    border: `solid 1px ${theme.colors.gray20}`,
    padding: theme.spacing(3, 4, 3, 5),
  },
  WhiteBackGround: {
    backgroundColor: theme.colors.white,
  },
  PublicKey: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginRight: 5,
    textOverflow: 'ellipsis',
    color: theme.colors.gray60,
  },
  CopyImage: {
    width: 24,
    height: 24,
    cursor: 'pointer',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    backgroundImage: `url(/images/copy/${theme.darkMode ? 'light' : 'dark'}.svg)`,
  },
  BeaconImage: {
    width: 24,
    height: 24,
    marginLeft: theme.spacing(2),
    cursor: 'pointer',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(/images/beacon/${theme.darkMode ? 'dark' : 'light'}.svg)`,
  },
  EtherScanImage: {
    width: 24,
    height: 24,
    cursor: 'pointer',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(/images/ether_scan/${theme.darkMode ? 'dark' : 'light'}.svg)`,
  },
}));
