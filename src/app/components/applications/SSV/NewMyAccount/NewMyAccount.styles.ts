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

export const useStyles = makeStyles((theme: Theme) => ({
  MyAccountWrapper: {
    gap: 24,
    width: 1320,
    marginTop: 32,
    margin: 'auto',
    flexDirection: 'column',
  },
  Pencil: {
    width: 10.5,
    height: 10.5,
    alignItems: 'center',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/pencil/blue.svg)',
  },
  HeaderWrapper: {
    justifyContent: 'space-between',
  },
  Liquidated: {
    width: 82,
    ...warningRunWayStates,
    color: theme.colors.primaryError,
    backgroundColor: 'rgba(236, 28, 38, 0.03)',
  },
  LowRunWay: {
    width: 93,
    ...warningRunWayStates,
    color: theme.colors.primaryError,
    backgroundColor: 'rgba(253, 218, 72, 0.2)',
  },
  CircleImageOperator: {
    width: 30,
    height: 30,
    alignItems: 'center',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/operator_default_background/circle_light.png)',
  },
  CircleImageOperatorWrapper: {
    width: 40,
    height: 40,
    padding: 4,
    borderRadius: '50%',
    border: `solid 1px ${theme.colors.gray20}`,
  },
  Header: {
    fontSize: 24,
    fontWeight: 800,
    lineHeight: 1.24,
    textAlign: 'left',
    letterSpacing: -0.25,
    color: theme.colors.gray90,
  },
  Arrow: {
    width: 32,
    height: 32,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/diagramArrow/light.svg)',
  },
  HeaderButtonsWrapper: {
    gap: 16,
    justifyContent: 'flex-end',
  },
  HeaderButton: {
    gap: 8,
    width: 164,
    height: 48,
    fontSize: 16,
    fontWeight: 600,
    display: 'flex',
    borderRadius: 8,
    lineHeight: 1.25,
    cursor: 'pointer',
    alignItems: 'center',
    padding: '16px 24px',
    justifyContent: 'center',
    color: theme.colors.white,
    backgroundColor: theme.colors.primaryBlue,
  },
  lightHeaderButton: {
    color: theme.colors.primaryBlue,
    backgroundColor: theme.colors.tint70,
  },
}));
