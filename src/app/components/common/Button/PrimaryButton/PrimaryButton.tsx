import React from 'react';
import { observer } from 'mobx-react';
import Button from '@mui/material/Button';
import { useStores } from '~app/hooks/useStores';
import Spinner from '~app/components/common/Spinner';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { useStyles } from './PrimaryButton.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsLoading } from '~app/redux/appState.slice';
import AnchorTooltip from '~app/components/common/ToolTip/components/AnchorTooltip/AnchorTooltIp';

type Props = {
  children: string | JSX.Element;
  disable?: boolean;
  isLoading?: boolean;
  submitFunction: any;
  dataTestId?: string;
  wrapperClass?: string;
  errorButton?: boolean;
  withoutLoader?: boolean;
  withVerifyConnection?: boolean;
  tooltipText?: string;
  disableTooltipHoverListener?: boolean;
};

const PrimaryButton = (props: Props) => {
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;
  const {
    tooltipText,
    disableTooltipHoverListener,
    children,
    submitFunction,
    disable,
    wrapperClass,
    dataTestId,
    errorButton,
    withoutLoader,
    isLoading,
    withVerifyConnection,
  } = props;
  const classes = useStyles({ errorButton });
  const appStateIsLoading = useAppSelector(getIsLoading);

  // TODO: reduce to single component for wallet connection
  const submitHandler = async () => {
    // if (walletStore.isWrongNetwork) notificationsStore.showMessage('Please change network to Goerli', 'error');
    if (withVerifyConnection && !walletStore.wallet) {
      // await walletStore.connect();
    }
    await submitFunction();
  };

  const showLoaderCondition = appStateIsLoading || isLoading && !withoutLoader;
  const isLoadingClassCondition = appStateIsLoading || isLoading;
  const isDisabledCondition = disable || appStateIsLoading;

  return (
    <AnchorTooltip
      title={tooltipText}
      disableHoverListener={disableTooltipHoverListener}
      placement="top">
      <div>
        <Button
          type="submit"
          onClick={submitHandler}
          data-testid={dataTestId}
          disabled={isDisabledCondition}
          className={`${isLoadingClassCondition ? classes.Loading : classes.PrimaryButton} ${wrapperClass}`}
        >
          {showLoaderCondition && <Spinner errorSpinner={errorButton}/>}
          {children}
        </Button>
      </div>
    </AnchorTooltip>
  );
};

export default observer(PrimaryButton);
