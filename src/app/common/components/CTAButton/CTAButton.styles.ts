import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
   button: {
       color: '#FFFFFF',
       height: '48px',
       background: '#5B6C84',
       borderRadius: '6px',
       width: '100%',
       '&:hover': {
           background: '#2A323E',
       },
   },
}));
