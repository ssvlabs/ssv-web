import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './DataSection.styles';

const DataSection = ({ data }: any) => {
    const classes = useStyles();
    return (
      <>
        {data.map((section: any, index: number) => (
          <Grid xs={12} item key={index} style={{ marginBottom: index === 0 ? '20px' : '0px' }}>
            <Grid container spacing={0}>
              {section.map((d: any, sectionIndex: number) => (
                <Grid item className={classes.section} xs={12} key={sectionIndex}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography className={`${d.header ? classes.header : classes.subHeader} ${d.key === 'Total' ? classes.total : ''}`}>{d.key}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        className={`${classes.dataValue} ${d.key === 'Total' ? classes.total : ''}`}
                      >
                        {d.value}{d.strong && <strong>&nbsp;{d.strong}</strong>}
                      </Typography>
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