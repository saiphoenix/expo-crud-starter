import type { AxiosError } from 'axios';
import axios from 'axios';
import Env from 'env';

import { signOut } from '@/features/auth/use-auth-store';
import { getToken } from '@/lib/auth/utils';

/**
 * LAYER 1 — HTTP CLIENT
 *
 * The ONLY axios instance in the app. Every request goes through it.
 * Feature code never imports axios directly — it imports `client`.
 * See docs/04-api-layer.md
 */
export const client = axios.create({
  baseURL: Env.EXPO_PUBLIC_API_URL,
  timeout: 15000, // give up after 15 seconds
});

// ── REQUEST interceptor: attach the access token to every call ─────────────
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token?.access) {
    config.headers.Authorization = `Bearer ${token.access}`;
  }
  return config;
});

// ── RESPONSE interceptor: handle errors in ONE place ───────────────────────
client.interceptors.response.use(
  response => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      // Token expired / invalid → send the user back to login.
      // (Refresh-token retry would go here in a real backend.)
      signOut();
    }

    // Replace the technical message ("Request failed with status code 404")
    // with the server's readable message when it sends one.
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      error.message = serverMessage;
    }
    else if (error.code === 'ECONNABORTED') {
      error.message = 'The request took too long. Please try again.';
    }
    else if (!error.response) {
      error.message = 'No internet connection. Please check your network.';
    }

    return Promise.reject(error);
  },
);
