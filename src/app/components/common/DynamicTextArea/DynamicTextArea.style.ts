import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Wrapper: {
        height: (props: any) => props.areaHeight,
        overflow: 'hidden',
        fontSize: 16,
        width: '100%',
        fontWeight: 500,
        borderRadius: 8,
        lineHeight: 1.62,
        color: theme.colors.black,
        paddingBottom: '1px',
        border: `solid 1px ${theme.colors.gray30}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    TextArea: {
        position: 'relative',
        fontSize: 16,
        width: '100%',
        fontWeight: 500,
        lineHeight: 1.62,
        resize: 'none',
        borderRadius: 8,
        color: theme.colors.black,
        border: 'none',
        padding: '10px 20px 10px 20px',
        '&:focus': {
            outline: 'none',
        },
    }, 
}));
