import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => createStyles({
    Root: {
        '& p, select, input': {
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 1.62,
            color: theme.colors.gray60,
        },
        textAlign: 'center',
        alignItems: 'center',
        padding: '20px 32px 32px 32px',
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
    LeftArrows: {
        width: 36,
        height: 36,
        padding: 6,
        borderRadius: 8,
        cursor: (props: any) => props.firstPage ? 'normal' : 'pointer',
        backgroundColor: (props: any) => props.firstPage ? theme.colors.gray10 : theme.colors.white,
        border: (props: any) => `solid 1px ${props.firstPage ? theme.colors.gray20 : theme.colors.gray30}`,
        '& div': {
            width: 24,
            height: 24,
            border: 'none',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        },
    },
    RightArrows: {
        width: 36,
        height: 36,
        padding: 6,
        borderRadius: 8,
        cursor: (props: any) => props.lastPage ? 'normal' : 'pointer',
        backgroundColor: (props: any) => props.lastPage ? theme.colors.gray10 : theme.colors.white,
        // eslint-disable-next-line no-nested-ternary
        border: (props: any) => `solid 1px ${props.lastPage ? theme.colors.gray20 : theme.colors.gray30}`,
        '& div': {
            width: 24,
            height: 24,
            border: 'none',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        },
    },
    SingleLeft: {
        // cursor: (props: any) => props.firstPage ? 'auto' : 'pointer',
        backgroundImage: (props: any) => props.firstPage ? 'url(/images/page_arrows/single/disable.svg)' : 'url(/images/page_arrows/single/black.svg)',
    },
    ManyLeft: {
        // cursor: (props: any) => props.firstPage ? 'auto' : 'pointer',
        backgroundImage: (props: any) => props.firstPage ? 'url(/images/page_arrows/many/disable.svg)' : 'url(/images/page_arrows/many/black.svg)',
    },
    SingleRight: {
        transform: 'scaleX(-1)',
        // cursor: (props: any) => props.lastPage ? 'auto' : 'pointer',
        backgroundImage: (props: any) => props.lastPage ? 'url(/images/page_arrows/single/disable.svg)' : 'url(/images/page_arrows/single/black.svg)',
    },
    ManyRight: {
        transform: 'scaleX(-1)',
        cursor: (props: any) => props.lastPage ? 'auto' : 'pointer',
        backgroundImage: (props: any) => props.lastPage ? 'url(/images/page_arrows/many/disable.svg)' : 'url(/images/page_arrows/many/black.svg)',
    },
    PageWrapper: {
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    PageNumber: {
        width: 54,
        height: 36,
        marginRight: 8,
        borderRadius: 8,
        backgroundColor: theme.colors.white,
        border: `solid 1px ${theme.colors.gray30}`,
        '& input': {
            padding: '0',
            height: '100%',
            borderRadius: 8,
            '&:focus': {
                border: 'none',
            },
        },
    },
    PageEditor: {
        textAlign: 'center',
        backgroundColor: theme.colors.white,
    },
}));