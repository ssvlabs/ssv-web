import { TransactionPendingPopUp } from '~app/components/applications/SSV/TransactionPendingPopUp';
import { useStyles } from '~app/components/common/Layout/Layout.styles';
import { cn } from '~lib/utils/tailwind';
import ModalPopUp from '~app/components/common/ModalPopUp/ModalPopUp.tsx';

const Layout = ({ children }: any) => {
  const classes = useStyles();

  return (
    <>
      <div className={cn(classes.Root, 'flex flex-col h-screen overflow-auto pb-6')}>{children}</div>
      <TransactionPendingPopUp />
      <ModalPopUp />
    </>
  );
};

export default Layout;
