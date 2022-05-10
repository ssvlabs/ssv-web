import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    Wrapper: {
    },
    SubHeaderWrapper: {
        gap: 8,
        paddingBottom: 30,
    },
    BottomWrapper: {
        gap: 8,
        marginTop: 8,
        width: 1320,
        margin: 'auto',
        display: 'flex',
        '@media only screen and (max-width: 1400px)': {
            width: 646,
        },
    },
    TableWrapper: {
        '@media only screen and (max-width: 1400px)': {
            justifyContent: 'center',
        },
        gap: 24,
    },
    Table: {
        '@media only screen and (max-width: 1400px)': {
            // margin: 'auto',
        },
    },
}));