import { useRef } from 'react';
import { Card } from '~app/atomicComponents/Card';
import { DeletableAddress } from '~app/components/applications/SSV/OperatorAccessSettingsV2/DeletableAddress';
import BackNavigation from '~app/components/common/BackNavigation';
import { Button } from '~app/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~app/components/ui/form';
import { Input } from '~app/components/ui/input';
import { useManageAuthorizedAddresses } from '~app/hooks/operator/useManageAuthorizedAddresses';
import { useOperatorPermissions } from '~app/hooks/operator/useOperatorPermissions';

const AddressesList = () => {
  const { addresses } = useOperatorPermissions();
  const { addManager, deleteManager, mode, submit, reset } = useManageAuthorizedAddresses();

  const formRef = useRef<HTMLDivElement>(null);

  return (
    <Form {...addManager.form}>
      <form onSubmit={submit} className="flex flex-col flex-1 overflow-hidden py-8 gap-9 w-[872px] mx-auto">
        <BackNavigation />
        <Card className="w-full mx-auto overflow-auto">
          <div>
            <h2 className="text-xl font-bold">Authorized Addresses</h2>
            <p className="text-sm font-medium">Add Ethereum addresses to the whitelist for authorization</p>
          </div>
          <div ref={formRef} className="space-y-3 overflow-auto">
            {addresses?.map((address) => (
              <DeletableAddress
                key={address}
                address={address}
                onDelete={deleteManager.add}
                onUndo={deleteManager.remove}
                isMarked={deleteManager.isMarked(address)}
                disabled={mode == 'add'}
              />
            ))}
            {addManager.fieldArray.fields.map((item, index) => (
              <FormField
                control={addManager.form.control}
                name={`addresses.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-error-500" />
                  </FormItem>
                )}
              />
            ))}
            {mode !== 'delete' && (
              <button
                type="button"
                className="h-12 w-full text-center border border-gray-400 border-dashed rounded-lg text-gray-500 font-medium"
                onClick={() => {
                  addManager.fieldArray.append({ value: '' });
                  setTimeout(() => {
                    formRef.current?.scrollTo({ top: formRef.current.scrollHeight, behavior: 'smooth' });
                  }, 10);
                }}
              >
                + Add Authorized Address
              </button>
            )}
          </div>

          {mode !== 'view' && (
            <div className="flex gap-2 w-full">
              <Button type="button" className="flex-1" size="lg" variant="secondary" onClick={reset}>
                Cancel
              </Button>
              <Button className="flex-1" size="lg" type="submit">
                Save
              </Button>
            </div>
          )}
        </Card>
      </form>
    </Form>
  );
};

export default AddressesList;
