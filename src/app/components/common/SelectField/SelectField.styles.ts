import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => {
    return {
        SelectExtendClass: {
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                fontSize: 16,
                borderRadius: 8,
                borderColor: `${theme.colors.gray30}`,
                margin: 0,
            },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-input': {
                fontSize: 16,
                width: '100%',
                padding: '12px 20px',
                lineHeight: 1.62,
                border: 'none !important',
                color: theme.colors.gray90,
                backgroundColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: `${theme.colors.gray30}`,
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: `${theme.colors.gray30}`,
            },
        },
    };
});
