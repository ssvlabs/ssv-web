import { OperatorStatusBadge } from '~app/components/applications/SSV/OperatorAccessSettingsV2/OperatorStatusBadge';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import BorderScreen from '~app/components/common/BorderScreen';
import { Alert, AlertDescription } from '~app/components/ui/alert';
import { Button } from '~app/components/ui/button';
import { useSetOperatorVisibility } from '~app/hooks/operator/useSetOperatorVisibility';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';

const OperatorStatus = () => {
  const operator = useAppSelector(getSelectedOperator)!;
  const isFeeZero = !Number(operator.fee);
  const switchLabel = operator.is_private ? 'Public' : 'Private';

  const setOperatorVisibility = useSetOperatorVisibility();

  return (
    <BorderScreen
      blackHeader
      width={872}
      body={[
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold">Operator Status</h1>
            <div className="flex flex-col gap-3 font-medium text-sm text-gray-700">
              <p>Control validator access by switching between public and private modes.</p>
              <ul className="list-disc pl-6">
                <li>
                  <span className="font-bold">Public mode</span> - Any validator can register with the operator.
                </li>
                <li>
                  <span className="font-bold">Private mode</span> - Only whitelisted addresses can register.
                </li>
              </ul>
              <p className="font-medium text-sm pt-3">
                Please note that switching to private only impacts future validator registrations and will not affect validators that the operator already manages.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-100 px-6 py-5 rounded-lg">
            <OperatorDetails operator={operator} />
            <OperatorStatusBadge isPrivate={operator.is_private} />
          </div>
          {isFeeZero && operator.is_private && (
            <Alert variant="error">
              <AlertDescription>You cannot switch your operator to public mode when you have a set fee of 0.</AlertDescription>
            </Alert>
          )}
          <Button
            disabled={isFeeZero && operator.is_private}
            size="xl"
            className="w-full"
            isLoading={setOperatorVisibility.isPending}
            isActionBtn
            onClick={() =>
              setOperatorVisibility.mutate({
                isPrivate: !operator.is_private,
                operatorIds: [operator.id]
              })
            }
          >
            Switch to {switchLabel}
          </Button>
        </div>
      ]}
    />
  );
};

export default OperatorStatus;
