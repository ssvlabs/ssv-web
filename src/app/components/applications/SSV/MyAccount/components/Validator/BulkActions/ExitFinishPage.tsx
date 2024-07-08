import styled from 'styled-components';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import Summary from '~app/components/applications/SSV/MyAccount/components/Validator/SummaryValidators/Summary';
import ExitIndicator from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/ExitIndicator';
import { PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const Exit = styled.div`
  width: 648px;
  min-height: 492px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ExitTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray90};
`;

const ExitWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 24px;
`;

const ExitText = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray90};
`;

const ExitTextBold = styled.span`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray90};
`;

const ExitFinishPage = ({ nextStep, selectedValidators }: { nextStep: Function; selectedValidators: string[] }) => (
  <Wrapper>
    <NewWhiteWrapper type={WhiteWrapperDisplayType.VALIDATOR} header={'Cluster'} />
    <ExitWrapper>
      <Exit>
        <ExitTitle>Exit Validator</ExitTitle>
        <ExitText>Your request to exit the validator has been successfully broadcasted to the network.</ExitText>
        <ExitTitle>Next Steps</ExitTitle>
        <ExitText>
          <ExitTextBold>1. Monitor Validator:&nbsp;</ExitTextBold>
          Keep track of your validator until it fully exits.
        </ExitText>
        <ExitIndicator />
        <ExitText>
          <ExitTextBold>2. Remove Validator:&nbsp;</ExitTextBold>
          Once your validator has fully exited, you can remove it from the SSV Network. Keep in mind that you will continue to incur operational fees until it's removed, regardless
          of the validator's state on the Beacon Chain.
        </ExitText>
        <PrimaryButton text={'Go to Cluster Page'} onClick={nextStep} size={ButtonSize.XL} />
      </Exit>
      <Summary selectedValidators={selectedValidators} />
    </ExitWrapper>
  </Wrapper>
);

export default ExitFinishPage;
