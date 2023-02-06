import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    TableWrapper: {
        borderRadius: 16,
        backgroundColor: theme.colors.white,
    },
    CustomizeCss: {
        '& table': {
            border: 0,
            borderSpacing: 0,
            '& thead': {
                '& tr': {
                    '&:first-child': {
                        '& th': {
                            height: 28,
                            borderBottom: 'none',
                            padding: '32px 32px 20px 32px',
                            '& p': {
                                fontSize: 20,
                                lineHeight: 1.4,
                                textAlign: 'left',
                                fontWeight: 'bold',
                                color: theme.colors.gray40,
                            },
                        },
                    },
                    '&:last-child': {
                        '& th': {
                            padding: 8,
                            fontSize: 12,
                            border: 'none',
                            fontWeight: 500,
                            lineHeight: 1.62,
                            textAlign: 'left',
                            letterSpacing: 'normal',
                            color: theme.colors.gray40,
                            borderBottom: `1px solid ${theme.colors.gray20}`,

                            '&:first-child': {
                                paddingLeft: 32,
                            },

                            '&:last-child': {
                                paddingRight: 32,
                            },
                        },
                    },
                },
            },

            '& tbody': {
                '& tr': {
                    '& td': {
                        height: 72,
                        border: 'none',
                        verticalAlign: 'top',
                        padding: '12px 8px 12px 8px',
                        borderBottom: `1px solid ${theme.colors.gray20}`,
                        '&:first-child': {
                            paddingLeft: 32,
                        },
                        '&:last-child': {
                            paddingRight: 32,
                        },
                    },
                    '&:last-child': {
                        '& td': {
                            borderBottom: 'none',
                        },
                    },
                },
            },

            '& tfoot': {
                '& div': {
                    width: '100%',
                },
                // fontWeight: 'bolder',
            },
        },
    },
    ActionsWrapper: {

    },
}));