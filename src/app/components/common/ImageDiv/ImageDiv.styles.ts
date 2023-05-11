import { makeStyles } from '@mui/styles';
// import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles(() => ({
    Image: {
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: (props: any) => props.width ? props.width : '',
        height: (props: any) => props.height ? props.height : '',
        backgroundImage: (props: any) => `url(/images/${props.image}/light.svg)`,
    },
}));
