import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './DataSection.styles';

const DataSection = ({ data }: any) => {
    const classes = useStyles();
    classes;
    return (
      // <Grid container item>
      //   {data.map((section: any, index: number) => (
      //     <Grid container item key={index}>
      //       {section.map((d: any, sectionIndex: number) => (
      //         <Grid item className={classes.Section} key={sectionIndex}>
      //           {d.key}
      //           {d.value}
      //         </Grid>
      //       ))}
      //     </Grid>
      //   ))}
      // </Grid>
      <Grid container item>
        {data.map((section: any, index: number) => (
          <Grid container item key={index} xs={12}>
            {section.map((d: any, sectionIndex: number) => (
              <Grid item xs={12} className={classes.Section} key={sectionIndex}>
                <Grid item xs={6}>
                  sd
                </Grid>
                <Grid item xs={6}>
                  sda
                </Grid>
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    );
};
export default observer(DataSection);