import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    ToggleWrapper: {
        cursor: 'pointer',
    },
    OptionsWrapper: {
        zIndex: 999,
        position: 'absolute',
    },
    Icon: {
        width: 20,
        height: 20,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/link_icon/link_icon_${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    Options: {
        right: -20,
        width: 240,
        display: 'flex',
        borderRadius: 8,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.white,
        boxShadow: '0 12px 40px 0 #0116271e',
        border: `solid 1px ${theme.colors.gray10}`,
    },
    OptionLabel: {
        fontSize: '14px !important',
        fontWeight: '600 !important',
        lineHeight: '1.25 !important',
        color: `${theme.darkMode ? theme.colors.gray60 : theme.colors.gray80} !important`,
    },
    Button: {
        gap: 12,
        padding: 16,
        flexGrow: 0,
        display: 'flex',
        cursor: 'pointer',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottom: (props: any) => props.bottomLine ? `solid 1px ${theme.colors.gray20}` : 'none',
        '&:hover': {
            backgroundColor: theme.colors.gray10,
        },
        '& p': {
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.14,
            color: theme.colors.gray90,
        },
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    DotsGroup: {
        width: 24,
        height: 24,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/dots/dots_${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    DotsGroupWrapper: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        color: theme.colors.gray80,
    },
    SocialNetworksWrapper: {
            gap: 12,
            padding: 16,
            flexGrow: 0,
            display: 'flex',
            cursor: 'pointer',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
    },
    SocialNetworkLogo: {
        width: 28,
        height: 28,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: (props: any) => `url(/images/socialNetworks/${props.logo}_${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
}));
