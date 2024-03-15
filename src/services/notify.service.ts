import Notify, { InitOptions } from 'bnc-notify';
import config from '~app/common/config';

const notifyServiceFactory = () => {
  let service: any;

  const init = (connectedChainId: string) => {
    const notifyOptions = {
      networkId: Number(connectedChainId),
      dappId: config.ONBOARD.API_KEY,
      desktopPosition: 'topRight',
    };
    service = Notify(notifyOptions as InitOptions);
  };

  const hash = (txHash: string) => {
    if (service) {
      service.hash(txHash);
    }
  };

  return { init, hash };
};

const notifyService = notifyServiceFactory();

export default notifyService;
