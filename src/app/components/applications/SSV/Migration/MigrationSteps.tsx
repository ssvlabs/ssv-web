import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex: 600px 0 0;
  flex-direction: column;
  padding-top: 10px;
`;

const UpperPartWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 50px;
`;

const MigrationStepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 2px;
  margin-bottom: 8px;
  border-radius: 6px;
  border: 2px solid #1BA5F8;
  background: #1BA5F8;
  color: #FFFFFF;
`;

const ProgressBarLine = styled.div`
  display: flex;
  flex: 1;
  height: 2px;
  margin-bottom: 9px;
  background-color: #1BA5F8;
`;

const LowerPartWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StepTitle = styled.p`
  color: #63768B;
  font-variant-numeric: lining-nums proportional-nums;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Avenir, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
`;

const MigrationSteps = () => (
  <Wrapper>
    <UpperPartWrapper>
      <MigrationStepNumber>&#10003;</MigrationStepNumber>
      <ProgressBarLine />
      <MigrationStepNumber>&#10003;</MigrationStepNumber>
      <ProgressBarLine />
      <MigrationStepNumber style={{ backgroundColor: '#FFFFFF', color: '#34455A' }}>3</MigrationStepNumber>
    </UpperPartWrapper>
    <LowerPartWrapper>
      <StepTitle >Define Owner Address</StepTitle>
      <StepTitle>Migration file & KV Deletion</StepTitle>
      <StepTitle style={{ color: '#1BA5F8' }}>Validator Registration</StepTitle>
    </LowerPartWrapper>
  </Wrapper>
);

export default MigrationSteps;
