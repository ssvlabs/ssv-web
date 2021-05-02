import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, Theme } from '@material-ui/core/styles';
import { useStores } from '~app/hooks/useStores';

const useStyles = makeStyles((theme: Theme) => createStyles({
  formControl: {
    margin: theme.spacing(0),
    marginTop: theme.spacing(1),
    width: '100%',
    maxWidth: '100%',
  },
  select: {
    padding: 0,
  },
  selectPaper: {
    maxWidth: 300,
    '& ul': {
      padding: 3,
      maxHeight: 400,
    },
    '& li': {
      width: 'inherit',
    },
  },
  menuItem: {
    padding: 0,
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'start',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

const OperatorName = styled.div`
  font-size: 13px;
  margin-left: 0;
`;

const OperatorKey = styled.div`
  font-size: 10px;
  margin-left: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const OperatorSelector = () => {
  const classes = useStyles();
  const { validator } = useStores();
  const [selectedOperator, selectOperator] = useState('');
  // const [operators, setOperatorsInComponent] = useState(validator.operators);

  useEffect(() => {
    // setOperatorsInComponent(validator.operators);
  }, [validator.operators]);

  const onSelectOperator = (event: any) => {
    const operatorKey = String(event.target.value);
    if (!validator.isOperatorSelected(operatorKey)) {
      if (selectedOperator) {
        validator.unselectOperator(selectedOperator);
      }
      validator.selectOperator(operatorKey);
      selectOperator(operatorKey);
    }
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
        {validator.operators.map((operator, operatorIndex) => {
          return (
            <MenuItem
              key={`menu-item-${operatorIndex}`}
              className={classes.menuItem}
              value={operator.publicKey}
              disabled={validator.isOperatorSelected(operator.publicKey)}
              >
              <OperatorName>{operator.name}</OperatorName>
              <OperatorKey>{operator.publicKey}</OperatorKey>
            </MenuItem>
            );
        })}
      </Select>
    </FormControl>
  );
};

export default observer(OperatorSelector);
