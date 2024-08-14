import styled from 'styled-components';
import { Filters } from '~root/services/keyShare.service.ts';

const Wrapper = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  justify-content: space-around;
  background-color: ${({ theme }) => theme.colors.gray10};
`;

const Button = styled.div<{ isSelected: boolean; isEmptyState: boolean }>`
  width: 138px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
  cursor: ${({ isEmptyState }) => (isEmptyState ? 'default' : 'pointer')};
  background-color: ${({ theme, isSelected }) => (isSelected ? theme.colors.white : 'transparent')};
  font-size: 14px;
  font-weight: ${({ isSelected }) => (isSelected ? 600 : 'transparent')};
  color: ${({ theme, isEmptyState, isSelected }) => {
    if (isSelected) return theme.colors.black;
    return isEmptyState ? theme.colors.gray30 : theme.colors.gray40;
  }};
`;

const Counter = styled.div<{ filterType: Filters; isEmptyState: boolean }>`
  border-radius: 6px;
  padding: 2px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, filterType, isEmptyState }) => {
    if (isEmptyState) return theme.colors.gray0;
    const colorMapping = {
      [Filters.AVAILABLE]: theme.colors.tint90,
      [Filters.REGISTERED]: theme.colors.primarySuccessRegularOpacity,
      [Filters.INCORRECT]: theme.colors.primaryErrorRegular,
      [Filters.ALL]: theme.colors.gray20
    };
    return colorMapping[filterType];
  }};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme, filterType, isEmptyState }) => {
    if (isEmptyState) return theme.colors.gray30;
    const colorMapping = {
      [Filters.AVAILABLE]: theme.colors.primaryBlue,
      [Filters.REGISTERED]: theme.colors.primarySuccessDark,
      [Filters.INCORRECT]: theme.colors.primaryError,
      [Filters.ALL]: theme.colors.gray60
    };
    return colorMapping[filterType];
  }};
`;

const KeySharesFilter = ({
  available,
  registered,
  incorrect,
  all,
  currentFilter,
  setCurrentFilter
}: {
  available: number;
  registered: number;
  incorrect: number;
  all: number;
  currentFilter: Filters;
  setCurrentFilter: Function;
}) => {
  const buttons = [
    {
      type: Filters.AVAILABLE,
      count: available,
      props: {
        isSelected: currentFilter === Filters.AVAILABLE,
        onClick: () => available && setCurrentFilter(Filters.AVAILABLE),
        isEmptyState: available === 0
      }
    },
    {
      type: Filters.REGISTERED,
      count: registered,
      props: {
        isSelected: currentFilter === Filters.REGISTERED,
        onClick: () => registered && setCurrentFilter(Filters.REGISTERED),
        isEmptyState: registered === 0
      }
    },
    {
      type: Filters.INCORRECT,
      count: incorrect,
      props: {
        isSelected: currentFilter === Filters.INCORRECT,
        onClick: () => incorrect && setCurrentFilter(Filters.INCORRECT),
        isEmptyState: incorrect === 0
      }
    },
    {
      type: Filters.ALL,
      count: all,
      props: {
        isSelected: currentFilter === Filters.ALL,
        onClick: () => all && setCurrentFilter(Filters.ALL),
        isEmptyState: all === 0
      }
    }
  ];

  return (
    <Wrapper>
      {buttons.map((button) => (
        <Button {...button.props}>
          {button.type}
          <Counter filterType={button.type} isEmptyState={button.props.isEmptyState}>
            {button.count}
          </Counter>
        </Button>
      ))}
    </Wrapper>
  );
};

export default KeySharesFilter;
