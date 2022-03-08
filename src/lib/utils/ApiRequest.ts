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
    return new Promise((resolve) => {
      this.xhr.addEventListener('load', () => {
        resolve(JSON.parse(this.xhr.responseText));
      });
      this.xhr.addEventListener('error', () => {
        resolve(this.errorCallback());
      });

      // Open the request with the verb and the url
      this.xhr.open(this.method, this.url);
      // Attach the request with headers
      this.headers.forEach((header: RequestHeader) => {
        this.xhr.setRequestHeader(header.name, header.value);
      });

      // Send the request
      if (this.data) {
        if (this.data instanceof FormData) {
          this.xhr.send(this.data);
        } else {
          this.xhr.send(JSON.stringify(this.data));
        }
        return;
      }
      this.xhr.send();
    });
  }
}
