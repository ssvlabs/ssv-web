import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './DataSection.styles';

const DataSection = ({ data }: any) => {
    const classes = useStyles();
    return (
      <>
        {data.map((section: any, index: number) => (
          <Grid xs={12} item key={index}>
            <Grid container spacing={0}>
              {section.map((d: any, sectionIndex: number) => (
                <Grid item className={classes.section} xs={12} key={sectionIndex}>
                  <Grid container>
                    <Grid item xs={6} className={`${d.header ? classes.header : classes.subHeader}`}>
                      {d.key}
                    </Grid>
                    <Grid item xs={6} className={`${classes.dataValue}`}>
                      {d.value}{d.strong && <strong>&nbsp;{d.strong}</strong>}
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </>
    );
};
export default observer(DataSection);