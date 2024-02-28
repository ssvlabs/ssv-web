import React from 'react';
import styled from 'styled-components';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import ValidatorsList from '~app/components/applications/SSV/MyAccount/components/Validator/ValidatorsList/ValidatorsList';
import { BulkValidatorData } from '~app/model/validator.model';

const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0;
`;

const Title = styled.h1`
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: ${({ theme }) => theme.colors.gray90};
`;

const TitleWrapper = styled.div`
    height: 32px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const SelectedIndicator = styled.div`
    margin: 0;
    height: 32px;
    border-radius: 8px;
    padding: 3px 8px;
    background-color: ${({ theme }) => theme.colors.tint90};
    color: ${({ theme }) => theme.colors.primaryBlue};
    font-size: 16px;
    font-weight: 500;
`;

const SubHeader = styled.h3`
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    color: ${({ theme }) => theme.colors.gray80};
`;

const Wrapper = styled.div`
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const ValidatorsWrapper = styled.div`
    width: 872px;
    max-height: 842px;
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    padding: 32px;
    gap: 24px;
    border-radius: 16px;
    background-color: ${({ theme }) => theme.colors.white};
`;

const NewBulkActions = ({ title, nextStep, onCheckboxClickHandler, selectedValidators, fillSelectedValidators }: { title: string, nextStep: Function, onCheckboxClickHandler: Function, selectedValidators: Record<string, BulkValidatorData>, fillSelectedValidators: Function }) => {
  const validatorsListArray = Object.values(selectedValidators);
  const selectedValidatorsCount = validatorsListArray.filter((validator: BulkValidatorData) => validator.isSelected).length;
  const disableButtonCondition = !selectedValidatorsCount;
  const showIndicatorCondition = selectedValidatorsCount > 0;

  return (
    <Wrapper>
      <NewWhiteWrapper
        type={0}
        header={'Cluster'}
      />
      <ValidatorsWrapper>
            <HeaderWrapper>
              <TitleWrapper>
                <Title>{title}</Title>
                {showIndicatorCondition && <SelectedIndicator>{selectedValidatorsCount} of {validatorsListArray.length} selected</SelectedIndicator>}
              </TitleWrapper>
              <ValidatorsList onCheckboxClickHandler={onCheckboxClickHandler} selectedValidators={selectedValidators} fillSelectedValidators={fillSelectedValidators} />
            </HeaderWrapper>
        <PrimaryButton children={'Next'} disable={disableButtonCondition} submitFunction={nextStep} />
      </ValidatorsWrapper>
    </Wrapper>
  );
};

export default NewBulkActions;