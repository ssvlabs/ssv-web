import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  OperatorBox: {
    width: 312,
    height: 188,
    borderRadius: 16,
    backgroundColor: (props: any) => props.isDeleted ? '#f8fcff' : theme.colors.squareScreenBackground,
  },
  FirstSectionOperatorBox: {
    padding: '24px 24px 15px',
    borderBottom: `1px solid ${theme.colors.gray20}`,
  },
  SecondSectionOperatorBox: {
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray40,
    padding: '16px 22px 15px 24px',
  },
  ColumnWrapper: {
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
  },
  BoldText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray90,
  },
}));