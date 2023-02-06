import { Theme } from '@mui/material/styles';
import { makeStyles, createStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => createStyles({
    Root: {
        '& p, select, input': {
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 1.62,
            color: theme.colors.gray60,
        },
        textAlign: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: '20px 32px 32px 32px',
        backgroundColor: theme.colors.white,
        borderTop: `solid 1px ${theme.colors.gray20}`,
    },
    PageRangeText: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray60,
    },
    SelectFormWrapper: {
        marginRight: 24,
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
    ButtonsWrapper: {
        gap: 8,
        alignItems: 'center',
    },
    LeftArrows: {
        width: 36,
        height: 36,
        padding: 6,
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
        backgroundImage: (props: any) => {
            if (props.firstPage || theme.darkMode) {
                return 'url(/images/page_arrows/single/disable.svg)';
            } 
                return 'url(/images/page_arrows/single/black.svg)';
        },
    },
    SingleRight: {
        transform: 'scaleX(-1)',
        // cursor: (props: any) => props.lastPage ? 'auto' : 'pointer',
        backgroundImage: (props: any) => {
            if (props.lastPage || theme.darkMode) {
                return 'url(/images/page_arrows/single/disable.svg)';
            }
            return 'url(/images/page_arrows/single/black.svg)';
        },
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