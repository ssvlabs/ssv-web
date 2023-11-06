import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

const text = {
  fontSize: 16,
  fontWeight: 500,
  lineHeight: 1.62,
};

const smallerText = {
  ...text,
  fontSize: 14,
};

export const useStyles = makeStyles((theme: Theme) => ({
  Box: {
    width: 280,
    height: 118,
    borderRadius: 8,
    cursor: 'pointer',
    padding: '19px 0 19px 0',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    border: `solid 1px ${theme.colors.primaryBlue}`,
  },
  Disable: {
    border: 'none',
    cursor: 'default',
    pointerEvents: 'none',
    backgroundColor: theme.colors.gray20,
  },
  BoxSelected: {
    '&:first-child': {
      '& div': {
        backgroundImage: 'url(/images/offlineKeyShares/white_desktop.svg)',
      },
    },
    '&:nth-child(2)': {
      '& div': {
        backgroundImage: 'url(/images/offlineKeyShares/white_command_line.svg)',
      },
    },
    '& p': {
      color: `${theme.colors.gray10} !important`,
    },
    backgroundColor: theme.colors.primaryBlue,
    border: `solid 1px ${theme.colors.primaryBlue}`,
  },
  Image: {
    marginBottom: 8,
    width: 50,
    height: 36,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/offlineKeyShares/command_line.svg)',
  },
  Desktop: {
    backgroundImage: 'url(/images/offlineKeyShares/desktop.svg)',
    '& div': {
      backgroundImage: 'url(/images/offlineKeyShares/white_desktop.svg)',
    },
  },
  DkgImage: {
    backgroundImage: 'url(/images/dkg_icons/dkg_icon.svg)',
  },
  DkgImageUnselected: {
    backgroundImage: 'url(/images/dkg_icons/dkg_icon_blue.svg)',
  },
  UnofficialTool: {
    ...smallerText,
    borderRadius: 2,
    padding: '12px 16px',
    color: theme.colors.gray90,
    backgroundColor: theme.colors.white,
    border: `solid 1px ${theme.colors.gray30}`,
  },
  ColumnDirection: {
    display: 'flex',
    flexDirection: 'column',
  },
  OptionTextWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  BlueText: {
    ...text,
    color: theme.colors.primaryBlue,
  },
  AdditionalGrayText: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.colors.gray40,
  },
  GrayText: {
    ...text,
    color: theme.colors.gray60,
  },
  BlackText: {
    ...text,
    color: theme.colors.gray90,
  },
  CopyButton: {
    width: 56,
    height: 28,
    fontSize: 16,
    borderRadius: 8,
    fontWeight: 600,
    lineHeight: 1.25,
    cursor: 'pointer',
    padding: '4px 8px',
    textAlign: 'center',
    color: theme.colors.gray90,
    backgroundColor: theme.colors.gray20,
  },
  ButtonCopied: {
    gap: 2,
    width: 88,
    height: 28,
    borderRadius: 8,
    cursor: 'pointer',
    alignItems: 'center',
    padding: '4px 8px',
    backgroundColor: '#1fcf98',
  },
  TextCopied: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1.25,
    color: theme.colors.gray90,
  },
  V: {
    width: 14,
    height: 14,
    marginTop: 2,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/v/black.svg)',
  },
  CopyWrapper: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    padding: '0 16px 0 16px',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.gray80,
  },
  CopyText: {
    height: 22,
    overflowX: 'scroll',
    overflowY: 'hidden',
    ...smallerText,
    // overflow:'hidden',
    whiteSpace: 'nowrap',
    // textOverflow: 'ellipsis',
    color: theme.colors.gray10,
    '&::-webkit-scrollbar': {
      display: 'none',  /* Safari and Chrome */
    },
  },
  DkgInstructionsWrapper: {
    gap: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  DkgNotification: {
    width: '100%',
    height: 47,
    fontSize: 14,
    fontWeight: 500,
    padding: '12px 16px 12px 16px',
    color: theme.colors.gray90,
    border: `1px solid ${theme.colors.gray30}`,
    backgroundColor: theme.darkMode ? theme.colors.white : '#F8FCFF',
  },
  DkgText: {
    gap: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.colors.gray90,
  },
  DkgErrorMessage: {
    color: theme.colors.primaryError,
  },
  DkgTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.gray40,
  },
  DkgWithdrawAddressWrapper: {
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  DkgInputLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.gray40,
  },
  DkgOperatorsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  DkgSectionWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    overflow: 'hidden',
  },
  DkgCliAdditionalText: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.colors.gray60,
    position: 'relative',
    bottom: 4,
  },
}));
