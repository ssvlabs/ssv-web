import { difference } from 'lodash';
import { useAddAuthorizedAddresses } from '~app/hooks/operator/useAddAuthorizedAddresses';
import { useDeleteAuthorizedAddresses } from '~app/hooks/operator/useDeleteAuthorizedAddresses';
import { useSetOperatorMultipleWhitelists } from '~app/hooks/operator/useSetOperatorMultipleWhitelists';
import { useSetOptimisticOperator } from '~app/hooks/operator/useSetOptimisticOperator';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';

type Mode = 'add' | 'delete' | 'view';

export const useManageAuthorizedAddresses = () => {
  const operator = useAppSelector(getSelectedOperator)!;
  const setter = useSetOperatorMultipleWhitelists();
  const navigate = useNavigate();
  const addManager = useAddAuthorizedAddresses();
  const deleteManager = useDeleteAuthorizedAddresses();
  const mode: Mode = addManager.hasAddresses ? 'add' : deleteManager.hasAddresses ? 'delete' : 'view';

  const reset = (stepBack?: boolean) => {
    addManager.form.reset();
    deleteManager.reset();
    if (stepBack) {
      navigate(-1);
    } else {
      navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.ROOT);
    }
  };

  const setOptimisticOperator = useSetOptimisticOperator();

  const update = (args: Parameters<typeof setter.mutate>[0]) => {
    setter.mutate(args, {
      onSuccess: () => {
        reset();
        const whitelistedAddresses = args.mode === 'add' ? [...(operator.whitelist_addresses || []), ...args.addresses] : difference(operator.whitelist_addresses, args.addresses);
        setOptimisticOperator({
          operator: {
            ...operator,
            whitelist_addresses: whitelistedAddresses
          },
          type: 'updated'
        });
        setTimeout(reset, 100);
      }
    });
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    switch (mode) {
      case 'add': {
        addManager.form.handleSubmit(({ addresses }) => {
          const trimmedAddresses = addresses.map((a) => a.value).filter((addr) => addr && addr.trim() !== '');
          update({ mode: 'add', operatorIds: [operator.id], addresses: trimmedAddresses });
        })(event);
        break;
      }
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
