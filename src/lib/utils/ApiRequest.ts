export interface RequestInfo {
    url: string,
    method: string,
    headers: HeaderInfo[],
}
export interface HeaderInfo {
    name: string,
    value: string,
}

export default class ApiRequest {
    private readonly url: string = '';
    private readonly method: string = '';
    private readonly header: HeaderInfo[];
    private readonly xhr: XMLHttpRequest = new XMLHttpRequest();

    constructor(request:RequestInfo) {
        this.url = request.url;
        this.method = request.method;
        this.header = request.headers;
    }

    sendRequest() {
       return new Promise((resolve, reject) => {
           this.xhr.addEventListener('load', () => {
                resolve(JSON.parse(this.xhr.responseText));
           });

           this.xhr.addEventListener('error', () => {
               reject(JSON.parse(this.xhr.responseText));
           });

           // open the request with the verb and the url
           this.xhr.open(this.method, this.url);
           // attach the request with header
           Object.keys(this.header).forEach((header: any) => this.xhr.setRequestHeader(header.name, header.value));
           // send the request
           this.xhr.send();
        });
    }
}