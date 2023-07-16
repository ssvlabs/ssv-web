import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => {
    return {
        PlaceholderColor: {
            color: theme.colors.gray30,
        },
        marginBottom: {
            marginBottom: 32,
        },
        bodyWrapperClass: {
           gap: 24,
           marginBottom: 40,
        },
        sectionWrapperClass: {
          padding: '12px 43px 0px 43px',
        },
        DescriptionInput: {
            height: 75,
            alignItems: 'center',
            textWrap: true,
        },
        TextArea: {
            resize:'none',
            borderRadius: 8,
            borderColor: theme.colors.gray30,
            display: 'flex',
            alignItems: 'center',
        },
        fontSmallSize: {
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            '&::placeholder': { color: theme.colors.gray30 },
        },
        FileText: {
            margin: '12px 20px',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.62,
            overflow: 'hidden',
            // textAlign: 'center',
            textOverflow: 'ellipsis',
            color: theme.colors.gray40,
        },
        DropFileInput: {
            height: '50px !important',
            marginBottom: '0 !important',
            borderColor: `${theme.colors.gray30} !important`,
            backgroundColor: `${theme.colors.white} !important`,
        },
        RemoveIcon: {
            width: 16,
            height: 16,
            marginLeft: 16,
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(/images/x/${theme.darkMode ? 'light' : 'black'}.svg)`,
        },
        ImageName: {
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            margin: '12px 20px',
            alignItems: 'center',
            color: theme.colors.gray100,
        },
        ErrorMessage: {
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            margin: '5px 5px',
            alignItems: 'center',
            color: theme.colors.primaryError,
        },
        ImageErrorMessage: {
            fontSize: 16,
            fontWeight: 600,
            display: 'flex',
            margin: '12px 20px',
            alignItems: 'center',
            color: theme.colors.primaryError,
        },
        AutocompleteInput: {
            width: '100%',
                '& .MuiAutocomplete-inputRoot': {
                    padding: 5,
                    borderRadius: 8,
                    borderColor: `${theme.colors.gray30} !important`,
                },
        },
        AutocompleteInner: {
            '& .MuiInputBase-root': {
                '& .MuiInputBase-input': {
                    color: theme.colors.gray100,
                    marginLeft: 14,
                    fontSize: '16px',
                    border: 'none',
                    '&::placeholder': { color: theme.colors.gray40 },
                },
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.colors.gray30,
            },
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.colors.gray30,
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.colors.gray30,
            },

        },
        ConfirmationBox: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        ConfirmationWrapper: {
            width: 635,
            height: 245,
            borderRadius: 16,
            position: 'relative',
            backgroundColor: theme.colors.white,
            padding: '37px 32px 32px 32px',
        },
        BackgroundImage: {
            top: 0,
            zIndex: 0,
            width: 248,
            height: 248,
            right: -44,
            position: 'absolute',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundImage: 'url(/images/backgroundIcon/light.svg)',
        },
        ButtonGroup: {
            marginTop: 40,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
        },
        buttonWidth: {
            width: '280px',
        },
    };
});
