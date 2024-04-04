import React, { useState } from 'react';
import styled from 'styled-components';
import { getStoredNetwork, GOERLI_NETWORK_ID } from '~root/providers/networkInfo.provider';
import { useAppSelector } from '~app/hooks/redux.hook';

const AnnouncementWrapper = styled.div`
    width: 100%;
    height: 60px;
    background-color: ${({ theme }) => theme.colors.primaryError};
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.white};
    font-size: 16px;
    font-weight: 500;
    justify-content: flex-end;
    padding-right: 20px;
`;

const AttentionIcon = styled.div`
    width: 24px;
    height: 24px;
    margin-right: 12px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(/images/attention/attention.svg);`;

const CloseButton = styled.div`
    width: 24px;
    height: 24px;
    background-size: contain;
    background-position: center;
    cursor: pointer;
    background-repeat: no-repeat;
    background-image: url(/images/x/white.svg);
    margin-left: 421px;
`;

const Announcement = () => {
  const network = useAppSelector(getStoredNetwork);
  const [showAnnotation, setShowAnnotation] = useState(true);

  const closeAnnotation = () => setShowAnnotation(false);

  if (showAnnotation && network.networkId === GOERLI_NETWORK_ID) {
    return (
      <div>
        <AnnouncementWrapper><AttentionIcon/>Goerli network support will be deprecated on April 18th, 2024. As of this
          date, the official testnet will shift to the Holesky testnet. <CloseButton
            onClick={closeAnnotation}/></AnnouncementWrapper>
      </div>
    );
  } else {
    return null;
  }
};

export default Announcement;