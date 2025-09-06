'use server';

import { cookies } from 'next/headers';
import { accessToken, langKey } from '@/config/constants/keys';
import { TGlobalResponseType } from '@/global/globalResponseType';

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

class HttpClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;
  private defaultHeaders: Record<string, string>;

  constructor(headers: Record<string, string> = {}) {
    this.defaultHeaders = {
      ...headers,
    };
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    // Get token from server-side cookies
    const cookieStore = await cookies();
    const token = cookieStore.get(accessToken)?.value || '';
    const lang = cookieStore.get(langKey)?.value || 'en';

    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string | undefined> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...this.defaultHeaders,
      lang,
      ...customHeaders,
    };

    const config: RequestInit = {
      method,
      headers: headers as Record<string, string>,
      credentials: "include",
      mode: "cors",
      cache: "no-cache",
    };

    if (data) {
      config.body = data instanceof FormData ? data : JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.status) {
        const errorData = await response.json().catch(() => null);
        throw new HttpError(response?.status, errorData?.message || response?.statusText);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(500, "Network request failed");
    }
  }

  public async get<T>(endpoint: string, customHeaders?: Record<string, string>): Promise<TGlobalResponseType<T>> {
    return this.request<TGlobalResponseType<T>>("GET", endpoint, undefined, customHeaders);
  }

  public async post<T>(
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<TGlobalResponseType<T>> {
    return this.request<TGlobalResponseType<T>>("POST", endpoint, data, customHeaders);
  }

  public async put<T>(
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("PUT", endpoint, data, customHeaders);
  }

  public async patch<T>(
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<TGlobalResponseType<T>> {
    return this.request<TGlobalResponseType<T>>("PATCH", endpoint, data, customHeaders);
  }

  public async delete<T>(endpoint: string, customHeaders?: Record<string, string>): Promise<TGlobalResponseType<T>> {
    return this.request<TGlobalResponseType<T>>("DELETE", endpoint, undefined, customHeaders);
  }
}

export default HttpClient;