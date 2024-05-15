
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`
    height: 115px;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ExitStepBlock = styled.div`
    height: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
`;

const ExitStepText = styled.p`
    margin: 0;
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray40};
`;

const colorize = (props : any) => keyframes`
    0% {
        background-color: ${props.theme.colors.gray40};
    }
    100% {
        background-color: ${props.theme.colors.primarySuccessDark};
    }
`;

const Indicator = styled.div<{ isExited?: boolean, theme: any }>`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primarySuccessDark};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const IndicatorAnimation = styled(Indicator)`
    animation: ${colorize} 1s ease-in-out infinite;
`;

const Logo = styled.div<{ logo: string }>`
    width: 8px;
    height: ${({ logo }) => logo === 'exited' ? '13px' : '8px'};
    cursor: pointer;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: ${({ logo }) => `url(/images/exit-validator/${logo}.svg)`};
`;

const Line = styled.div`
    width: 112px;
    border: ${({ theme }) => `1px solid ${theme.colors.gray40}`};
    margin-top: 20px;
`;

const ExitIndicator = () => {
  return (
    <Wrapper>
      <ExitStepBlock>
        <ExitStepText>
          Deposited
        </ExitStepText>
        <Indicator>
          <Logo logo={'exit-v'}/>
        </Indicator>
      </ExitStepBlock>
      <Line/>
      <ExitStepBlock>
        <ExitStepText>
          Pending
        </ExitStepText>
        <Indicator>
          <Logo logo={'exit-v'}/>
        </Indicator>
      </ExitStepBlock>
      <Line/>
      <ExitStepBlock>
        <ExitStepText>
          Active
        </ExitStepText>
        <Indicator>
          <Logo logo={'exit-active'}/>
        </Indicator>
      </ExitStepBlock>
      <Line/>
      <ExitStepBlock>
        <ExitStepText>
          Exited
        </ExitStepText>
        <IndicatorAnimation>
          <Logo logo={'exited'}/>
        </IndicatorAnimation>
      </ExitStepBlock>
    </Wrapper>
  );
};

export default ExitIndicator;