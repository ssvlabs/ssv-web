import { useAddAuthorizedAddresses } from '~app/hooks/operator/useAddAuthorizedAddresses';
import { useDeleteAuthorizedAddresses } from '~app/hooks/operator/useDeleteAuthorizedAddresses';

type Mode = 'add' | 'delete' | 'view';

export const useManageAuthorizedAddresses = () => {
  const addManager = useAddAuthorizedAddresses();
  const deleteManager = useDeleteAuthorizedAddresses();
  const mode: Mode = addManager.hasAddresses ? 'add' : deleteManager.hasAddresses ? 'delete' : 'view';

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    switch (mode) {
      case 'add':
        addManager.form.handleSubmit(console.log)(event);
        break;
      case 'delete':
        console.log('delete', deleteManager.addresses);
        break;
    }
  };

  return {
    addManager,
    deleteManager,
    mode,
    submit,
    reset: () => {
      addManager.form.reset();
      deleteManager.reset();
    }
  };
};
