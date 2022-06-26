import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    OperatorType: {
        width: 16,
        height: 16,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: (props: any) => {
            if (props.isVerified) {
                return 'url(/images/operator_type/verified.svg)';
            }
            if (props.isDappNode) {
                return 'url(/images/operator_type/dappnode.svg)';
            }
            return '';
        },
    },
}));
