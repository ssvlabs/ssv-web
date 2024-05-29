import styled from 'styled-components';

const BadgeWrapper = styled.div`
  //width: 75px;
  height: 26px;
  padding: 1px 6px;
  gap: 4px;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
`;

const StatusText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray40};
`;

const Icon = styled.div`
  width: 18px;
  height: 18px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(/images/operatorStatus/public.svg);
`;

const OperatorAccessStatusBadge = ({ status, isOperatorStatus }: { status: string; isOperatorStatus: boolean }) => {
  return (
    <BadgeWrapper>
      {isOperatorStatus && <Icon />}
      <StatusText>{status}</StatusText>
    </BadgeWrapper>
  );
};

export default OperatorAccessStatusBadge;
