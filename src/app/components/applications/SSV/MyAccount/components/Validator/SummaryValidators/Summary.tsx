import React from 'react';
import styled from 'styled-components';
import config from '~app/common/config';
import { ENV } from '~lib/utils/envHelper';
import { longStringShorten } from '~lib/utils/strings';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';

const SummaryWrapper = styled.div`
    width: 424px;
    height: 492px;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 16px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.gray90}
`;

const ValidatorsCountBadge = styled.div`
    height: 32px;
    border-radius: 8px;
    padding: 3px 8px;
    background-color: ${({ theme }) => theme.colors.tint90};
    color: ${({ theme }) => theme.colors.primaryBlue};
    font-size: 16px;
    font-weight: 500;
`;

const TableWrapper = styled.div`
    width: 100%;
    height: 376px;
    border: ${({ theme }) => `1px solid ${theme.colors.gray20}`};
    border-radius: 8px;
    display: flex;
    flex-direction: column;
`;

const ValidatorsListWrapper = styled.div`
    overflow-y: auto;
`;

const TableHeader = styled.div`
    width: 100%;
    height: 36px;
    padding: 9px 24px;
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.gray20}`};
`;

const TableHeaderTitle = styled.h6`
    margin: 0;
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray40}
`;

const ValidatorWrapper = styled.div`
    width: 100%;
    height: 54px;
    border: ${({ theme }) => `1px solid ${theme.colors.gray20}`};
    padding: 14px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ValidatorPublicKey = styled.p`
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray90}
`;

const LinksWrapper = styled.div`
    display: flex;
    flex-direction: row;
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

const Summary = ({ selectedValidators }: { selectedValidators: string[] }) => {
  const openExplorer = (publicKey: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'validator',
    });
    window.open(`${config.links.EXPLORER_URL}/validators/${publicKey.replace('0x', '')}`, '_blank');
  };

  const openBeaconcha = (publicKey: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Open Beaconcha',
    });
    window.open(`${ENV().BEACONCHA_URL}/validator/${publicKey}`);
  };

  return (
    <SummaryWrapper>
      <HeaderWrapper>
        <Title>
          Summary
        </Title>
        <ValidatorsCountBadge>
          {selectedValidators.length} Validators
        </ValidatorsCountBadge>
      </HeaderWrapper>
      <TableWrapper>
        <TableHeader>
          <TableHeaderTitle>Public Key</TableHeaderTitle>
        </TableHeader>
        <ValidatorsListWrapper>
          {selectedValidators.map((validatorPublicKey: string) =>
            <ValidatorWrapper key={validatorPublicKey}>
              <ValidatorPublicKey>{longStringShorten(validatorPublicKey, 4, 4)}</ValidatorPublicKey>
              <LinksWrapper>
                <Link onClick={() => openBeaconcha(validatorPublicKey)} logo={'/images/beacon/'}/>
                <Link onClick={() => openExplorer(validatorPublicKey)} logo={'/images/explorer/'}/>
              </LinksWrapper>
            </ValidatorWrapper>)}
        </ValidatorsListWrapper>
      </TableWrapper>
    </SummaryWrapper>
  );
};

export default Summary;