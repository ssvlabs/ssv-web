import { useAddAuthorizedAddresses } from '~app/hooks/operator/useAddAuthorizedAddresses';
import { useDeleteAuthorizedAddresses } from '~app/hooks/operator/useDeleteAuthorizedAddresses';
import { useSetOperatorMultipleWhitelists } from '~app/hooks/operator/useSetOperatorMultipleWhitelists';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';

type Mode = 'add' | 'delete' | 'view';

export const useManageAuthorizedAddresses = () => {
  const operator = useAppSelector(getSelectedOperator)!;
  const setter = useSetOperatorMultipleWhitelists();

  const addManager = useAddAuthorizedAddresses();
  const deleteManager = useDeleteAuthorizedAddresses();
  const mode: Mode = addManager.hasAddresses ? 'add' : deleteManager.hasAddresses ? 'delete' : 'view';

  const reset = () => {
    addManager.form.reset();
    deleteManager.reset();
  };

  const update = (args: Parameters<typeof setter.mutate>[0]) => {
    setter.mutate(args, {
      onSuccess: () => {
        reset();
      }
    });
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    switch (mode) {
      case 'add':
        addManager.form.handleSubmit(({ addresses }) => {
          update({ mode: 'add', operatorIds: [operator.id], addresses: addresses.map((a) => a.value) });
        })(event);
        break;
      case 'delete':
        update({
          mode: 'delete',
          operatorIds: [operator.id],
          addresses: deleteManager.addresses
        });
        break;
    }
  };

  return {
    addManager,
    deleteManager,
    mode,
    submit,
    reset,
    update,
    setter
  };
};
