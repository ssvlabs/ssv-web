import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    ScreenWrapper: {
        width: '100%',
    },
    Loading: {
        color: theme.colors.tint20,
    },
    SearchIcon: {
        width: 24,
        height: 24,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/search/${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    SearchInputWrapper: {
        marginRight: theme.spacing(3),
    },

    OperatorsTable: {
        height: 480,
        borderRadius: 16,
        cursor: 'pointer',
        marginTop: theme.spacing(5),
        backgroundPosition: 'center',
        backgroundSize: '300px 100px',
        backgroundRepeat: 'no-repeat !important',
        border: `solid 1px ${theme.colors.gray20}`,
        // opacity: (props: any) => props.loading ? 0.5 : 1,
        pointerEvents: (props: any) => props.loading ? 'none' : 'auto',
    },
    HeaderWrapper: {
        cursor: 'pointer',
        alignItems: 'center',
    },
    SortArrow: {
        width: 16,
        height: 16,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/sort_arrow/arrows.svg)',
    },
    ArrowUp: {
        backgroundImage: 'url(/images/sort_arrow/ascending.svg)',
    },
    ArrowDown: {
        backgroundImage: 'url(/images/sort_arrow/descending.svg)',
    },
    NoRecordsWrapper: {
        paddingTop: 0,
        '&:hover': {
            backgroundColor: theme.colors.white,
        },
    },
    NoRecordImage: {
        width: 100,
        height: 100,
        margin: 'auto',
        marginTop: 157,
        marginBottom: 40,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/logo/gray.svg)',
    },
    NoRecordsText: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        textAlign: 'center',
        '&:nth-child(2)': {
            fontWeight: 'bold',
            color: theme.colors.black,
        },
        '&:nth-child(3)': {
            color: theme.colors.gray40,
            marginBottom: 131,
        },
    },
    RowWrapper: {
        '&:hover': {
            backgroundColor: 'rgba(220, 224, 232, 0.25)',
        },
    },
    Selected: {
        '&:hover': {
            backgroundColor: theme.colors.tint90,
        },
        backgroundColor: theme.colors.tint90,
    },
    RowDisabled: {
        '& *': {
            color: theme.colors.gray60,
        },
        backgroundColor: theme.colors.gray10,
        '&:hover': {
            backgroundColor: theme.colors.gray10,
        },
    },
    Checkbox: {
        width: 24,
        height: 24,
        marginLeft: 20,
        marginRight: 20,
        // borderRadius: 8,
        cursor: 'pointer',
        backgroundColor: theme.colors.white,
        border: `1px solid ${theme.colors.gray40}`,
    },
    Hint: {
      width: 10,
      height: 10,
    },
    Checked: {
        width: 24,
        height: 24,
        border: 'none',
        backgroundImage: `url(/images/checkbox/${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    ChartIcon: {
        width: 24,
        height: 24,
        float: 'right',
        marginRight: 20,
        cursor: 'pointer',
        alignContent: 'flex-end',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/chart/gray.svg)',
    },
}));
