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
  HeaderColor: {
    backgroundColor: (props: any) => props.header ? theme.colors.white : theme.colors.gray0,
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
