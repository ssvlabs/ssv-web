import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Select from '@material-ui/core/Select';
import { useStores } from '~app/hooks/useStores';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import SSVStore, { IOperator } from '~app/common/stores/SSV.store';
import { useStyles } from './OperatorSelector.styles';
import { OperatorName, OperatorScore, OperatorKey } from './components/Operator';

type OperatorSelectorProps = {
  indexedOperator: IOperator
};

const OperatorSelector = ({ indexedOperator }: OperatorSelectorProps) => {
  const classes = useStyles();
  const stores = useStores();
  const ssv: SSVStore = stores.ssv;
  const [selectedOperator, selectOperator] = useState('');

  const selectOperatorMethod = (publicKey: string) => {
    if (!ssv.isOperatorSelected(publicKey)) {
      if (selectedOperator) {
        ssv.unselectOperator(selectedOperator);
      }
      ssv.selectOperator(publicKey);
      selectOperator(publicKey);
    }
  };

  useEffect(() => {
    console.debug('indexedOperator: ', indexedOperator);
    if (indexedOperator.selected && indexedOperator.autoSelected && indexedOperator.publicKey !== selectedOperator) {
      selectOperatorMethod(indexedOperator.publicKey);
    }
  });

  const onSelectOperator = (event: any) => {
    const operatorKey = String(event.target.value);
    selectOperatorMethod(operatorKey);
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      {!selectedOperator && (
        <InputLabel id="operator-select-label" shrink variant="filled">
          Select Operator
        </InputLabel>
      )}
      <Select
        className={classes.select}
        labelId="operator-select-label"
        value={selectedOperator}
        onChange={onSelectOperator}
        variant="outlined"
        MenuProps={{ classes: { paper: classes.selectPaper } }}
      >
        {ssv.operators.map((operator: IOperator, operatorIndex: number) => {
          return (
            <MenuItem
              key={`menu-item-${operatorIndex}`}
              className={classes.menuItem}
              value={operator.publicKey}
              disabled={ssv.isOperatorSelected(operator.publicKey)}
              >
              <OperatorName>{operator.name}</OperatorName>
              <OperatorScore>Score: {operator.score}</OperatorScore>
              <OperatorKey>{operator.publicKey}</OperatorKey>
            </MenuItem>
            );
        })}
      </Select>
    </FormControl>
  );
};

export default observer(OperatorSelector);
