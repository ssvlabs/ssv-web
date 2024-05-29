import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import BorderScreen from '~app/components/common/BorderScreen';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';

const OperatorStatus = () => {
  const selectedOperator = useAppSelector(getSelectedOperator);

  return (
    <BorderScreen
      blackHeader
      width={872}
      body={[
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">Operator Status</h1>
            <p>
              Switch between public and private statuses for the operator.
              <br />
              Set the operator to private to enforce whitelisted addresses.
            </p>
          </div>
          <OperatorDetails operator={selectedOperator} />
        </div>
      ]}
    />
  );
};

export default OperatorStatus;
