import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { IncreaseSteps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/IncreaseFlow.tsx';

export enum StepperSteps {
  DECLARE_FEE = 0,
  WAITING = 1,
  EXECUTION = 2,
  UPDATED = 3,
  EXPIRED = 4,
  CANCELED = 5
}

export const useStyles = makeStyles((theme: Theme) => ({
  ChangeFeeWrapper: {
    gap: 24,
    display: 'flex',
    flexDirection: 'column',
    color: theme.colors.black,
    justifyContent: 'space-around'
  },
  Stepper: {
    marginTop: 24,
    marginBottom: 40
  },
  Line: {
    height: 4,
    width: 154,
    flexGrow: 2,
    borderRadius: 8,
    '&:nth-of-type(2)': {
      backgroundColor: (props: any) => {
        if (props.step === StepperSteps.DECLARE_FEE) {
          return theme.colors.gray20;
        }
        return theme.colors.primaryBlue;
      }
    },
    '&:nth-of-type(4)': {
      backgroundColor: (props: any) => {
        if (props.isCanceled && props.prevStep === IncreaseSteps.WAITING) {
          return theme.colors.primaryError;
        }
        if (props.step <= StepperSteps.WAITING) {
          return theme.colors.gray20;
        }
        return theme.colors.primaryBlue;
      }
    },
    '&:nth-of-type(6)': {
      backgroundColor: (props: any) => {
        if (props.step === StepperSteps.EXPIRED || props.isCanceled) {
          return theme.colors.primaryError;
        }
        if (props.step <= StepperSteps.EXECUTION) {
          return theme.colors.gray20;
        }
        return theme.colors.primaryBlue;
      }
    },
    '&:nth-of-type(8)': {
      backgroundColor: (props: any) => {
        if (props.step === StepperSteps.EXPIRED || props.isCanceled) {
          return theme.colors.primaryError;
        }
        if (props.step === StepperSteps.DECLARE_FEE) {
          return theme.colors.gray20;
        }
        return theme.colors.primaryBlue;
      }
    }
  },
  ProgressBarWrapper: {
    // gap: 4,
    display: 'flex',
    alignItems: 'center'
  },
  ProgressBarTextWrapper: {
    marginTop: 12,
    justifyContent: 'space-between'
  },
  ProgressBarText: {
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.62,
    textAlign: (props: any) => props.subTextAlign,
    '&:nth-child(1)': {
      fontWeight: (props: any) => (props.step === StepperSteps.DECLARE_FEE ? 800 : 500),
      color: (props: any) => (props.step === StepperSteps.DECLARE_FEE ? theme.colors.gray80 : theme.colors.gray60)
    },
    '&:nth-child(2)': {
      fontWeight: (props: any) => (props.step === StepperSteps.WAITING ? 800 : 500),
      color: (props: any) => (props.step === StepperSteps.WAITING ? theme.colors.gray80 : theme.colors.gray60)
    },
    '&:nth-child(3)': {
      fontWeight: (props: any) => (props.step === StepperSteps.EXECUTION ? 800 : 500),
      color: (props: any) => (props.step === StepperSteps.EXECUTION ? theme.colors.gray80 : theme.colors.gray60)
    },
    '&:nth-child(4)': {
      fontWeight: 500,
      color: theme.colors.gray60
    }
  },
  DeclaredFee: {
    fontSize: 14,
    display: 'flex',
    lineHeight: 1.62,
    flexDirection: 'row',
    alignItems: 'flex-start',
    fontWeight: (props: any) => (props.step === StepperSteps.DECLARE_FEE ? 800 : 500)
  },
  WaitingPeriod: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.primaryBlue
  },
  ExpiresIn: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.62,
    textAlign: 'center',
    color: theme.colors.primaryError
  },
  StepWrapper: {
    width: 24,
    height: 24,
    flexGrow: 1,
    fontSize: 16,
    display: 'flex',
    fontWeight: 500,
    borderRadius: 16,
    alignText: 'center',
    justifyContent: 'center',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    // first circle
    '&:nth-of-type(1)': {
      border: (props: any) => {
        return props.step === StepperSteps.DECLARE_FEE ? `3px solid ${theme.colors.primaryBlue}` : 'none';
      },
      backgroundImage: (props: any) => {
        if (props.step === StepperSteps.DECLARE_FEE) {
          return 'none';
        }
        return `url(/images/checkbox/${theme.darkMode ? 'dark' : 'light'}.svg)`;
      }
    },
    // second circle
    '&:nth-of-type(3)': {
      border: (props: any) => {
        if (props.step === StepperSteps.WAITING) {
          return `2px solid ${theme.colors.primaryBlue}`;
        }
        return 'none';
      },
      backgroundColor: (props: any) => {
        if (props.isCanceled && props.prevStep === IncreaseSteps.WAITING) {
          return theme.colors.primaryError;
        }
        if (props.step < StepperSteps.WAITING) {
          return theme.colors.gray20;
        }
        return theme.colors.white;
      },
      backgroundImage: (props: any) => {
        if (props.isCanceled && props.prevStep === IncreaseSteps.WAITING) {
          return 'url(/images/x/white.svg)';
        }
        if (props.step < StepperSteps.EXECUTION) {
          return 'none';
        }
        return `url(/images/checkbox/${theme.darkMode ? 'dark' : 'light'}.svg)`;
      }
    },
    // third circle
    '&:nth-of-type(5)': {
      border: (props: any) => {
        if (props.step === StepperSteps.EXECUTION) {
          return `2px solid ${theme.colors.primaryBlue}`;
        }
        return 'none';
      },
      backgroundColor: (props: any) => {
        if (props.step === StepperSteps.EXPIRED || props.isCanceled) {
          return theme.colors.primaryError;
        }
        if (props.step === StepperSteps.EXECUTION) {
          return 'none';
        }
        if (props.step < StepperSteps.EXECUTION) {
          return theme.colors.gray20;
        }
        return theme.colors.primaryBlue;
      },
      backgroundImage: (props: any) => {
        if (props.step === StepperSteps.EXPIRED || props.isCanceled) {
          return 'url(/images/x/white.svg)';
        }
        if (props.step > StepperSteps.EXECUTION) {
          return `url(/images/checkbox/${theme.darkMode ? 'dark' : 'light'}.svg)`;
        }
        return 'none';
      }
    },
    // forth circle
    '&:nth-of-type(7)': {
      backgroundColor: (props: any) => {
        if (props.step === StepperSteps.EXPIRED || props.isCanceled) {
          return theme.colors.primaryError;
        }
        if (props.step < StepperSteps.UPDATED) {
          return theme.colors.gray20;
        }
        return 'none';
      },
      backgroundImage: (props: any) => {
        if (props.step === StepperSteps.EXPIRED) {
          return theme.colors.primaryError;
        }
        if (props.isCanceled) {
          return 'url(/images/x/white.svg)';
        }
        if (props.step === StepperSteps.UPDATED) {
          return `url(/images/checkbox/${theme.darkMode ? 'dark' : 'light'}.svg)`;
        }
        return 'none';
      }
    }
  },

  BulletsWrapper: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray60,
    '& ul': {
      margin: 0,
      paddingLeft: 16
    }
  },
  ButtonsWrapper: {
    gap: 24
  },
  CancelButton: {
    height: 60,
    width: '100%',
    fontSize: 16,
    fontWeight: 600,
    borderRadius: 8,
    lineHeight: 1.25,
    transition: 'none',
    textTransform: 'unset',
    color: theme.colors.primaryBlue,
    fontFamily: 'Manrope !important',
    backgroundColor: theme.colors.white,
    border: `solid 1px ${theme.colors.primaryBlue}`,
    '&:hover': {
      backgroundColor: theme.colors.tint80
    },
    '&:active': {
      backgroundColor: theme.colors.tint70
    },
    '&:disabled': {
      border: 'none',
      color: theme.colors.gray40,
      backgroundColor: theme.colors.gray20
    }
  },
  Notice: {
    gap: 10,
    borderRadius: 2,
    display: 'flex',
    marginBottom: 24,
    padding: '12px 16px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.primaryWarningRegular,
    border: `solid 1px ${theme.colors.primaryWarningRegular}`
  },
  InputText: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.14,
    color: theme.colors.gray40
  },
  InputWrapper: {
    gap: 8,
    justifyContent: 'space-between'
  },
  TextError: {
    color: 'red',
    marginTop: 4,
    zIndex: 9123123,
    fontSize: '0.8rem'
  },
  TextWrapper: {
    gap: 12,
    marginBottom: 40,
    color: theme.colors.gray80
  },
  FeesChangeWrapper: {
    gap: 12,
    marginBottom: (props: any) => (props.page === 3 ? 24 : 40)
  },
  NegativeArrow: {
    width: 29,
    height: 29,
    cursor: 'pointer',
    transform: 'rotate(180deg)',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/arrow/light_red.svg)'
  },
  Arrow: {
    width: 29,
    height: 29,
    cursor: 'pointer',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/arrow/light.svg)'
  },
  Step: {
    gap: 10,
    height: 26,
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 4,
    display: 'flex',
    lineHeight: 1.62,
    padding: '1px 6px',
    alignItems: 'center',
    justifyContent: 'center',
    color: (props: any) => {
      if (props.step === StepperSteps.CANCELED) {
        return theme.colors.gray80;
      }
      if (props.step === StepperSteps.EXPIRED) {
        return theme.colors.primaryError;
      }
      if (props.step === StepperSteps.UPDATED) {
        return theme.colors.white;
      }
      if (props.step === StepperSteps.EXECUTION) {
        return theme.colors.white;
      }
      return theme.colors.primaryBlue;
    },
    backgroundColor: (props: any) => {
      if (props.step === StepperSteps.CANCELED) {
        return theme.colors.gray20;
      }
      if (props.step === StepperSteps.EXPIRED) {
        return theme.colors.primaryErrorRegular;
      }
      if (props.step === StepperSteps.UPDATED) {
        return theme.colors.primaryBlue;
      }
      if (props.step === StepperSteps.EXECUTION) {
        return theme.colors.tint40;
      }
      return theme.colors.tint90;
    }
  },
  Title: {
    fontSize: 20,
    lineHeight: 1.4,
    fontWeight: 'bold',
    color: theme.colors.gray90
  },
  HeaderWrapper: {
    gap: 8
  },
  StepperWrapper: {
    padding: 0,
    marginBottom: 40
  },
  ChangeFeeText: {
    color: theme.colors.gray80
  }
}));
