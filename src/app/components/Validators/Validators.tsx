import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useStores } from '~app/hooks/useStores';
import Spinner from '~app/common/components/Spinner';
import { useStyles } from '~app/components/Validators/Validators.styles';

const Validators = () => {
  const classes = useStyles();
  const { validators } = useStores();

  // Load validators if not loaded yet
  useEffect(() => {
    if (!validators.isLoading && !validators.validators?.length) {
      validators.load();
    }
  }, [validators.validators, validators.isLoading, validators]);

  return (
    <Grid item xs={12} md={6}>
      <h1 className={classes.header}>Validators</h1>
      {validators.isLoading ? <Spinner /> : ''}
      {!validators.isLoading ?
        (
          <Paper className={classes.paper}>
            <List>
              {validators.validators.map((value: { validator: string, id: any }) => {
                const labelId = `checkbox-list-label-${value.id}`;
                return (
                  <ListItem key={value.id} role={undefined} dense button>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value.validator} />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        ) : ''}
    </Grid>
  );
};

export default observer(Validators);
