import styled from 'styled-components';
import OperatorAccessStatusBadge from '~app/atomicComponents/OperatorAccessStatusBadge.tsx';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const SectionTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray90};
`;

const SectionSubtitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray80};
`;

const OpenSectionButton = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(/images/arrowNext/light.svg);
`;

const OpenAndStatusWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const PermissionSettingsSection = ({
  title,
  subTitle,
  status,
  onClick,
  isOperatorStatus = false
}: {
  title: string;
  subTitle: string;
  status: string;
  onClick: Function;
  isOperatorStatus?: boolean;
}) => {
  return (
    <Wrapper onClick={() => onClick()}>
      <SectionInfo>
        <SectionTitle>{title}</SectionTitle>
        <SectionSubtitle>{subTitle}</SectionSubtitle>
      </SectionInfo>
      <OpenAndStatusWrapper>
        <OperatorAccessStatusBadge isOperatorStatus={isOperatorStatus} status={status} />
        <OpenSectionButton />
      </OpenAndStatusWrapper>
    </Wrapper>
  );
};

export default PermissionSettingsSection;
