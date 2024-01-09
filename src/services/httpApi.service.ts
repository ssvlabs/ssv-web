import axios, { AxiosRequestConfig } from 'axios';

enum HttpResult {
  SUCCESS,
  FAIL,
}

interface IHttpResponse {
  error: string | null;
  data: any | null;
  result: HttpResult
}

const httpErrorMessage = (url: string, errorCode: string, errorMessage: string, customMessage?: string) => `Http request to url ${url} ${customMessage} failed with error code ${errorCode}. Error: ${errorMessage}`;

const httpGeneralErrorMessage = (url: string) => `Http request to url ${url} failed.`;

const get = () => {
};

const put = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<IHttpResponse> => {
  try {
    const response = await axios.put(url, data, config);
    return { error: null, data: response.data, result: HttpResult.SUCCESS };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(httpErrorMessage(url, error.code!, error.message, `Data: ${JSON.stringify(data)}`));
      return { error: error.response!.data, data: null, result: HttpResult.FAIL };
    } else {
      return { error: httpGeneralErrorMessage(url), data: null, result: HttpResult.FAIL };
    }
  }
};

function isSuccessful(httpResponse: IHttpResponse) {
  return httpResponse.data && !httpResponse.error;
}

const post = () => {
};

export { put, HttpResult, isSuccessful };
