export interface RequestData {
  url: string,
  method: string,
  headers?: RequestHeader[],
  data?: FormData | object,
  errorCallback: () => any
}

export interface RequestHeader {
  name: string,
  value: string,
}

export default class ApiRequest {
  private readonly url: string = '';
  private readonly method: string = '';
  private readonly headers: RequestHeader[];
  private readonly errorCallback: (() => any);
  private readonly data: FormData | object | null = null;
  private readonly xhr: XMLHttpRequest = new XMLHttpRequest();

  constructor(request: RequestData) {
    this.url = request.url;
    this.method = request.method;
    this.data = request.data ?? null;
    this.headers = request.headers ?? [];
    this.errorCallback = request.errorCallback;
  }

  sendRequest() {
    return new Promise((resolve => resolve({})));
  }
}
