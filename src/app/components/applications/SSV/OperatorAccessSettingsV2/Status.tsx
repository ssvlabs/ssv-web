import { useMutation } from '@tanstack/react-query';
import { OperatorStatusBadge } from '~app/components/applications/SSV/OperatorAccessSettingsV2/OperatorStatusBadge';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import BorderScreen from '~app/components/common/BorderScreen';
import { Alert, AlertDescription } from '~app/components/ui/alert';
import { Button } from '~app/components/ui/button';
import { useAppSelector } from '~app/hooks/redux.hook';
import { useTransactionExecutor } from '~app/hooks/useTransactionExecutor';
import { EContractName } from '~app/model/contracts.model';
import { getSelectedOperator } from '~app/redux/account.slice';
import { getContractByName } from '~root/wagmi/utils';

const OperatorStatus = () => {
  const operator = useAppSelector(getSelectedOperator);
  const isFeeZero = !Number(operator.fee);

  const executor = useTransactionExecutor();

  const switchLabel = operator.isPrivate ? 'Public' : 'Private';

  const switcher = useMutation({
    mutationFn: () => {
      const contract = getContractByName(EContractName.SETTER);
      console.log('contract:', contract);
      return executor({
        contractMethod: operator.isPrivate
          ? contract.setOperatorsPrivateUnchecked
          : contract.setOperatorsPublicUnchecked,
        payload: [[operator.id]]
      });
    }
  });

  return (
    <BorderScreen
      blackHeader
      width={872}
      body={[
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">Operator Status</h1>
            <p>
              Switch between public and private statuses for the operator.
              <br />
              Set the operator to private to enforce whitelisted addresses.
            </p>
          </div>
          <div className="flex items-center justify-between bg-gray-100 px-6 py-5 rounded-lg">
            <OperatorDetails operator={operator} />
            <OperatorStatusBadge isPrivate={operator.isPrivate} />
          </div>
          {isFeeZero && operator.isPrivate && (
            <Alert variant="error">
              <AlertDescription>
                Switching the operator to public when the fee is set to 0 is not possible.{' '}
              </AlertDescription>
            </Alert>
          )}
          <Button
            disabled={isFeeZero && operator.isPrivate}
            size="xl"
            className="w-full"
            isLoading={switcher.isPending}
            onClick={() => switcher.mutate()}
          >
            Switch to {switchLabel}
          </Button>
        </div>
      ]}
    />
  );
};

export default OperatorStatus;
