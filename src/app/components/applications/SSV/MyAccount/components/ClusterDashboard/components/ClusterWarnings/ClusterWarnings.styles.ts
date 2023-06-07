import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

const warningRunWayStates = {
  gap: 10,
  height: 26,
  fontSize: 14,
  borderRadius: 4,
  fontWeight: 500,
  lineHeight: 1.62,
  padding: '1px 6px',
  alignItems: 'center',
  justifyContent: 'center',
};

const text = {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.62,
  letterSpacing: 'normal',
};
export const useStyles = makeStyles((theme: Theme) => ({
  Liquidated: {
    width: 82,
    position: 'relative',
    ...warningRunWayStates,
    color: theme.colors.primaryError,
    backgroundColor: 'rgba(236, 28, 38, 0.03)',
  },
  LowRunWay: {
    width: 93,
    position: 'relative',
    ...warningRunWayStates,
    color: theme.colors.primaryError,
    backgroundColor: 'rgba(253, 218, 72, 0.2)',
  },
  LowRunWayPopUpWrapper: {
    top: -40,
    ...text,
    right: 100,
    width: 416,
    height: 119,
    display: 'flex',
    borderRadius: 8,
    padding: '8px 16px',
    alignItems: 'center',
    position: 'absolute',
    color: theme.colors.gray80,
    backgroundColor: '#ffffea',
    justifyContent: 'flex-start',
    border: `solid 1px ${theme.colors.warning}`,
  },
  LiquidatedPopUpWrapper: {
    top: -40,
    ...text,
    right: 100,
    width: 416,
    height: 101,
    display: 'flex',
    borderRadius: 8,
    padding: '8px 16px',
    alignItems: 'center',
    position: 'absolute',
    color: theme.colors.gray80,
    backgroundColor: '#fff4f4',
    justifyContent: 'flex-start',
    border: `solid 1px ${theme.colors.primaryError}`,
  },
  LiquidationLink: {
    ...text,
    color: theme.colors.primaryBlue,
  },
  PopUpText: {},
}));
