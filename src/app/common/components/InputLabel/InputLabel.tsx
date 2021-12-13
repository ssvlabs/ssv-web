import React from 'react';
// import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Tooltip from '~app/common/components/ToolTip/ToolTip';
import { useStyles } from './InputLable.styles';

// const InputLabelWrapper = styled.div`
// `;
//
// const InputHeader = styled.div`
//   width: 100%;
//   height: 16px;
//   display: flex;
//   font-size: 14px;
//   font-weight: 600;
//   text-align: left;
//   line-height: 1.14;
//   margin-bottom: 5px;
//   font-style: normal;
//   align-items: center;
//   font-stretch: normal;
//   color: var(--gray-40);
//   letter-spacing: normal;
// `;
//
// const Header = styled.p`
//   font-style: normal;
//   font-weight: bold;
//   white-space: nowrap;
//   display: inline-flex;
//   font-size: 12px;
//   color: #A1ACBE;
//   margin: 0;
//   text-transform: uppercase;
// `;
// const SubHeader = styled.p`
//   margin: 0 0 0 5px;
//   font-style: normal;
//   font-weight: 500;
//   white-space: nowrap;
//   text-transform: none;
//   display: inline-flex;
//   font-size: 14px;
//   color: #A1ACBE;
// `;

type InputLabelProps = {
  children?: any,
  title?: string,
  subTitle?: string,
  withHint?: boolean,
  toolTipText?: string,
  toolTipLink?: string
};

const InputLabel = ({ children, title, subTitle, withHint, toolTipText, toolTipLink }: InputLabelProps) => {
  children;
  subTitle;
  const classes = useStyles();
    return (
      <Grid container className={classes.Wrapper}>
        <Grid item className={classes.Text}>
          {title}
        </Grid>
        {withHint && (
        <Grid item>
          <Tooltip text={toolTipText} link={toolTipLink} />
        </Grid>
        )}
      </Grid>
    );
  // return (
  //   <InputLabelWrapper>
  //     <InputHeader>
  //       <Header>{title}</Header>
  //       <SubHeader>{subTitle}</SubHeader>
  //       {withHint && <Tooltip text={toolTipText} link={toolTipLink} />}
  //     </InputHeader>
  //     {children}
  //   </InputLabelWrapper>
  // );
};

export default InputLabel;
