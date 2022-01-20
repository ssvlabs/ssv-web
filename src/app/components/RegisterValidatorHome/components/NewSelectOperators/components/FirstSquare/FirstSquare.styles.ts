import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    ScreenWrapper: {
        width: '100%',
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
        maxHeight: 530,
        borderRadius: 16,
        marginTop: theme.spacing(5),
        border: `solid 1px ${theme.colors.gray20}`,
    },
    HeaderWrapper: {
        alignItems: 'center',
    },
    SortArrow: {
        width: 16,
        height: 16,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/sort_arrow/not_clicked.svg)',
    },
    SelectedSort: {
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
    Checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        cursor: 'pointer',
        marginLeft: 20,
        backgroundColor: theme.colors.gray10,
        border: `1px solid ${theme.colors.gray40}`,
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
