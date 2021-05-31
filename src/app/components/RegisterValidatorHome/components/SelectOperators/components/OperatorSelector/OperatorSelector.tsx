import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './OperatorSelector.styles';
import ContractOperator, { IOperator } from '~app/common/stores/contract/ContractOperator.store';
import { OperatorName, OperatorKey } from './components/Operator';

type OperatorSelectorProps = {
  indexedOperator: IOperator,
  dataTestId: string
};

const OperatorSelector = ({ indexedOperator, dataTestId }: OperatorSelectorProps) => {
  const classes = useStyles();
  const stores = useStores();
  const contractOperator: ContractOperator = stores.ContractOperator;
  const [selectedOperator, selectOperator] = useState('');

  const selectOperatorMethod = (publicKey: string) => {
    if (selectedOperator) {
      contractOperator.unselectOperator(selectedOperator);
    }
    contractOperator.selectOperator(publicKey);
    selectOperator(publicKey);
  };

  useEffect(() => {
    if (indexedOperator.selected && indexedOperator.autoSelected && indexedOperator.pubkey !== selectedOperator) {
      selectOperatorMethod(indexedOperator.pubkey);
    }
  });

  const onSelectOperator = (event: any) => {
    const operatorKey = String(event.target.value);
    selectOperatorMethod(operatorKey);
  };
  const operatorKeySeralize = (publicKey: string) => {
    return `${publicKey.substr(0, 6)}..${publicKey.substr(publicKey.length - 4, 4)}`;
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      {!selectedOperator && (
        <InputLabel id="operator-select-label" shrink variant="filled">
          Select Operator
        </InputLabel>
      )}
      <Select
        data-testid={dataTestId}
        className={classes.select}
        labelId="operator-select-label"
        value={selectedOperator}
        onChange={onSelectOperator}
        variant="outlined"
        MenuProps={{ classes: { paper: classes.selectPaper } }}
      >
        {contractOperator.operators.map((operator: IOperator, operatorIndex: number) => {
          return (
            <MenuItem
              key={`menu-item-${operatorIndex}`}
              className={classes.menuItem}
              value={operator.pubkey}
              disabled={contractOperator.isOperatorSelected(operator.pubkey)}
              >
              <OperatorName>{operator.name}</OperatorName>
              <OperatorKey>{operatorKeySeralize(operator.ownerAddress)}</OperatorKey>
            </MenuItem>
            );
        })}
      </Select>
    </FormControl>
  );
};

export default observer(OperatorSelector);
