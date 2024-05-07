import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import CheckBox from '~app/components/common/CheckBox';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { useStyles } from '~app/components/common/Button/Button.styles';
import { toWei } from '~root/services/conversions.service';
import { setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import notifyService from '~root/services/notify.service';
import Spinner from '~app/components/common/Spinner';
import { getAccountAddress } from '~app/redux/wallet.slice';

type ButtonParams = {
    text: string,
    disable: boolean,
    onClick?: any,
    testId?: string,
    errorButton?: boolean,
    withAllowance?: boolean,
    checkboxText?: string | null,
    checkBoxCallBack?: (() => void) | null,
    isCheckboxChecked?: boolean,
    isLoading?: boolean,
    totalAmount?: string,
    allowanceApprovedCB?: () => void
};

const Button = ({ testId, withAllowance, disable, onClick, text, errorButton, checkboxText, checkBoxCallBack, isCheckboxChecked, totalAmount, isLoading, allowanceApprovedCB }: ButtonParams) => {
    const [hasCheckedAllowance, setHasCheckedAllowance] = useState(false);
    const [hasToRequestApproval, setHasToRequestApproval] = useState(false);
    const [hasGotAllowanceApproval, setHasGotAllowanceApproval] = useState(false);
    const [approveButtonText, setApproveButtonText] = useState('Approve SSV');
    const [allowanceButtonDisable, setAllowanceButtonDisable] = useState(false);
    const dispatch = useAppDispatch();
    const accountAddress = useAppSelector(getAccountAddress);
    const classes = useStyles();
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;

    useEffect(() => {
        const checkUserAllowance = async () => {
            await ssvStore.checkAllowance();
            if (ssvStore.approvedAllowance < Number(toWei(totalAmount))) {
                setHasToRequestApproval(true);
                setHasGotAllowanceApproval(false);
            } else {
                setHasToRequestApproval(false);
            }
            setHasCheckedAllowance(true);
        };
        if (withAllowance) {
            checkUserAllowance();
        } else {
            setHasCheckedAllowance(true);
        }
    }, [totalAmount]);

    const handlePendingTransaction = ({ txHash }: { txHash: string }) => {
        dispatch(setTxHash(txHash));
        dispatch(setIsShowTxPendingPopup(true));
        notifyService.hash(txHash);
    };

    const requestAllowance = async () => {
        try {
            setAllowanceButtonDisable(true);
            setApproveButtonText('Approving…');
            await ssvStore.requestAllowance(handlePendingTransaction);
            setApproveButtonText('Approved');
            setHasGotAllowanceApproval(true);
            allowanceApprovedCB && allowanceApprovedCB();
        } catch (e) {
            console.error('Error while approving allowance', e);
            setApproveButtonText('Approve SSV');
        } finally {
            setAllowanceButtonDisable(false);
            dispatch(setIsShowTxPendingPopup(false));
        }
    };

    const regularButton = () => {
        return (
          <PrimaryButton
            disable={disable}
            dataTestId={testId}
            errorButton={errorButton}
            isLoading={isLoading}
            submitFunction={onClick ? onClick : () => {}}
            children={!!accountAddress ? text : translations.CTA_BUTTON.CONNECT}
          />
        );
    };

    const userNeedApproval = () => {
        return (
          <Grid item container>
            <Grid item xs className={classes.ButtonWrapper}>
              <PrimaryButton
                dataTestId={testId}
                children={approveButtonText}
                withoutLoader={hasGotAllowanceApproval}
                disable={hasGotAllowanceApproval || disable}
                submitFunction={() => { !allowanceButtonDisable && requestAllowance(); }}
              />
            </Grid>
            <Grid item xs>
              <PrimaryButton
                dataTestId={testId}
                disable={!hasGotAllowanceApproval || disable}
                submitFunction={onClick ? onClick : () => {}}
                children={!!accountAddress ? text : translations.CTA_BUTTON.CONNECT}
              />
            </Grid>
            <Grid container item xs={12}>
              <Grid item container className={classes.ProgressStepsWrapper}>
                <Grid item className={`${classes.Step} ${classes.Current} ${hasGotAllowanceApproval ? classes.Finish : ''}`}>
                  {!hasGotAllowanceApproval && <Typography className={classes.StepText}>1</Typography>}
                </Grid>
                <Grid item xs className={`${classes.Line} ${hasGotAllowanceApproval ? classes.Finish : ''}`} />
                <Grid item className={`${classes.Step} ${hasGotAllowanceApproval ? classes.Current : ''}`}>
                  <Typography className={classes.StepText}>2</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
    };

    if (!hasCheckedAllowance) {
        return <Grid alignContent="center" justifyContent="center"><Spinner size={35} /></Grid>;
    }

    return (
      <Grid container>
        {checkboxText && checkBoxCallBack && (
          <Grid item xs={12}>
              <CheckBox toggleIsChecked={checkBoxCallBack} text={checkboxText} isChecked={isCheckboxChecked} />
          </Grid>
        )}
        {hasToRequestApproval ? userNeedApproval() : regularButton()}
      </Grid>
    );
};

export default observer(Button);
