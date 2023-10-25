import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

const text = {
  fontSize: 16,
  fontWeight: 500,
  lineHeight: 1.62,
};

export const useStyles = makeStyles((theme: Theme) => ({
  Box: {
    gap: 8,
    width: 280,
    height: 118,
    borderRadius: 8,
    cursor: 'pointer',
    padding: '24px 0',
    alignItems: 'center',
    justifyContent: 'center',
    border: `solid 1px ${theme.colors.primaryBlue}`,
  },
  Disable: {
    border: 'none',
    cursor: 'default',
    pointerEvents: 'none',
    backgroundColor: theme.colors.gray20,
  },
  ColumnDirection: {
    display: 'flex',
    flexDirection: 'column',
  },
  BlueText: {
    ...text,
    color: theme.colors.primaryBlue,
  },
  GrayText: {
    ...text,
    color: theme.colors.gray60,
  },
  BlackText: {
    ...text,
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
  DkgInstructionsWrapper: {
    gap: 30,
    display: 'flex',
    flexDirection: 'column',
  },
  DkgNotification: {
    width: '100%',
    fontSize: 14,
    fontWeight: 500,
    padding: '12px 16px',
    color: theme.colors.gray90,
    border: `1px solid ${theme.colors.gray30}`,
    backgroundColor: theme.darkMode ? theme.colors.white : '#F8FCFF',
    borderRadius: '5px',
  },
  DkgText: {
    gap: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.colors.gray90,
  },
  DkgTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.gray40,
  },
  DkgCode: {  // For the `<code>` tags
    backgroundColor: '#E6F7FF',  // A blue-ish tone similar to the image
    borderRadius: '4px',  // slightly rounded corners
    padding: '2px 4px',  // Padding for the code tags
    color: '#333',  // A slightly darker text color
  },
}));