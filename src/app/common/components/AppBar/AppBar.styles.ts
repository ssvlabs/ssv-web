import { makeStyles } from '@material-ui/core/styles';
import screenSizes from '~lib/utils/screenSizes';

export const useStyles = makeStyles((theme) => ({
    AppBarWrapper: {
        height: 80,
        padding: theme.spacing(4, 0, 4, 6),
        alignItems: 'center',
    },
    AppBarIcon: {
        height: 48,
        width: 160.2,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/logo/${theme.darkMode ? 'light' : 'dark'}.svg)`,

    },
    SmallLogo: {
        height: 40,
        width: 28.5,
        backgroundImage: `url(/images/logo/${theme.darkMode ? 'small_light' : 'small_light'}.svg)`,
    },
    Linkbuttons: {
        margin: 'auto',
        width: 'fit-content',
    },
    Wrapper: {
        '@media (max-width: 1200px)': {
            marginLeft: 'auto',
        },

    },
    Hamburger: {
        width: 24,
        height: 24,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        margin: theme.spacing(0, 6, 0, 6),
        backgroundImage: `url(/images/hamburger/${theme.darkMode ? 'light' : 'light'}.svg)`,
    },
    MobileMenuBar: {
        top: 80,
        right: 0,
        width: 272,
        borderRadius: 16,
        position: 'absolute',
        marginRight: theme.spacing(4),
        zIndex: theme.opacity.highPriority,
        backgroundColor: theme.colors.white,
        border: `solid 1px ${theme.colors.gray10}`,
        boxShadow: '0 12px 40px 0 rgba(1, 22, 39, 0.12)',
        [screenSizes.xs]: {
            width: '100%',
            marginRight: 0,
            borderRadius: 0,
        },
    },
    MenuButton: {
        gap: 10,
        width: 240,
        height: 56,
        fontSize: 16,
        borderRadius: 8,
        fontWeight: 600,
        lineHeight: 1.25,
        cursor: 'pointer',
        alignItems: 'center',
        color: theme.colors.gray90,
        padding: theme.spacing(4, 6),
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
        justifyContent: 'flex-start',
        '-webkit-tap-highlight-color': 'transparent',
        '&:nth-of-type(1)': {
            color: theme.colors.primaryBlue,
        },
        '&:nth-of-type(2)': {
            position: !theme.newStage ? 'relative' : '',
            '&:hover': {
                '&::after': !theme.newStage ? {
                    left: 20,
                    width: 150,
                    padding: 10,
                    borderRadius: 8,
                    display: 'block',
                    position: 'absolute',
                    color: theme.colors.white,
                    content: '"comming soon..."',
                    backgroundColor: theme.colors.primaryBlue,
                } : {},
                color: theme.colors.primaryBlue,
            },
        },
        '&:first-child': {
            margin: theme.spacing(4, 4, 0),
        },
        '&:last-child': {
            margin: theme.spacing(0, 4, 4, 4),
        },
    },
    RemoveBlue: {
        color: `${theme.colors.gray90} !important`,
    },
    UnderLine: {
        height: 1,
        width: '100%',
        margin: theme.spacing(4, 0, 4),
        border: `solid 1px ${theme.colors.gray20}`,
    },
    Slider: {
        padding: theme.spacing(4, 4),
    },
    LinkButton: {
        width: 144,
        height: 48,
        fontSize: 16,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 600,
        lineHeight: 1.25,
        cursor: 'pointer',
        textAlign: 'center',
        marginLeft: theme.spacing(10),
        color: theme.colors.black,
        '&:nth-of-type(1)': {
            color: theme.colors.primaryBlue,
        },
        '&:nth-of-type(2)': {
            // width: 144,
            // marginRight: theme.spacing(5),
            position: !theme.newStage ? 'relative' : '',
            '&:hover': {
                color: theme.colors.primaryBlue,
                '&::after': !theme.newStage ? {
                    left: 20,
                    width: 150,
                    padding: 10,
                    borderRadius: 8,
                    display: 'block',
                    position: 'absolute',
                    color: theme.colors.white,
                    content: '"comming soon..."',
                    backgroundColor: theme.colors.primaryBlue,
                } : {},
            },
        },
    },
}));
