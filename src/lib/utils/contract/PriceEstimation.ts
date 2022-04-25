import config from '~app/common/config';
import ApiRequest, { RequestData } from '~lib/utils/ApiRequest';

class PriceEstimation {
  estimateGasInUSD(estimationGas: number): Promise<number> {
    const requestInfo: RequestData = {
      url: String(config.links.LINK_COIN_EXCHANGE_API),
      method: 'GET',
      headers: [{ name: 'X-CoinAPI-Key', value: String(config.COIN_KEY.COIN_EXCHANGE_KEY) }],
      errorCallback: () => {},
    };
    return new ApiRequest(requestInfo)
      .sendRequest()
      .then((response: any) => {
        return estimationGas * response.rate;
      });
  }
}

export default PriceEstimation;
