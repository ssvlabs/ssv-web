import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { useDebounce, useIntersection } from 'react-use';
import styled from 'styled-components';
import Settings from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/Settings';
import Checkbox from '~app/components/common/CheckBox/CheckBox';
import Spinner from '~app/components/common/Spinner';
import Status from '~app/components/common/Status';
import ToolTip from '~app/components/common/ToolTip';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { IValidator } from '~app/model/validator.model';
import { getIsDarkMode } from '~app/redux/appState.slice';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { add0x, longStringShorten } from '~lib/utils/strings';

const TableWrapper = styled.div<{ children: React.ReactNode; id: string; isLoading: boolean }>`
  margin-top: 12px;
  width: 808px;
  max-height: 600px;
  border: ${({ theme }) => `1px solid ${theme.colors.gray30}`};
  border-radius: 8px;
  overflow: auto;
  opacity: ${({ isLoading }) => (isLoading ? 0.2 : 1)};
  pointer-events: ${({ isLoading }) => (isLoading ? 'none' : 'auto')};
`;

const TableHeader = styled.div`
  height: 52px;
  padding: 13px 32px;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.gray20}`};
  display: flex;
  align-items: center;
`;

const TableHeaderTitle = styled.h6<{
  theme: any;
  marginLeft?: number;
  children: React.ReactNode;
}>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray40};
  display: flex;
  gap: 4px;
  align-items: center;
  margin: 0 0 0 ${({ marginLeft }) => `${marginLeft}px`};
`;

const ValidatorsListWrapper = styled.div`
  overflow-y: auto;
`;

const ValidatorWrapper = styled.div<{ children?: React.ReactNode }>`
  height: 58px;
  border: ${({ theme }) => `1px solid ${theme.colors.gray20}`};
  padding: 14px 32px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PublicKeyWrapper = styled.div`
  width: 33%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const PublicKey = styled.p<{ marginLeft?: number; children: React.ReactNode }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray90};
  margin-left: ${({ marginLeft }) => `${marginLeft}px`};
  display: flex;
  gap: 20px;
`;

const LinksWrapper = styled.div`
  width: 33%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 8px;
  position: static;
`;

const Link = styled.div<{
  isDarkMode: boolean;
  logo: string;
  onClick: Function;
}>`
    width: 24px;
    height: 24px;
    cursor: pointer;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: ${({ isDarkMode, logo }) => `url(${logo}${isDarkMode ? 'dark.svg' : 'light.svg'})`}
}
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoValidatorImage = styled.div`
  width: 120px;
  height: 120px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin: 50px auto 15px auto;
  background-image: url(/images/logo/no_validators.svg);
`;
const NoValidatorText = styled.div`
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray80};
  margin-bottom: 80px;
`;

export type ValidatorsListProps = {
  type: 'view' | 'select';
  onToggleAll?: Function;
  validators: IValidator[];
  selectedValidators?: string[];
  onValidatorToggle?: (publicKey: string) => void;
  infiniteScroll: UseInfiniteQueryResult<unknown>;
  isFetchingAll?: boolean;
  withoutSettings?: boolean;
  maxSelectable?: number;
  isEmpty?: boolean;
};

const ValidatorsList = ({
  type,
  onToggleAll,
  infiniteScroll,
  isFetchingAll,
  validators,
  selectedValidators = [],
  onValidatorToggle,
  maxSelectable = 100,
  withoutSettings,
  isEmpty
}: ValidatorsListProps) => {
  const isDarkMode = useAppSelector(getIsDarkMode);

  const isSelectMode = type === 'select';
  const isMaxSelected = isSelectMode && selectedValidators.length === maxSelectable;

  const dispatch = useAppDispatch();
  const copyToClipboard = (publicKey: string) => {
    navigator.clipboard.writeText(publicKey);
    dispatch(
      setMessageAndSeverity({
        message: 'Copied to clipboard.',
        severity: 'success'
      })
    );
  };

  const fetchNextPageTriggerRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersection(fetchNextPageTriggerRef, {
    root: document,
    rootMargin: '0px',
    threshold: 0
  });

  useDebounce(
    () => {
      if (intersection?.isIntersecting && infiniteScroll.hasNextPage && !infiniteScroll.isFetching) {
        infiniteScroll.fetchNextPage();
      }
    },
    100,
    [intersection?.isIntersecting, infiniteScroll]
  );

  if (isEmpty) {
    return (
      <div>
        <NoValidatorImage />
        <NoValidatorText>No Validators</NoValidatorText>
      </div>
    );
  }

  return (
    <TableWrapper id={'scrollableDiv'} isLoading={Boolean(infiniteScroll.isLoading)}>
      <TableHeader>
        {isSelectMode &&
          (isFetchingAll ? (
            <Spinner size={20} />
          ) : (
            <Checkbox
              isDisabled={infiniteScroll.isLoading}
              grayBackGround
              text={''}
              withoutMarginBottom
              smallLine
              toggleIsChecked={() => onToggleAll?.()}
              isChecked={isMaxSelected}
            />
          ))}
        <TableHeaderTitle marginLeft={isSelectMode && selectedValidators ? 20 : 0}>Public Key</TableHeaderTitle>
        <TableHeaderTitle marginLeft={isSelectMode && selectedValidators ? 227 : 279}>
          Status{' '}
          <ToolTip
            text={
              'Refers to the validator’s status in the SSV network (not beacon chain), and reflects whether its operators are consistently performing their duties (according to the last 2 epochs).'
            }
          />
        </TableHeaderTitle>
      </TableHeader>
      <ValidatorsListWrapper className="relative">
        {validators?.map((validator) => {
          const formattedPublicKey = add0x(validator.public_key);
          const isChecked = selectedValidators.includes(formattedPublicKey);
          const disabled = isSelectMode && !isChecked && isMaxSelected;
          return (
            <ValidatorWrapper key={validator.public_key}>
              <PublicKeyWrapper>
                <PublicKey>
                  {isSelectMode && (
                    <Checkbox
                      isChecked={isChecked}
                      isDisabled={disabled || isFetchingAll}
                      grayBackGround
                      text={''}
                      withTooltip={disabled}
                      tooltipText={`The maximum number of validators for bulk operation is ${maxSelectable}.`}
                      withoutMarginBottom
                      toggleIsChecked={() => onValidatorToggle?.(formattedPublicKey)}
                    />
                  )}
                  {longStringShorten(formattedPublicKey, 4, 4)}
                </PublicKey>
                <Link onClick={() => copyToClipboard(validator.public_key)} logo={'/images/copy/'} isDarkMode={isDarkMode} />
              </PublicKeyWrapper>
              <Status item={validator} />
              <LinksWrapper>
                <Settings withoutSettings={withoutSettings} validator={validator} />
              </LinksWrapper>
            </ValidatorWrapper>
          );
        })}
        {infiniteScroll.isFetching && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}
        <div ref={fetchNextPageTriggerRef} className="absolute bottom-0 h-80 w-full pointer-events-none" />
      </ValidatorsListWrapper>
    </TableWrapper>
  );
};

export default ValidatorsList;
