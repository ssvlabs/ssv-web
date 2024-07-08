import { useState } from 'react';
import styled from 'styled-components';
import Checkbox from '~app/components/common/CheckBox';
import WarningBox from '~app/components/common/WarningBox';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import Summary from '~app/components/applications/SSV/MyAccount/components/Validator/SummaryValidators/Summary';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsLoading } from '~app/redux/appState.slice';
import { ErrorButton, PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import { BULK_FLOWS } from '~app/enums/bulkFlow.enum.ts';

type FlowData = {
  title: string;
  texts: string[];
  warningMessage: string;
  checkBoxes: string[];
  buttonText: Function;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const ConfirmationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 24px;
`;

const Confirmation = styled.div`
  width: 648px;
  min-height: 492px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ConfirmationTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray90};
`;

const ConfirmationText = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray60};
`;

const initialState = (checkBoxes: string[]) =>
  checkBoxes.reduce((acc: boolean[]) => {
    acc.push(false);
    return acc;
  }, []);

const ConfirmationStep = ({
  nextStep,
  selectedValidators,
  flowData,
  stepBack,
  currentBulkFlow,
  isLoading
}: {
  nextStep: Function;
  selectedValidators: string[];
  flowData: FlowData;
  stepBack?: Function;
  currentBulkFlow: BULK_FLOWS;
  isLoading: boolean;
}) => {
  const { title, texts, warningMessage, checkBoxes } = flowData;
  const [isSelectedCheckboxes, setIsSelectedCheckboxes] = useState(initialState(checkBoxes));
  const disableCButtonCondition = isSelectedCheckboxes.some((isSelected: boolean) => !isSelected);
  const appStateIsLoading = useAppSelector(getIsLoading);

  const clickCheckboxHandler = ({ index }: { index: number }) => {
    setIsSelectedCheckboxes((prevState: boolean[]) => {
      prevState[index] = !prevState[index];
      return [...prevState];
    });
  };

  const Button = currentBulkFlow === BULK_FLOWS.BULK_REMOVE ? ErrorButton : PrimaryButton;

  return (
    <Wrapper>
      <NewWhiteWrapper type={WhiteWrapperDisplayType.VALIDATOR} header={'Cluster'} stepBack={stepBack} />
      <ConfirmationWrapper>
        <Confirmation>
          <ConfirmationTitle>{title}</ConfirmationTitle>
          {texts.map((text: string) => (
            <ConfirmationText key={text}>{text}</ConfirmationText>
          ))}
          <WarningBox text={warningMessage} />
          {checkBoxes.map((checkBoxText, index) => (
            <Checkbox
              key={index}
              withoutMarginBottom
              toggleIsChecked={() => clickCheckboxHandler({ index })}
              grayBackGround
              text={checkBoxText}
              isChecked={isSelectedCheckboxes[index]}
            />
          ))}
          <Button
            text={flowData.buttonText(selectedValidators.length, appStateIsLoading)}
            isDisabled={disableCButtonCondition}
            isLoading={isLoading}
            onClick={nextStep}
            size={ButtonSize.XL}
          />
        </Confirmation>
        <Summary selectedValidators={selectedValidators} />
      </ConfirmationWrapper>
    </Wrapper>
  );
};

export default ConfirmationStep;
