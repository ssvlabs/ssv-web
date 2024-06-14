import styled from 'styled-components';
import { OperatorStatusBadge } from '~app/components/applications/SSV/OperatorAccessSettingsV2/OperatorStatusBadge.tsx';
import ToolTip from '~app/components/common/ToolTip';
import LinkText from '~app/components/common/LinkText';
import config from '~app/common/config';
import { Switch } from '~app/atomicComponents';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray80};
`;

const Container = styled.div<{ gap?: number }>`
  display: flex;
  flex-direction: row;
  gap: ${({ gap }) => `${gap || 20}px`};
  align-items: center;
`;

const TooltipTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TolltipText = styled.div<{ fontWeight?: number }>`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ fontWeight }) => fontWeight || 500};
  white-space: nowrap;
  display: flex;
  flex-direction: row;
`;

const RegisterOperatorStatus = ({ isPrivate, setIsPrivate }: { isPrivate: boolean; setIsPrivate: Function }) => (
  <Wrapper>
    <Container gap={4}>
      <Title>Operator Status</Title>
      <ToolTip
        text={
          <TooltipTextWrapper>
            <div>
              <TolltipText>
                <TolltipText fontWeight={700}>Public Mode</TolltipText>&nbsp; - Any validator can register with the operator.
              </TolltipText>
              <TolltipText>
                <TolltipText fontWeight={700}>Private Mode</TolltipText>&nbsp; - Only whitelisted addresses can register.
              </TolltipText>
            </div>
            <div>
              <TolltipText>Please note that you can always modify the operator status in the future.</TolltipText>
              <TolltipText>
                Learn more about&nbsp;
                <LinkText withoutUnderline textSize={14} link={config.links.PERMISSIONED_OPERATORS} text={'Permissioned Operators.'} />
              </TolltipText>
            </div>
          </TooltipTextWrapper>
        }
      />
    </Container>
    <Container>
      <OperatorStatusBadge isPrivate={isPrivate} />
      <Switch isChecked={isPrivate} setIsChecked={() => setIsPrivate(!isPrivate)} />
    </Container>
  </Wrapper>
);

export default RegisterOperatorStatus;
