import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    DialogWrapper: {
        padding: 32,
        alignItems: 'center',
        backgroundColor: theme.colors.white,
    },
    Loader: {
        height: 100,
        margin: 'auto',
    },
    ProductQuestionsWrapper: {
        marginTop: 24,
    },
    SubHeaderWrapper: {
        gap: 8,
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        paddingBottom: 30,
        color: theme.colors.gray80,
    },
    TextFieldWrapper: {
        marginBottom: 24,
    },
    ButtonsWrapper: {
      gap: 24,
    },
}));