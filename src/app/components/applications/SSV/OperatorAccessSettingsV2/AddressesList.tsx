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
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';

const AddressesList = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const operator = useAppSelector(getSelectedOperator)!;
  const hasWhitelistedAddresses = (operator.whitelist_addresses || []).length > 0;
  const { addManager, deleteManager, mode, submit, reset, setter } = useManageAuthorizedAddresses();
  const isReachedMaxAddressesCount = addManager.fieldArray.fields.length >= 500;

  const addNewAddressField = () => {
    addManager.fieldArray.append({ value: '' });
    setTimeout(() => {
      formRef.current?.scrollTo({ top: formRef.current.scrollHeight, behavior: 'smooth' });
    }, 10);
  };

  const handlePaste = (index: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    const matches = text.match(/0x[a-fA-F0-9]{40}/gm) || [];
    if (matches.length > 1) {
      e.preventDefault();
      addManager.fieldArray.remove(index);
      const mapped = matches.map((value) => ({ value }));
      addManager.fieldArray.append(mapped, { shouldFocus: true });
      addManager.form.trigger('addresses');
    }
  };

  useEffect(() => {
    window.onbeforeunload = () => {
      return mode !== 'view' ? `Are you sure that you want to cancel? Any unsaved changes will be lost.` : undefined;
    };
  }, [mode]);

  return (
    <Form {...addManager.form}>
      <form onSubmit={submit} className="flex flex-col flex-1 overflow-hidden py-8 gap-9 w-[872px] mx-auto">
        <BackNavigation />
        <Card className="w-full mx-auto overflow-auto">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Authorized Addresses</h2>
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
            {mode !== 'delete' && (
              <button
                disabled={isReachedMaxAddressesCount}
                type="button"
                className="h-12 w-full text-center border border-gray-400 border-dashed rounded-lg text-gray-500 font-medium"
                onClick={addNewAddressField}
              >
                + Add Authorized Address
              </button>
            )}
          </div>

          {mode !== 'view' && (
            <div className="flex gap-2 w-full">
              <Button type="button" className="flex-1" size="xl" variant="secondary" onClick={reset} disabled={setter.isPending}>
                Cancel
              </Button>
              <Button className="flex-1" size="xl" type="submit" isActionBtn isLoading={setter.isPending} disabled={mode === 'add' && addManager.isSubmitDisabled}>
                {mode === 'delete' ? 'Remove and Save' : 'Add and Save'}
              </Button>
            </div>
          )}
        </Card>
      </form>
    </Form>
  );
};

export default AddressesList;
