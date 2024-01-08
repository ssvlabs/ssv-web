// const baseURL = 'https://api.example.com';
//
// const HttpService = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//     // Add any other headers you need
//   },
// });

import axios, { AxiosRequestConfig } from 'axios';

const HttpService = () => {

  // eslint-disable-next-line no-unused-vars
  enum HttpResult {
    // eslint-disable-next-line no-unused-vars
    SUCCESS,
    // eslint-disable-next-line no-unused-vars
    FAIL,
  }

  interface IHttpResponse {
    data: any | IHttpFailData;
    result: HttpResult
  }

  interface IHttpFailData {
    message: string
  }

  const httpErrorMessage = (url: string, errorCode: string, errorMessage: string, customMessage?: string) => `Http request to url ${url} ${customMessage} failed with error code ${errorCode}. Error: ${errorMessage}`;

  const httpGeneralErrorMessage = (url: string) => `Http request to url ${url} failed.`;

  const get = () => {

  };

  const put = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<IHttpResponse> => {
    try {
      const response = await axios.put(url, data, config);
      return { data: response.data, result: HttpResult.SUCCESS };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(httpErrorMessage(url, error.code!, error.message, `Data: ${JSON.stringify(data)}`));
        return { data: { message: error.response!.data }, result: HttpResult.FAIL };
      } else {
        return { data: { message: httpGeneralErrorMessage(url) }, result: HttpResult.FAIL };
      }
    }
  };

  const post = () => {
  };

  return { get, put, post, HttpResult };
};

const httpService = HttpService();
export default httpService;
