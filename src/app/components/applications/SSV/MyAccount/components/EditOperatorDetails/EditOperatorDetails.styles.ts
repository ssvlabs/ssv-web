import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => {
    return {
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
    };
});
