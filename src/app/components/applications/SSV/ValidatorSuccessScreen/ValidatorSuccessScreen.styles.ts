import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  Wrapper: {
    gap: 24
  },
  Section: {
    padding: '16px 32px 32px 32px'
  },
  Operator: {
    gap: 3,
    width: 60,
    marginBottom: 8
  },
  ClusterID: {
    alignItems: 'center',
    gap: 8,
    '& p': {
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.14,
      color: theme.colors.gray60
    }
  },
  OperatorImage: {
    height: 60,
    borderRadius: '50%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    border: `1px solid ${theme.colors.gray20}`,
    backgroundImage: 'url(/images/operator_default_background/circle_light.png)'
  },
  CircleImageOperatorWrapper: {
    position: 'relative',
    zIndex: '10'
  },
  OperatorName: {
    fontSize: 10,
    fontWeight: 300,
    lineHeight: 1.62,
    letterSpacing: 0.5,
    color: theme.colors.black
  },
  OperatorId: {
    fontSize: 10,
    fontWeight: 300,
    lineHeight: 1.62,
    letterSpacing: 0.5,
    color: theme.colors.gray40
  },
  Text: {
    zIndex: 9,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray80
  },
  OperatorData: {
    display: 'flex',
    flexDirection: 'column'
  },
  OperatorCardMargin: {
    marginLeft: '40px'
  }
}));
