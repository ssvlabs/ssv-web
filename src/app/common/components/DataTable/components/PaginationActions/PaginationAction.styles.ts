import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => createStyles({
    Root: {
        padding: 32,
    },
    PageRangeText: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray60,
    },
    SelectFormWrapper: {
        '& select': {
            width: 64,
            height: 36,
            marginLeft: 8,
            borderRadius: 8,
            padding: '4px 4px 4px 8px',
            backgroundColor: theme.colors.white,
            border: `solid 1px ${theme.colors.gray30}`,
        },
        alignItems: 'center',
    },
    Arrows: {
        width: 100,
        height: 100,
        transform: 'scaleX(-1)',
        background: 'red',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/page_arrows/last_page/left_light.svg)',
    },
}));