import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RobotLogo = styled.div`
  width: 154px;
  height: 240px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(/images/maintenaceMascot/maintenaceMascot.svg);
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.gray80};
`;

const AdditionalText = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.black};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
`;

const MaintenancePage = () => {
  return (
    <Wrapper>
      <RobotLogo />
      <TextWrapper>
        <Title>The site is currently down for maintenance</Title>
        <AdditionalText>We’ll be back up and running again shortly</AdditionalText>
      </TextWrapper>
    </Wrapper>
  );
};

export default MaintenancePage;
