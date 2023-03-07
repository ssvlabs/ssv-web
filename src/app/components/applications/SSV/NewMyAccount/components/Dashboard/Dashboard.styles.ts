import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  HeadersWrapper: {
    height: 65,
    width: 1320,
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'space-between',
    padding: '22px 182px 23px 32px',
    backgroundColor: theme.colors.gray0,
    borderBottom: `solid 1px ${theme.colors.gray20}`,
  },
  TableContainer: {
    overflowX: 'unset',
    opacity: (props: any) => props.loading ? 0.7 : 1,
    pointerEvents: (props: any) => props.isLoading ? 'none' : 'auto',
  },
  HeaderColumn: {
    verticalAlign: 'bottom',
    paddingBottom: (props: any) => props.headerPadding ?? '',
  },
  BodyColumn: {
    verticalAlign: 'middle',
  },
  BigBox: {
    gap: 68,
    width: 1320,
    backgroundColor: theme.colors.squareScreenBackground,
  },
  NoValidatorImage: {
    width: 120,
    height: 120,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    margin: '74px auto 0px auto',
    backgroundImage: 'url(/images/logo/no_validators.svg)',
  },
  NoValidatorText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    marginBottom: 160,
    textAlign: 'center',
    color: theme.colors.gray80,
  },
  HeaderColor: {
    backgroundColor: (props: any) => props.header ? theme.colors.white : theme.colors.gray0,
  },
  TableWrapper: {
    width: 1320,
  },
  Arrow: {
    width: 24,
    height: 27,
    float: 'right',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/view_arrow/light.svg)',
  },
  BodyRowWrapper: {
    gap: 124,
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '16px 0 16px 32px',
    justifyContent: 'space-between',
    borderBottom: `solid 1px ${theme.colors.gray20}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  ToolTipWrapper: {
    gap: 4,
    display: 'flex',
    alignItems: 'center',
  },
  BodyWrapper: {
    width: 1320,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: theme.colors.white,
  },
  Header: {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray40,
  },
}));
