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
    gap: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  DkgNotification: {
    gap: 20,
    width: 808,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 14,
    fontWeight: 500,
    padding: '12px',
    color: theme.colors.gray90,
    border: `1px solid ${theme.colors.gray30}`,
    backgroundColor: theme.darkMode ? theme.colors.white : '#F8FCFF',
    borderRadius: '5px',
  },
  DkgText: {
    fontSize: 16,
    fontWeight: 500,
    color: theme.colors.gray90,
  },
  StepTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: theme.colors.primaryBlue,
  },
  DkgTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: theme.colors.gray90,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  DkgCode: {  // For the `<code>` tags
    backgroundColor: theme.colors.tint80,  // A blue-ish tone similar to the image
    borderRadius: '4px',  // slightly rounded corners
    padding: '2px 4px',  // Padding for the code tags
    color: theme.colors.primaryBlue,  // A slightly darker text color
  },
  DkgCodeText: {
    fontSize: 16,
    fontWeight: 500,
    color: theme.colors.gray90,
  },
  TitleBox: {
    width: 872,
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    padding: '32px',
    fontSize: 24,
    fontWeight: 800,
    color: theme.colors.gray90,
  },
  CeremonyContainerWrapper: {
    gap: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  StepAndBadgeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  CompletedBadge: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '1px 8px 1px 8px',
    backgroundColor: '#08C85829',
    borderRadius: 4,
  },
  CompletedBadgeText: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.colors.primarySuccessDark,
  },
  CompletedIcon: {
    width: 16,
    height: 16,
    marginLeft: 8,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/step-done.svg)',
  },
  BackButtonWrapper: {
    width: 872,
    marginTop: 20,
  },
  SelectedBoxBorder: {
    border: `1px solid ${theme.colors.primaryBlue}`,
  },
  Line: {
    width: '100%',
    height: 1,
    border: `1px solid ${theme.colors.gray30}`,
  },
}));
