interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

import { base_url } from '../constants';

export const fetcher = async (url: string, options: FetcherOptions = {}) => {
  const { method = 'GET', body, headers = {} } = options;
  
  const config: RequestInit = {
    method,
    credentials: 'include', // This enables cookies to be sent with requests
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  // Handle relative URLs by prepending the base URL
  const fullUrl = url.startsWith('http') ? url : `${base_url}${url}`;

  const response = await fetch(fullUrl, config);

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object
    (error as any).info = await response.json().catch(() => ({}));
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
};

// Convenience functions for different HTTP methods
export const getFetcher = (url: string, headers?: Record<string, string>) => 
  fetcher(url, { method: 'GET', headers });

export const postFetcher = (url: string, body: any, headers?: Record<string, string>) => 
  fetcher(url, { method: 'POST', body, headers });

export const putFetcher = (url: string, body: any, headers?: Record<string, string>) => 
  fetcher(url, { method: 'PUT', body, headers });

export const deleteFetcher = (url: string, headers?: Record<string, string>) => 
  fetcher(url, { method: 'DELETE', headers });

export const patchFetcher = (url: string, body: any, headers?: Record<string, string>) => 
  fetcher(url, { method: 'PATCH', body, headers });
