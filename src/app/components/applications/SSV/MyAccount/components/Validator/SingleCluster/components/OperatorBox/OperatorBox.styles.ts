import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  OperatorBox: {
    width: 312,
    height: 188,
    borderRadius: 16,
    border: `1px solid ${theme.colors.primaryBlue}`,
    backgroundColor: (props: any) => props.isDeleted ? theme.colors.squareScreenBackgroundDeleted : theme.colors.squareScreenBackground,
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
  YearlyFeeWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  UpdateFeeIndicator: {
    width: 8,
    height: 8,
    marginLeft: 5,
    borderRadius: '50%',
    backgroundColor: theme.colors.primaryBlue,
  },
  PopUpWrapper: {
    top: 190,
    left: 210,
    width: 610,
    height: 691,
    zIndex: '99999',
    borderRadius: 16,
    position:  'absolute',
    backgroundColor: '#fdfefe',
    boxShadow: '0 4px 27px 0 rgba(0, 0, 0, 0.1)',
  },
}));