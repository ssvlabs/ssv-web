import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Card } from '~app/atomicComponents/Card';
import { DeletableAddress } from '~app/components/applications/SSV/OperatorAccessSettingsV2/DeletableAddress';
import BackNavigation from '~app/components/common/BackNavigation';
import { Alert, AlertDescription } from '~app/components/ui/alert';
import { Button } from '~app/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~app/components/ui/form';
import { Input } from '~app/components/ui/input';
import { useManageAuthorizedAddresses } from '~app/hooks/operator/useManageAuthorizedAddresses';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';
import styled from 'styled-components';
import { setModalPopUp } from '~app/redux/appState.slice.ts';
import { ErrorButton, PrimaryButton, SecondaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum.ts';
import { Tooltip } from '~app/components/ui/tooltip';

const SelectedIndicator = styled.div`
  margin: 0;
  height: 32px;
  border-radius: 8px;
  padding: 3px 8px;
  background-color: ${({ theme }) => theme.colors.tint90};
  color: ${({ theme }) => theme.colors.primaryBlue};
  font-size: 16px;
  font-weight: 500;
  cursor: default;
`;

const AddAddressButton = styled.button<{ disabled: boolean }>`
  height: 48px !important;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px dashed #c0c0c0;
  border-radius: 0.5rem;
  color: ${({ theme, disabled }) => (disabled ? theme.colors.gray30 : theme.colors.gray40)};
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  background-color: ${({ disabled, theme }) => (disabled ? theme.colors.gray0 : theme.colors.white)};
`;

const AddressesList = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const operator = useAppSelector(getSelectedOperator)!;
  const dispatch = useAppDispatch();
  const whitelistedAddressesCount = (operator.whitelist_addresses || []).length;
  const hasWhitelistedAddresses = whitelistedAddressesCount > 0;
  const { addManager, deleteManager, mode, submit, reset, setter } = useManageAuthorizedAddresses();
  const totalCount = addManager.fieldArray.fields.length + whitelistedAddressesCount;
  const isReachedMaxAddressesCount = totalCount >= 500;

  const addNewAddressField = () => {
    if (!addManager.hasEmptyAddresses && !addManager.form.formState.errors.addresses) {
      addManager.fieldArray.append({ value: '' });
      setTimeout(() => {
        formRef.current?.scrollTo({ top: formRef.current.scrollHeight, behavior: 'smooth' });
      }, 10);
    }
  };

  const currentAddressesCount =
    deleteManager.addresses.length > 0 ? whitelistedAddressesCount - deleteManager.addresses.length : whitelistedAddressesCount + addManager.validNewAddressesCount;

  const getButtonText = () => {
    const count = mode === 'delete' ? deleteManager.addresses.length : addManager.validNewAddressesCount;
    const action = mode === 'delete' ? 'Remove' : 'Add';
    return `${action} ${count > 1 ? count : ''} Address${count > 1 ? 'es' : ''}`;
  };

  const handlePaste = (index: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    const matches = text.match(/0x[a-fA-F0-9]{40}/gm) || [];
    if (whitelistedAddressesCount + addManager.validNewAddressesCount + matches.length > 500) {
      dispatch(
        setModalPopUp({
          title: 'Limit Exceeded',
          text: ['It appears that you tried to paste more than 500 addresses at once.', 'Please select up to 500 addresses and try again.'],
          buttons: [
            {
              component: ErrorButton,
              props: { text: 'Close', size: ButtonSize.XL, onClick: () => dispatch(setModalPopUp(null)) }
            }
          ]
        })
      );
      return;
    }
    if (matches.length > 1) {
      e.preventDefault();
      addManager.fieldArray.remove(index);
      const mapped = matches.map((value) => ({ value }));
      addManager.fieldArray.append(mapped, { shouldFocus: true });
      addManager.form.trigger('addresses');
    }
  };

  const showPopUp = () =>
    dispatch(
      setModalPopUp({
        title: 'Unsaved Changes',
        text: ['Are you sure that you want to discard changes?', 'Any unsaved changes will be lost.'],
        width: 480,
        buttons: [
          {
            component: PrimaryButton,
            props: {
              text: 'Discard',
              size: ButtonSize.MD,
              onClick: () => {
                reset(true);
                dispatch(setModalPopUp(null));
              }
            }
          },
          {
            component: SecondaryButton,
            props: { text: 'Cancel', size: ButtonSize.MD, onClick: () => dispatch(setModalPopUp(null)) }
          }
        ]
      })
    );

  useEffect(() => {
    window.onbeforeunload = () => {
      return mode !== 'view' ? `Are you sure that you want to cancel? Any unsaved changes will be lost.` : undefined;
    };
  }, [mode]);

  return (
    <Form {...addManager.form}>
      <form onSubmit={submit} className="flex flex-col flex-1 overflow-hidden py-6 gap-6 w-[872px] mx-auto">
        <BackNavigation
          isDefaultBack={!addManager.hasAddresses && !deleteManager.hasAddresses}
          onClick={() => {
            if (addManager.hasAddresses || deleteManager.hasAddresses) {
              showPopUp();
            }
          }}
        />
        <Card className="w-full h-416px my-2 mx-auto overflow-auto">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <h2 className="text-xl font-bold">Authorized Addresses</h2>
              </div>
              {currentAddressesCount > 0 && (
                <Tooltip hasArrow content={'The maximum number of addresses for whitelist is 500'}>
                  <SelectedIndicator>{currentAddressesCount} of 500 Addresses</SelectedIndicator>{' '}
                </Tooltip>
              )}
            </div>
            <p className="text-sm font-medium text-gray-700">
              Manage the owner addresses that are authorized to register validators to your operator.
              <br />
              Whitelisted addresses are effective only when your operator status is set to Private.
            </p>
          </div>
          {(mode === 'add' || hasWhitelistedAddresses) && !operator.is_private && (
            <Alert variant="warning">
              <AlertDescription>
                In order to enforce whitelisted addresses, make sure to switch the <span className="font-bold">Operator Status</span> to <span className="font-bold">Private.</span>
              </AlertDescription>
            </Alert>
          )}
          <div ref={formRef} className="space-y-3 overflow-auto">
            {operator.whitelist_addresses?.map((address) => (
              <DeletableAddress
                key={address}
                address={address}
                onDelete={deleteManager.add}
                onUndo={deleteManager.remove}
                isMarked={deleteManager.isMarked(address)}
                disabled={mode === 'add'}
              />
            ))}
            {addManager.fieldArray.fields.map((field, index) => (
              <FormField
                key={field.id}
                control={addManager.form.control}
                name={`addresses.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        onPaste={handlePaste(index)}
                        rightSlot={
                          <Button variant="ghost" size="icon" onClick={() => addManager.fieldArray.remove(index)}>
                            <X className="size-5" />
                          </Button>
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-error-500" />
                  </FormItem>
                )}
              />
            ))}
            {addManager.form.formState.errors.addresses && <FormMessage className="text-error-500">{addManager.form.formState.errors.addresses.message}</FormMessage>}
          </div>
          {mode !== 'delete' && !isReachedMaxAddressesCount && (
            <div>
              <Tooltip
                childrenWrapperClassName="w-full"
                hasArrow
                content={addManager.hasEmptyAddresses || !!addManager.form.formState.errors.addresses ? 'In order to add another address, you must enter a valid address' : null}
              >
                <AddAddressButton disabled={addManager.hasEmptyAddresses || !!addManager.form.formState.errors.addresses} onClick={addNewAddressField}>
                  + Add Authorized Address
                </AddAddressButton>
              </Tooltip>
            </div>
          )}
          {mode !== 'view' && (
            <div className="flex gap-2 w-full">
              <Button type="button" className="flex-1" size="xl" variant="secondary" onClick={showPopUp} disabled={setter.isPending}>
                Cancel
              </Button>
              <Button className="flex-1" size="xl" type="submit" isActionBtn isLoading={setter.isPending} disabled={mode === 'add' && addManager.isSubmitDisabled}>
                {getButtonText()}
              </Button>
            </div>
          )}
        </Card>
      </form>
    </Form>
  );
};

export default AddressesList;
