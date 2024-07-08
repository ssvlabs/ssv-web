import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { BulkValidatorData } from '~app/model/validator.model';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import AnchorTooltip from '~app/components/common/ToolTip/components/AnchorTooltip/AnchorTooltIp';
import ValidatorsList from '~app/components/applications/SSV/MyAccount/components/Validator/ValidatorsList/ValidatorsList';
import Spinner from '~app/components/common/Spinner';
import { PrimaryButton } from '~app/atomicComponents';
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

const TooltipTitleWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
`;

const TooltipLink = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.tint40};
  text-decoration: underline;
  white-space: nowrap;
  cursor: pointer;
`;

const NewBulkActions = ({
  title,
  nextStep,
  onCheckboxClickHandler,
  selectedValidators,
  fillSelectedValidators,
  maxValidatorsCount,
  tooltipTitle,
  checkboxTooltipTitle
}: {
  title: string;
  nextStep: Function;
  onCheckboxClickHandler: Function;
  selectedValidators: Record<string, BulkValidatorData>;
  fillSelectedValidators: Function;
  maxValidatorsCount: number;
  tooltipTitle: string;
  checkboxTooltipTitle: string;
}) => {
  const navigate = useNavigate();
  const validator = useAppSelector(getSelectedCluster);
  const validatorsListArray = Object.values(selectedValidators);
  const selectedValidatorsCount = validatorsListArray.filter((validator: BulkValidatorData) => validator.isSelected).length;
  const totalCount = validator.validatorCount > maxValidatorsCount ? maxValidatorsCount : validator.validatorCount;
  const [isLoading, setIsLoading] = useState(false);
  const disableButtonCondition = !selectedValidatorsCount || isLoading;
  const showIndicatorCondition = selectedValidatorsCount > 0;
  const showSubHeaderCondition = validator.validatorCount > maxValidatorsCount;
  const createValidatorsLaunchpad = () => {
    navigate(config.routes.SSV.VALIDATOR.CREATE);
  };

  const tooltipTitleComponent = (tooltipText: string) =>
    validatorsListArray.length > maxValidatorsCount ? (
      <TooltipTitleWrapper>
        {tooltipText}
        <TooltipLink onClick={createValidatorsLaunchpad}>Create via Ethereum Launchpad</TooltipLink>
      </TooltipTitleWrapper>
    ) : undefined;

  return (
    <Wrapper>
      <NewWhiteWrapper type={WhiteWrapperDisplayType.VALIDATOR} header={'Cluster'} />
      <ValidatorsWrapper>
        <HeaderWrapper>
          <TitleWrapper>
            <Title>{title}</Title>
            {showIndicatorCondition &&
              (isLoading ? (
                <Spinner />
              ) : (
                <AnchorTooltip title={validatorsListArray.length > maxValidatorsCount ? tooltipTitleComponent(tooltipTitle) : null} placement={'top'}>
                  <SelectedIndicator>
                    {selectedValidatorsCount} of {totalCount} selected
                  </SelectedIndicator>
                </AnchorTooltip>
              ))}
          </TitleWrapper>
          {showSubHeaderCondition && <SubHeader>Select up to {maxValidatorsCount} validators</SubHeader>}
          <ValidatorsList
            withoutSettings
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            checkboxTooltipTitle={tooltipTitleComponent(checkboxTooltipTitle)}
            maxValidatorsCount={maxValidatorsCount}
            onCheckboxClickHandler={onCheckboxClickHandler}
            selectedValidators={selectedValidators}
            fillSelectedValidators={fillSelectedValidators}
          />
        </HeaderWrapper>
        <PrimaryButton text={'Next'} isDisabled={disableButtonCondition} onClick={nextStep} size={ButtonSize.XL} />
      </ValidatorsWrapper>
    </Wrapper>
  );
};

export default NewBulkActions;
