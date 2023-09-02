import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

type WarningBoxStylesProps = {
  width: number | undefined,
  height: number | undefined,
};

export const useStyles = makeStyles((theme: Theme) => ({
  Wrapper: {
    gap: 10,
    fontSize: 14,
    borderRadius: 2,
    fontWeight: 500,
    lineHeight: 1.62,
    padding: '12px 16px',
    alignItems: 'center',
    color: theme.colors.gray90,
    justifyContent: 'flex-start',
    border: `solid 1px ${theme.colors.warning}`,
    margin: 'auto',
    backgroundColor: theme.colors.primaryWarningRegular,
    width: (props: WarningBoxStylesProps) => props?.width && props.width,
    height: (props: WarningBoxStylesProps) => props?.height ? props.height : 47,
  },
}));
