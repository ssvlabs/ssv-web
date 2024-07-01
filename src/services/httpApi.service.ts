import axios, { AxiosRequestConfig } from 'axios';
import { retryWithDelay } from '~app/decorators/retriable.decorator';

enum HttpResult {
  SUCCESS,
  FAIL
}

export interface IHttpResponse<T> {
  error: string | null;
  data: T | null;
  result: HttpResult;
}

const RETRY_CONFIG = {
  default: {
    maxAttempts: 5,
    backOff: 500,
    exponentialOption: {
      maxInterval: 5000,
      multiplier: 2
    }
  }
};

const httpErrorMessage = (url: string, errorCode: string, errorMessage: string, customMessage?: string) =>
  `Http request to url ${url} ${customMessage} failed with error code ${errorCode}. Error: ${errorMessage}`;

const httpGeneralErrorMessage = (url: string) => `Http request to url ${url} failed.`;

const formatError = (error: unknown, url: string) => {
  if (axios.isAxiosError(error)) {
    return { error: error.response!.data, data: null, result: HttpResult.FAIL };
  } else {
    return {
      error: httpGeneralErrorMessage(url),
      data: null,
      result: HttpResult.FAIL
    };
  }
};

const putRequest = async <T>(url: string, data?: any, requestConfig?: AxiosRequestConfig): Promise<IHttpResponse<T>> => {
  try {
    const response = await axios.put(url, data, requestConfig);
    return { error: null, data: response.data, result: HttpResult.SUCCESS };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.message, data: null, result: HttpResult.FAIL };
    } else {
      return {
        error: httpGeneralErrorMessage(url),
        data: null,
        result: HttpResult.FAIL
      };
    }
  }
};

const getRequest = async (url: string, skipRetry: boolean = true) => {
  try {
    return (await axios.get(url)).data;
  } catch (e) {
    if (skipRetry) {
      return null;
    }
    return await retryWithDelay({
      caller: async () => (await axios.get(url)).data,
      ...RETRY_CONFIG.default
    });
  }
};

const postRequest = async <T>(url: string, body: unknown, shouldThrow = false): Promise<IHttpResponse<T>> => {
  try {
    const response = await axios.post(url, body);
    return { error: null, data: response.data, result: HttpResult.SUCCESS };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(httpErrorMessage(url, error.code!, error.message, `Body: ${JSON.stringify(body)}`));
    }
    if (shouldThrow) {
      throw error;
    }

    return formatError(error, url);
  }
};

export { putRequest, getRequest, postRequest };
