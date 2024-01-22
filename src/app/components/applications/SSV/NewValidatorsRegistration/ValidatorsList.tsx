import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getValidator } from '~lib/api/validator.service';
import { getAccountData } from '~lib/api/account.service';
import { KeyShareItem, Validator } from '~app/components/applications/SSV/models';
import { ValidatorStatuses } from '~app/components/applications/SSV/enums';
import ValidatorsTableRow from '~app/components/applications/SSV/NewValidatorsRegistration/ValidatorsTableRow';
import { translations } from '~app/common/config';

const Wrapper = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 32px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`;

const HeaderText = styled.div<{ theme: any }>`
  line-height: 28px;
  margin-right: 4px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray90};
`;

const HeaderCounter = styled.div<{ theme: any }>`
  line-height: 28px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray40};
`;

const HeaderCounterSuccess = styled.span<{ hasSuccess: boolean, theme: any }>`
  color: ${({ hasSuccess, theme }) => hasSuccess ? theme.colors.primarySuccessDark : theme.colors.gray40};
`;

const SubHeader = styled.div<{ theme: any }>`
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.colors.gray90};
`;

const ValidatorsTableWrapper = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.gray60};
  border-radius: 6px;
`;

const ValidatorsTableHeader = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 36px;
  padding-left: 32px;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.gray40};
`;

const ValidatorsTableInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ValidatorsTableScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
`;

const sortKeySharesByNonce = ({ keyShares }: { keyShares: KeyShareItem[] }) => ([...keyShares].sort((keyShare1, keyShare2) => parseInt(keyShare1.ownerNonce) - parseInt(keyShare2.ownerNonce)));

const ValidatorsList = ({ keyShares }: { keyShares: KeyShareItem[] }) => {
  const [validatorsWithStatus, setValidatorsWithStatus] = useState<Validator[] | null>(null);
  const [registeredValidatorsCounter, _setRegisteredValidatorsCounter] = useState(0);

  useEffect(() => {
    const sortedKeyShares = sortKeySharesByNonce({ keyShares });
    const setValidatorStatuses = async () => {
      let currNonce = await getAccountData(keyShares[0].ownerAddress);
      let hasInvalidNonce = false;
      const tmpValidatorsWithStatus = [] as Validator[];
      sortedKeyShares.forEach(async (keyShare) => {
        const validator = await getValidator(keyShare.publicKey, false);
        if (validator) {
          tmpValidatorsWithStatus.push({ publicKey: keyShare.publicKey, status: ValidatorStatuses.REGISTERED });
        } else if (!hasInvalidNonce && currNonce === keyShare.ownerNonce) {
          tmpValidatorsWithStatus.push({ publicKey: keyShare.publicKey, status: ValidatorStatuses.AWAITING_REGISTRATION });
        } else {
          if (!hasInvalidNonce) {
            hasInvalidNonce = true;
          }
          tmpValidatorsWithStatus.push({ publicKey: keyShare.publicKey, status: ValidatorStatuses.INCORRECT });
        }
        currNonce++;
      });
      setValidatorsWithStatus(tmpValidatorsWithStatus);
    };
    setValidatorStatuses();
  }, []);
  return (
    <Wrapper>
      <HeaderWrapper>
        <HeaderText>{translations.VALIDATOR.REGISTER.HEADER}</HeaderText>
        <HeaderCounter>(<HeaderCounterSuccess hasSuccess={registeredValidatorsCounter > 0}>{registeredValidatorsCounter}</HeaderCounterSuccess>/{validatorsWithStatus?.length})</HeaderCounter>
      </HeaderWrapper>
      <SubHeader>{translations.VALIDATOR.REGISTER.SUB_HEADER}</SubHeader>
      <ValidatorsTableWrapper>
        <ValidatorsTableHeader>{translations.VALIDATOR.REGISTER.PUBLIC_KEY}</ValidatorsTableHeader>
        <ValidatorsTableInnerWrapper>
          <ValidatorsTableScrollWrapper>
            {validatorsWithStatus?.map((validator) => <ValidatorsTableRow publicKey={validator.publicKey} isActive={false} hasError={false} isDone={false} />)}
          </ValidatorsTableScrollWrapper>
        </ValidatorsTableInnerWrapper>
      </ValidatorsTableWrapper>
    </Wrapper>
  );
};

export default ValidatorsList;
