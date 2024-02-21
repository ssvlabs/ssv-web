import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import { longStringShorten } from '~lib/utils/strings';
import Checkbox from '~app/components/common/CheckBox/CheckBox';
import {
  ProcessStore,
  WalletStore,
  SingleCluster as SingleClusterProcess,
  NotificationsStore,
} from '~app/common/stores/applications/SsvWeb';
import { ENV } from '~lib/utils/envHelper';
import { IValidator } from '~app/model/validator.model';
import { formatValidatorPublicKey } from '~root/services/utils.service';
import { getClusterHash } from '~root/services/cluster.service';
import { validatorsByClusterHash } from '~root/services/validator.service';

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

const Link = styled.div<{ logo: string }>`
    width: 24px;
    height: 24px;
    cursor: pointer;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: ${({ theme, logo }) => `url(${logo}${theme.colors.isDarkTheme ? 'dark.svg' : 'light.svg'})`}
}
`;

const ValidatorsList = ({ onCheckboxClickHandler, selectedValidators, fillSelectedValidators }: {
  onCheckboxClickHandler?: Function,
  selectedValidators?: Record<string, { validator: IValidator, isSelected: boolean }>,
  fillSelectedValidators?: Function
}) => {
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;
  const notificationsStore: NotificationsStore = stores.Notifications;
  const processStore: ProcessStore = stores.Process;
  const process: SingleClusterProcess = processStore.getProcess;
  const cluster = process?.item;
  const navigate = useNavigate();
  const [clusterValidators, setClusterValidators] = useState<IValidator[]>([]);
  const [clusterValidatorsPagination, setClusterValidatorsPagination] = useState({
    page: 1,
    total: cluster.validatorCount,
    pages: 1,
    per_page: 5,
    rowsPerPage: 14,
    onChangePage: console.log,
  });

  useEffect(() => {
    if (!cluster) return navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
    validatorsByClusterHash(1, getClusterHash(cluster.operators, walletStore.accountAddress), clusterValidatorsPagination.rowsPerPage).then((response: any) => {
      setClusterValidators(response.validators);
      if (fillSelectedValidators) fillSelectedValidators(response.validators);
      setClusterValidatorsPagination({ ...response.pagination, rowsPerPage: 14 });
    });
  }, []);

  // TODO: Implement infinite scroll on using this component for single cluster page
  // const onChangePage = async (newPage: number, rowsPerPage?: number) => {
  //   validatorsByClusterHash(newPage, clusterStore.getClusterHash(cluster.operators), undefined, clusterValidatorsPagination.total).then((response: any) => {
  //     setClusterValidators([...clusterValidators, ...response.validators]);
  //     setClusterValidatorsPagination({ ...response.pagination, rowsPerPage: clusterValidatorsPagination.total + 1 });
  //     if (selectAllValidators && selectUnselectAllValidators) {
  //       selectUnselectAllValidators([...clusterValidators, ...response.validators].map((validator: any) => validator.public_key),  setSelectAllValidators);
  //     }
  //   });
  // };

  const copyToClipboard = (publicKey: string) => {
    navigator.clipboard.writeText(publicKey);
    notificationsStore.showMessage('Copied to clipboard.', 'success');
  };

  const openLink = (url: string) => window.open(url, '_blank');

  return (
    <TableWrapper>
      <TableHeader>
        {fillSelectedValidators && <Checkbox disable={false} grayBackGround text={''}
                                                  withoutMarginBottom
                                                  smallLine
                                                  onClickCallBack={() => {
                                                    fillSelectedValidators(clusterValidators, true);
                                                  }}
                                                  isChecked={selectedValidators && Object.values(selectedValidators).some((validator: { validator: IValidator, isSelected: boolean }) => validator.isSelected)}/>}
        <TableHeaderTitle marginLeft={onCheckboxClickHandler && selectedValidators && 20}>Public Key</TableHeaderTitle>
        <TableHeaderTitle
          marginLeft={onCheckboxClickHandler && selectedValidators ? 227 : 279}>Status</TableHeaderTitle>
      </TableHeader>
      <ValidatorsListWrapper id="scrollableDiv">
        {/*// TODO: Implement infinite scroll on using this component for single cluster page*/}
        {/*<InfiniteScroll*/}
        {/*  dataLength={rows.length}*/}
        {/*  next={async () => {*/}
        {/*    return await onChangePage(clusterValidatorsPagination.page + 1);*/}
        {/*  }}*/}
        {/*  hasMore={true}*/}
        {/*  loader={<h4>Loading...</h4>}*/}
        {/*  scrollableTarget="scrollableDiv"*/}
        {/*>*/}
        {clusterValidators?.map((validator: IValidator) => {
            const formattedPublicKey = formatValidatorPublicKey(validator.public_key);
            const res = selectedValidators && selectedValidators[formattedPublicKey]?.isSelected;
            return (
              <ValidatorWrapper>
                <PublicKeyWrapper>
                  <PublicKey>
                    {onCheckboxClickHandler && selectedValidators && <Checkbox disable={false} grayBackGround text={''}
                                                                               withoutMarginBottom
                                                                               onClickCallBack={(isChecked: boolean) => onCheckboxClickHandler(isChecked, formattedPublicKey, clusterValidators)}
                                                                               isChecked={res}/>}
                    {longStringShorten(formattedPublicKey, 4, 4)}
                  </PublicKey>
                  <Link onClick={() => copyToClipboard(validator.public_key)} logo={'/images/copy/'}/>
                </PublicKeyWrapper>
                <Status item={validator}/>
                <LinksWrapper>
                  <Link onClick={() => openLink(`${config.links.EXPLORER_URL}/validators/${validator.public_key}`)}
                        logo={'/images/explorer/'}/>
                  <Link onClick={() => openLink(`${ENV().BEACONCHA_URL}/validator/${validator.public_key}`)}
                        logo={'/images/beacon/'}/>
                </LinksWrapper>
              </ValidatorWrapper>);
          },
        )}
        {/*</InfiniteScroll>*/}
      </ValidatorsListWrapper>
    </TableWrapper>
  );
};

export default ValidatorsList;
