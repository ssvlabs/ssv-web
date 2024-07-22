import { makeStyles } from '@mui/styles';
import screenSizes from '~lib/utils/screenSizes';

// @ts-ignore
export const useStyles = makeStyles((theme: any) => ({
    AppBarWrapper: {
        height: 80,
        alignItems: 'center',
        padding: theme.spacing(0, 6, 0, 6),
        backgroundColor: theme.colors.white,
    },
    AppBarIcon: {
        height: 40,
        width: 133.5,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/logo/${theme.darkMode ? 'dsrv-master-light' : 'dsrv-master-dark'}.svg)`,
        '@media only screen and (max-width: 500px)': {
            height: 40,
            width: 28.5,
            backgroundImage: `url(/images/logo/${theme.darkMode ? 'dsrv-favicon-dark-circle' : 'dsrv-favicon-light-circle'}.svg)`,
        },

    },
    GridItem: {

    },
    Button: {
        height: 80,
        fontSize: 16,
        fontWeight: 500,
        display: 'flex',
        lineHeight: 1.62,
        cursor: 'pointer',
        alignItems: 'center',
        color: theme.colors.gray80,
        '@media only screen and (max-width: 768px)': {
            display: 'none',
        },
    },
    DarkModeWrapper: {
        '@media only screen and (max-width: 768px)': {
           display: 'none',
        },
    },

    /// delete
    SmallLogo: {
        height: 40,
        width: 28.5,
        backgroundImage: `url(/images/logo/${theme.darkMode ? 'small_light' : 'small_light'}.svg)`,
    },
    Linkbuttons: {
        margin: 'auto',
        width: 'fit-content',
        display: (props: any) => props.isDistribution ? 'none' : '',
    },
    Wrapper: {
        // marginLeft: (props: any) => props.isDistribution ? 'auto' : '',
        // '@media (max-width: 1200px)': {
        //     marginLeft: 'auto',
        // },
    },
    /// delete

    Hamburger: {
        width: 24,
        height: 24,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        margin: theme.spacing(0, 6, 0, 6),
        backgroundImage: `url(/images/hamburger/${theme.darkMode ? 'dark' : 'light'}.svg)`,
        '@media only screen and (min-width: 769px)': {
            display: 'none',
        },
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
    BlueLink: {
        borderBottom: `2px solid ${theme.colors.primaryBlue} !important`,
    },
    MenuButton: {
        gap: 10,
        height: 56,
        fontSize: 16,
        minWidth: 240,
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
        // '&:nth-of-type(1)': {
        //     position: !theme.newStage ? 'relative' : '',
        //     '&:hover': {
        //         color: theme.colors.primaryBlue,
        //         '&::after': !theme.newStage ? {
        //             left: 20,
        //             width: 150,
        //             padding: 10,
        //             borderRadius: 8,
        //             display: 'block',
        //             position: 'absolute',
        //             color: theme.colors.white,
        //             content: '"Coming Soon..."',
        //             backgroundColor: theme.colors.primaryBlue,
        //         } : {},
        //     },
        // },
        '&:first-child': {
            margin: theme.spacing(4, 4, 0),
        },
        '&:last-child': {
            margin: theme.spacing(0, 4, 4, 4),
        },
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
        fontWeight: 600,
        lineHeight: 1.25,
        cursor: 'pointer',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.black,
        marginLeft: theme.spacing(10),
    },
}));
