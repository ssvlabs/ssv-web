import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import Checkbox from '~app/components/common/CheckBox/CheckBox';
import { getClusterHash } from '~root/services/cluster.service';
import { validatorsByClusterHash } from '~root/services/validator.service';
import { BulkValidatorData, IValidator } from '~app/model/validator.model';
import { formatValidatorPublicKey, longStringShorten } from '~lib/utils/strings';
import { ProcessStore, WalletStore } from '~app/common/stores/applications/SsvWeb';
import { getBeaconChainLink } from '~root/providers/networkInfo.provider';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getIsDarkMode } from '~app/redux/appState.slice';
import { SingleCluster } from '~app/model/processes.model';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '~app/components/common/Spinner';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';

const TableWrapper = styled.div`
    margin-top: 12px;
    width: 808px;
    max-height: 600px;
    border: ${({ theme }) => `1px solid ${theme.colors.gray30}`};
    border-radius: 8px;
    overflow: auto;
`;

const TableHeader = styled.div`
    height: 52px;
    padding: 13px 32px;
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.gray20}`};
    display: flex;
    align-items: center;
`;

const TableHeaderTitle = styled.h6<{ theme: any, marginLeft?: number }>`
    margin: 0;
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray40};
    margin-left: ${({ marginLeft }) => `${marginLeft}px`};
`;

const ValidatorsListWrapper = styled.div`
    overflow-y: auto;
`;

const ValidatorWrapper = styled.div`
    height: 58px;
    border: ${({ theme }) => `1px solid ${theme.colors.gray20}`};
    padding: 14px 32px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const PublicKeyWrapper = styled.div`
    width: 33%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`;

const PublicKey = styled.p<{ marginLeft?: number }>`
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray90};
    margin-left: ${({ marginLeft }) => `${marginLeft}px`};
    display: flex;
    gap: 20px
`;

const LinksWrapper = styled.div`
    width: 33%;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 8px;
`;

const Link = styled.div<{ isDarkMode: boolean; logo: string }>`
    width: 24px;
    height: 24px;
    cursor: pointer;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: ${({ isDarkMode, logo }) => `url(${logo}${isDarkMode ? 'dark.svg' : 'light.svg'})`}
}
`;

const SpinnerWrapper = styled.div`
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ValidatorsList = ({
                          onCheckboxClickHandler,
                          selectedValidators,
                          fillSelectedValidators,
                          maxValidatorsCount,
                          checkboxTooltipTitle,
                          setIsLoading,
                          isLoading,
                        }: {
  onCheckboxClickHandler?: Function,
  selectedValidators?: Record<string, BulkValidatorData>,
  fillSelectedValidators?: Function
  maxValidatorsCount?: number
  checkboxTooltipTitle?: JSX.Element | string
  setIsLoading?: Function;
  isLoading?: boolean;
}) => {
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const process: SingleCluster = processStore.getProcess;
  const cluster = process?.item;
  const selectValidatorDisableCondition = Object.values(selectedValidators || {}).filter((validator: BulkValidatorData) => validator.isSelected).length === maxValidatorsCount;
  const navigate = useNavigate();
  const isDarkMode = useAppSelector(getIsDarkMode);
  const [clusterValidators, setClusterValidators] = useState<IValidator[]>([]);
  const [clusterValidatorsPagination, setClusterValidatorsPagination] = useState({
    page: 1,
    total: cluster.validatorCount,
    pages: 1,
    per_page: 5,
    rowsPerPage: 14,
    onChangePage: console.log,
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!cluster) return navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
    if (selectedValidators && Object.values(selectedValidators).length) {
      setClusterValidators(Object.values(selectedValidators).map((validator: {
        validator: IValidator,
        isSelected: boolean
      }) => validator.validator));
    } else {
      validatorsByClusterHash(1, getClusterHash(cluster.operators, walletStore.accountAddress), clusterValidatorsPagination.rowsPerPage).then((response: any) => {
        setClusterValidators(response.validators);
        if (fillSelectedValidators) fillSelectedValidators(response.validators);
        setClusterValidatorsPagination({ ...response.pagination, rowsPerPage: cluster.validatorCount });
      });
    }
  }, []);

  const onChangePage = async (selectAll?: boolean) => {
    if (selectAll && fillSelectedValidators && maxValidatorsCount && (clusterValidators.length >= maxValidatorsCount || clusterValidators.length >= clusterValidatorsPagination.total)) {
      fillSelectedValidators(clusterValidators, true);
      setIsLoading && setIsLoading(false);
      return;
    }
    let arraySize = clusterValidators.length;
    let nextPage = clusterValidatorsPagination.page + 1;
    let validators = clusterValidators;
    let pagination = clusterValidatorsPagination;
    do {
      const response = await validatorsByClusterHash(nextPage, getClusterHash(cluster.operators, walletStore.accountAddress), 14);
      validators = [...validators, ...response.validators];
      pagination = { ...response.pagination };
      if (fillSelectedValidators) {
        nextPage += 1;
        arraySize += response.validators.length;
        fillSelectedValidators(validators, selectAll);
      }
    } while (selectAll && arraySize < clusterValidatorsPagination.total && maxValidatorsCount && arraySize < maxValidatorsCount);
    setClusterValidators(validators);
    setClusterValidatorsPagination(pagination);
    setIsLoading && setIsLoading(false);
  };

  const copyToClipboard = (publicKey: string) => {
    navigator.clipboard.writeText(publicKey);
    dispatch(setMessageAndSeverity({ message: 'Copied to clipboard.', severity: 'success' }));
  };

  const openLink = (url: string) => window.open(url, '_blank');
  return (
    <TableWrapper id={'scrollableDiv'}>
      <InfiniteScroll
        dataLength={clusterValidators.length}
        next={async () => {
          return await onChangePage();
        }}
        hasMore={clusterValidators.length !== clusterValidatorsPagination.total}
        loader={<SpinnerWrapper><Spinner /></SpinnerWrapper>}
        scrollableTarget={'scrollableDiv'}
      >
        <TableHeader>
          {fillSelectedValidators && <Checkbox isDisabled={isLoading} grayBackGround text={''}
                                               withoutMarginBottom
                                               smallLine
                                               toggleIsChecked={() => {
                                                 setIsLoading && setIsLoading(true);
                                                 onChangePage(true);
                                               }}
                                               isChecked={selectedValidators && Object.values(selectedValidators).some((validator: {
                                                 validator: IValidator,
                                                 isSelected: boolean
                                               }) => validator.isSelected)}/>}
          <TableHeaderTitle marginLeft={onCheckboxClickHandler && selectedValidators ? 20 : 0}>Public
            Key</TableHeaderTitle>
          <TableHeaderTitle
            marginLeft={onCheckboxClickHandler && selectedValidators ? 227 : 279}>Status</TableHeaderTitle>
        </TableHeader>
        <ValidatorsListWrapper>
          {clusterValidators?.map((validator: IValidator) => {
              const formattedPublicKey = formatValidatorPublicKey(validator.public_key);
              const res = selectedValidators && selectedValidators[formattedPublicKey]?.isSelected;
              const showingCheckboxCondition = onCheckboxClickHandler && selectedValidators;
              const disableButtonCondition = selectValidatorDisableCondition && !res || isLoading;
              return (
                <ValidatorWrapper>
                  <PublicKeyWrapper>
                    <PublicKey>
                      {showingCheckboxCondition && <Checkbox isDisabled={disableButtonCondition} grayBackGround text={''}
                                                             withTooltip={disableButtonCondition}
                                                             tooltipText={checkboxTooltipTitle}
                                                             withoutMarginBottom
                                                             toggleIsChecked={() => onCheckboxClickHandler(formattedPublicKey, clusterValidators)}
                                                             isChecked={res}/>}
                      {longStringShorten(formattedPublicKey, 4, 4)}
                    </PublicKey>
                    <Link onClick={() => copyToClipboard(validator.public_key)} logo={'/images/copy/'}
                          isDarkMode={isDarkMode}/>
                  </PublicKeyWrapper>
                  <Status item={validator}/>
                  <LinksWrapper>
                    <Link onClick={() => openLink(`${config.links.EXPLORER_URL}/validators/${validator.public_key}`)}
                          logo={'/images/explorer/'} isDarkMode={isDarkMode}/>
                    <Link onClick={() => openLink(`${getBeaconChainLink()}/validator/${validator.public_key}`)}
                          logo={'/images/beacon/'} isDarkMode={isDarkMode}/>
                  </LinksWrapper>
                </ValidatorWrapper>);
            },
          )}
        </ValidatorsListWrapper>
      </InfiniteScroll>
    </TableWrapper>
  );
};

export default ValidatorsList;
