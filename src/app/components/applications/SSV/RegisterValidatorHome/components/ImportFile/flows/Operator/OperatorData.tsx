import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import OperatorCard from '~app/components/common/OperatorCard';
import {
  useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/Operator/OperatorData.styles';

const OperatorData = ({
                        operatorId, operatorLogo, hasError, name,
                        type,
                      }: {
  name: string,
  type: string | undefined,
  operatorId: string,
  operatorLogo: string,
  hasError: boolean
}) => {
  const classes = useStyles({ operatorLogo, hasError });
  const timeoutRef = useRef(null);
  const [hoveredGrid, setHoveredGrid] = useState(null);

  useEffect(() => {
    return () => {
      if (timeoutRef?.current){
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleGridHover = () => {
    // @ts-ignore
    timeoutRef.current = setTimeout(() => {
      // @ts-ignore
      setHoveredGrid(true);
    }, 300);
  };

  const handleGridLeave = () => {
    // @ts-ignore
    clearTimeout(timeoutRef.current);
    setHoveredGrid(null);
  };

  return (
    <Grid onMouseLeave={handleGridLeave} onMouseEnter={handleGridHover} className={classes.Wrapper}>
      <Grid className={classes.OperatorLogo}/>
      <Typography className={classes.OperatorId}>ID: {operatorId}</Typography>
      {hoveredGrid && (
        <OperatorCard classExtend={classes.OperatorCardExtendClass} operator={{ logo: operatorLogo, id: operatorId, name, type }}/>
      )}
    </Grid>
  );
};

export default OperatorData;