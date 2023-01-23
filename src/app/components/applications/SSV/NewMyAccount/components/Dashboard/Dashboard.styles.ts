import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  HeadersWrapper: {
    height: 65,
    width: 1320,
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'space-between',
    padding: '23px 442.5px 23px 31.5px',
    backgroundColor: theme.colors.gray0,
    borderBottom: `solid 1px ${theme.colors.gray20}`,
  },
  SingleItemArrow: {

  },
  BodyRowWrapper: {
    gap: 124,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '16px 0 16px 32px',
    justifyContent: 'flex-start',
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
