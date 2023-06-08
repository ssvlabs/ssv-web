import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import screenSizes from '~lib/utils/screenSizes';

export const useStyles = makeStyles((theme: Theme) => ({
    Header: {
        fontSize: 20,
        lineHeight: 1.4,
        fontWeight: 'bold',
        color: theme.colors.gray90,
        marginBottom: theme.spacing(3),
    },
    SubHeader: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
        marginBottom: theme.spacing(10),
    },
    Image: {
        height: 195,
        width: '100%',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/generateValidatorKeyShare/image.svg)',
    },
    LinkButtonsWrapper: {
        justify: 'space-evenly',
        width: '100%',
        [screenSizes.xs]: {
            flexDirection: 'column',
        },
    },
    UnderButtonText: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.62,
        textAlign: 'center',
        color: theme.colors.gray40,
        marginTop: theme.spacing(2),
    },
    LinkButtonWrapper: {
        width: (props: { networkId: number }) => props.networkId === 1 ? '100%' : 280,
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        '&:nth-of-type(1)': {
            marginRight: '20px',
        },
        [screenSizes.xs]: {
            width: '100%',
            '&:nth-of-type(1)': {
                marginBottom: '20px',
            },
        },
        [screenSizes.md]: {
            width: 182,
        },
    },
}));