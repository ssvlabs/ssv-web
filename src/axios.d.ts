import "axios";

declare module "axios" {
  export interface AxiosInstance extends Axios {
    <T = unknown, D = unknown>(config: AxiosRequestConfig<D>): Promise<T>;
    <T = unknown, D = unknown>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    getUri(config?: AxiosRequestConfig): string;
    request<T = unknown, D = unknown>(
      config: AxiosRequestConfig<D>,
    ): Promise<T>;
    get<T = unknown, D = unknown>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    delete<T = unknown, D = unknown>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    head<T = unknown, D = unknown>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    options<T = unknown, D = unknown>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    post<T = unknown, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    put<T = unknown, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    patch<T = unknown, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    postForm<T = unknown, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    putForm<T = unknown, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    patchForm<T = unknown, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
  }
}
