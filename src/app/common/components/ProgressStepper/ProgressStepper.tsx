import React from 'react';
import styled from 'styled-components';

const ProgressStep = styled.div<{ isActive: boolean }>`
  background: ${({ isActive }) => {
  if (isActive) {
    return '#5B6C84';
  }
  return 'white';
}};
  color: ${({ isActive }) => {
  if (isActive) {
    return 'white';
  }
  return '#5B6C84';
}};
  border-width: 2px;
  border-style: solid;
  border-color: #5B6C84;
  border-radius: 12px;
  display: block;
  width: 24px;
  min-width: 24px;
  height: 24px;
  min-height: 24px;
  text-align: center;
  padding: 0;
  line-height: 20px;
`;

const ProgressSteps = styled.div<{ width?: any }>`
  width: ${({ width }) => width ?? 'calc(50% + 40px)'};
  margin: auto;
  display: flex;
  
  ${ProgressStep} {
    margin: auto;
  }
  
  ${ProgressStep}:first-child {
    margin-left: 0;
    margin-right: auto;
  }
  
  ${ProgressStep}:last-child {
    margin-left: auto;
    margin-right: 0;
  }
`;

const ProgressBridge = styled.div<{ isDone?: boolean }>`
  height: 1px;
  border-top: 2px solid ${({ isDone }) => isDone ? '#20EEC8' : '#5B6C84'};
  width: 100%;
  display: block;
  content: ' ';
  margin-top: 11px;
`;

type ProgressStepperProps = {
  step: number;
  steps: number;
  done: boolean;
};

const ProgressStepper = (props: ProgressStepperProps) => {
  const { steps, step, done } = props;
  const steps_array = new Array(steps).fill(0);
  const progressBridgeWidth = `calc(${100.0 / (steps - 1)}% - 15px)`;
  return (
    <>
      <ProgressSteps key="progress-steps-container">
        {steps_array.map((_, s) => {
          const isStepDone = s + 1 < step || done;
          const isStepActive = s + 1 === step;
          if (isStepDone) {
            return (
              <>
                {s !== 0 ? (
                  <ProgressBridge
                    isDone
                    key={`progress-bridge-${s}`}
                    style={{ width: progressBridgeWidth }}
                  />
                ) : ''}
                <img
                  key={`progress-step-done-${s}`}
                  src="/images/step-done.svg"
                  alt="Done"
                />
              </>
            );
          }
          return (
            <>
              {s !== 0 ? (
                <ProgressBridge
                  isDone={s < step}
                  key={`progress-bridge-${s}`}
                  style={{ width: progressBridgeWidth }}
                />
              ) : ''}
              <ProgressStep
                key={`progress-step-${s}`}
                isActive={isStepActive}
              >
                {s + 1}
              </ProgressStep>
            </>
          );
        })}
      </ProgressSteps>
    </>
  );
};

export default ProgressStepper;
