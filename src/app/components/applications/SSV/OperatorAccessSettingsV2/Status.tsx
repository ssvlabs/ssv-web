import { OperatorStatusBadge } from '~app/components/applications/SSV/OperatorAccessSettingsV2/OperatorStatusBadge';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import BorderScreen from '~app/components/common/BorderScreen';
import { Alert, AlertDescription } from '~app/components/ui/alert';
import { Button } from '~app/components/ui/button';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';

const OperatorStatus = () => {
  const selectedOperator = useAppSelector(getSelectedOperator);

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
            <OperatorDetails operator={selectedOperator} />
            <OperatorStatusBadge isPrivate />
          </div>
          <Alert variant="warning">
            <AlertDescription>
              Switching the operator to public when the fee is set to 0 is not possible.{' '}
            </AlertDescription>
          </Alert>
          <Button size="lg" className="w-full h-[60px]">
            Switch to Private
          </Button>
        </div>
      ]}
    />
  );
};

export default OperatorStatus;
