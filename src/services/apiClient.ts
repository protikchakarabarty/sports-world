import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';

export class ApiError extends Error {
  status?: number;
  code?: string;
  url?: string;
  headers?: Record<string, string>;
  constructor(
    message: string,
    status?: number,
    code?: string,
    url?: string,
    headers?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.url = url;
    this.headers = headers;
  }
}

function maskHeaders(headers: Record<string, unknown> = {}): Record<string, string> {
  const masked: Record<string, string> = {};
  for (const [key, val] of Object.entries(headers)) {
    const s = String(val ?? '');
    if (s.length > 8) masked[key] = s.slice(0, 4) + '***' + s.slice(-4);
    else masked[key] = s ? '***' : '';
  }
  return masked;
}

export function createClient(baseURL: string, config?: AxiosRequestConfig): AxiosInstance {
  const { headers: configHeaders, ...restConfig } = config || {};
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json', ...(configHeaders as Record<string, string>) },
    ...restConfig,
  });

  client.interceptors.request.use(
    (req) => {
      const url = `${req.baseURL || ''}${req.url || ''}`;
      const h = maskHeaders(req.headers as Record<string, unknown>);
      console.log(`[API] ➡️ ${req.method?.toUpperCase()} ${url}`);
      console.log(`[API]    Headers: ${JSON.stringify(h)}`);
      return req;
    },
    (err) => Promise.reject(err),
  );

  client.interceptors.response.use(
    (res) => {
      const url = `${res.config.baseURL || ''}${res.config.url || ''}`;
      const body = JSON.stringify(res.data).slice(0, 200);
      console.log(`[API] ✅ ${res.status} ${url}`);
      console.log(`[API]    Body: ${body}`);
      return res;
    },
    (err: AxiosError) => {
      const url = `${err.config?.baseURL || ''}${err.config?.url || ''}`;
      const responseBody = err.response?.data ? JSON.stringify(err.response.data).slice(0, 500) : '';

      if (err.code === 'ECONNABORTED') {
        console.error(`[API] ❌ TIMEOUT ${url}`);
        throw new ApiError('Request timed out', 408, 'TIMEOUT', url);
      }
      if (err.response) {
        console.error(`[API] ❌ ${err.response.status} ${url} | ${responseBody}`);
        throw new ApiError(
          `API error: ${err.response.status} ${err.response.statusText}`,
          err.response.status,
          String(err.response.status),
          url,
          err.response.headers as Record<string, string>,
        );
      }
      if (err.request) {
        console.error(`[API] ❌ NETWORK_ERROR ${url} | No response`);
        throw new ApiError('No response from server', 503, 'NETWORK_ERROR', url);
      }
      console.error(`[API] ❌ UNKNOWN ${url} | ${err.message}`);
      throw new ApiError(err.message, 0, 'UNKNOWN', url);
    },
  );

  return client;
}

export function isValidArray<T>(data: unknown): data is T[] {
  return Array.isArray(data) && data.length > 0;
}
