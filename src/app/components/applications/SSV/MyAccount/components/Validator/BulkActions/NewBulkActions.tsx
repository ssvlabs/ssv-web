import styled from 'styled-components';
import { PrimaryButton } from '~app/atomicComponents';
import ValidatorsList, { ValidatorsListProps } from '~app/components/applications/SSV/MyAccount/components/Validator/ValidatorsList/ValidatorsList';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import Spinner from '~app/components/common/Spinner';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppSelector } from '~app/hooks/redux.hook.ts';
import { getSelectedCluster } from '~app/redux/account.slice.ts';

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
  cursor: default;
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

const NewBulkActions = ({ title, nextStep, listProps }: { title: string; nextStep: Function; listProps: Required<ValidatorsListProps> }) => {
  const validator = useAppSelector(getSelectedCluster);
  const selectedValidatorsCount = listProps.selectedValidators?.length || 0;
  const totalCount = validator.validatorCount > listProps.maxSelectable ? listProps.maxSelectable : validator.validatorCount;
  const disableButtonCondition = !selectedValidatorsCount || listProps.infiniteScroll.isLoading;
  const showIndicatorCondition = selectedValidatorsCount > 0;
  const showSubHeaderCondition = validator.validatorCount > listProps.maxSelectable;

  return (
    <Wrapper>
      <NewWhiteWrapper type={WhiteWrapperDisplayType.VALIDATOR} header={'Cluster'} />
      <ValidatorsWrapper>
        <HeaderWrapper>
          <TitleWrapper>
            <Title>{title}</Title>
            {showIndicatorCondition &&
              (listProps.infiniteScroll.isLoading ? (
                <Spinner />
              ) : (
                <SelectedIndicator>
                  {selectedValidatorsCount} of {totalCount} selected
                </SelectedIndicator>
              ))}
          </TitleWrapper>
          {showSubHeaderCondition && <SubHeader>Select up to {listProps.maxSelectable} validators</SubHeader>}
          <ValidatorsList {...listProps} />
        </HeaderWrapper>
        <PrimaryButton text={'Next'} isDisabled={disableButtonCondition} onClick={nextStep} size={ButtonSize.XL} />
      </ValidatorsWrapper>
    </Wrapper>
  );
};

export default NewBulkActions;
