import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  SubHeader: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray80,
    marginBottom: theme.spacing(5)
  },
  DropZone: {
    height: 254,
    borderRadius: 8,
    cursor: 'pointer',
    marginBottom: theme.spacing(5),
    backgroundColor: theme.colors.gray0,
    border: `solid 1px ${theme.colors.gray20}`
  },
  Input: {
    display: 'none'
  },
  FileImage: {
    width: 48,
    height: 48,
    margin: 'auto',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    marginTop: theme.spacing(20),
    marginBottom: theme.spacing(-4),
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/file/white.svg)'
  },
  Fail: {
    backgroundImage: 'url(/images/file/fail.svg)'
  },
  Success: {
    backgroundImage: 'url(/images/file/success.svg)'
  },
  FileText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: theme.colors.gray40
  },
  Remove: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    cursor: 'pointer',
    textDecoration: 'underline',
    color: theme.colors.primaryBlue,
    zIndex: theme.opacity.highPriority
  },
  ErrorText: {
    color: theme.colors.primaryError
  },
  SuccessText: {
    color: theme.colors.primarySuccessDark
  },
  ErrorWrapper: {
    marginBottom: theme.spacing(1)
  },
  SummaryWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 31
  },
  KeysharesSummaryTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.gray40
  },
  SummaryInfoFieldWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  SummaryText: {
    fontSize: 16,
    fontWeight: 500,
    color: theme.colors.gray90
  },
  OperatorsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5.69
  },
  KeysharesWrapper: {
    display: 'flex',
    justifyContent: 'center',
    gap: 24,
    alignItems: 'flex-start'
  },
  marginTop: {
    margin: 0,
    marginTop: (props: any) => (props.isSecondRegistration ? 50 : 90)
  },
  ErrorMessageText: {
    fontSize: 14,
    weight: 500
  }
}));
