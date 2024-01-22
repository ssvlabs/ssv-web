import React from 'react';
import styled from 'styled-components';
import { ENV } from '~lib/utils/envHelper';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import { NotificationsStore } from '~app/common/stores/applications/SsvWeb';
import { copyLight, copyDark, beaconLight, beaconDark, checkmarkOk, chevronRight, clock, errorIcon } from '../../../../../../public/images';

const Wrapper = styled.div<{ isActive: boolean, theme: any }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 24px;
  border: 1px solid ${({ isActive, theme }) => isActive ? theme.colors.gray90 : theme.colors.gray60};
  background-color: ${({ isActive, theme }) => isActive ? theme.colors.activeBackground : 'transparent'};
`;

const LeftPart = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Address = styled.div<{ isActive: boolean, theme: any }>`
  margin-right: 8px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ isActive, theme }) => isActive ? theme.colors.gray90 : theme.colors.gray60};
`;

const IconContainer = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 8px;
`;

const CopyIcon = styled(IconContainer)<{ isActive: boolean, theme: any }>`
  background-image: url(${({ theme }) => theme.colors.isDarkTheme ? copyDark : copyLight});
`;

const BeaconIcon = styled(IconContainer)<{ isActive: boolean, theme: any }>`
  background-image: url(${({ theme }) => theme.colors.isDarkTheme ? beaconDark : beaconLight});
`;

const RightPart = styled.div<{ isActive: boolean, hasError: boolean, isDone: boolean, theme: any }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 26px;
  padding: 1px 8px;
  border-radius: 3px;
  ${({ isActive, hasError, isDone, theme }) => {
    if (isActive) {
      return `background-color: ${theme.colors.tint80};`;
    }
    if (hasError) {
      return `background-color: ${theme.colors.pale12};`;
    }
    if (isDone) {
      return `background-color: ${theme.colors.pale16};`;
    }
      return `background-color: ${theme.colors.gray10};`;
    }
  }}
`;

const StatusText = styled.div<{ isActive: boolean, hasError: boolean, isDone: boolean, theme: any }>`
  margin-right: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  ${({ isActive, hasError, isDone, theme }) => {
    if (isActive) {
      return `color ${theme.colors.primaryBlue};`;
    }
    if (hasError) {
      return `color: ${theme.colors.primaryError}};`;
    }
    if (isDone) {
      return `color: ${theme.colors.primarySuccessDark};`;
    }
    return `color: ${theme.colors.gray60};`;
  }}
`;

const RightPartIcon1 = styled.img`
  width: 16px;
  height: 16px;
`;

const RightPartIcon2 = styled.img`
  width: 24px;
  height: 24px;
  margin-left: -4px;
`;

interface ValidatorsTableRowProp {
  publicKey: string;
  isActive: boolean;
  hasError: boolean;
  isDone: boolean;
}

const ValidatorsTableRow = ({ publicKey, isActive, hasError, isDone }: ValidatorsTableRowProp) => {
  const stores = useStores();
  const notificationsStore: NotificationsStore = stores.Notifications;

  const copyAddress = () => {
    console.log(publicKey);
    navigator.clipboard.writeText(publicKey);
    notificationsStore.showMessage('Copied to clipboard.', 'success');
  };

  const openLink = () => {
    const { BEACONCHA_URL } = ENV();
    window.open(`${BEACONCHA_URL}/validator/${publicKey}`);
  };

  let statusText;
  if (isActive || (!hasError && !isDone)) {
    statusText = translations.VALIDATOR.REGISTER.CONFIRM;
  } else if (hasError) {
    statusText = translations.VALIDATOR.REGISTER.ERROR;
  } else {
    statusText = translations.VALIDATOR.REGISTER.REGISTERED;
  }

  let rightIcon = clock;
  if (isActive) {
    rightIcon = chevronRight;
  } else if (hasError) {
    rightIcon = errorIcon;
  } else if (isDone) {
    rightIcon = checkmarkOk;
  }

  return (
    <Wrapper isActive={isActive} >
      <LeftPart>
        <Address isActive={isActive}>{publicKey}</Address>
        <CopyIcon isActive={isActive} onClick={copyAddress} />
        <BeaconIcon isActive={isActive} onClick={openLink} />
      </LeftPart>
      <RightPart isActive={isActive} hasError={hasError} isDone={isDone}>
        <StatusText isActive={isActive} hasError={hasError} isDone={isDone}>{statusText}</StatusText>
        {hasError || isDone ? <RightPartIcon1 src={rightIcon} /> : <RightPartIcon2 src={rightIcon} />}
      </RightPart>
    </Wrapper>
  );
};

export default ValidatorsTableRow;
