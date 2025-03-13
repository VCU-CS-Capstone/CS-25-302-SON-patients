import { PaginatedResponse, SiteInfo } from './RequestTypes';
import {
  Participant,
  ParticipantLookupRequest,
  ParticipantLookupResponse,
} from './types/participant';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://cs-25-303.wyatt-herkamp.dev/api';

const api = {
  userAgent: () => {
    return `CS25-302 Frontend / React Native(Expo) / ${Platform.OS}`;
  },
  get: async (endpoint: string) => {
    const url = appendEndpoint(endpoint);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': api.userAgent(),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    console.debug('Get Response', response);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}, Error: ${response.status}`);
    }
    return await response.json();
  },
  getSecure: async (endpoint: string) => {
    try {
      const session = await SecureStore.getItemAsync('session');
      const authHeader = session ? `Session ${session}` : undefined;
      const url = appendEndpoint(endpoint);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': api.userAgent(),
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
        },
        credentials: 'include',
      });
      // Get "x-request-id" header from response
      const requestId = response.headers.get('x-request-id');
      if (requestId) {
        console.debug('Request ID:', requestId);
      } else {
        console.warn('No Request ID');
      }
      console.debug('Secure Get Response', response);
      return response;
    } catch (e) {
      throw e;
    }
  },
  post: async (endpoint: string, data: any) => {
    const url = appendEndpoint(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'User-Agent': api.userAgent(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    console.debug('Post Response', response);
    if (!response.ok) {
      throw new Error(`Failed to post ${endpoint}, Error: ${response.status}`);
    }
    return await response.json();
  },
  postSecure: async (endpoint: string, data: any) => {
    try {
      const session = await SecureStore.getItemAsync('session');
      const authHeader = session ? `Session ${session}` : undefined;

      const url = appendEndpoint(endpoint);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'User-Agent': api.userAgent(),
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      // Get "x-request-id" header from response
      const requestId = response.headers.get('x-request-id');
      if (requestId) {
        console.debug('Request ID:', requestId);
      } else {
        console.warn('No Request ID');
      }
      console.debug('Secure Get Response', response);
      return response;
    } catch (e) {
      throw e;
    }
  },
  // Fetch site info
  // Scalar: https://cs-25-303.wyatt-herkamp.dev/scalar#tag/api/GET/api/info
  siteInfo: async () => {
    const response = await api.get('/info');
    return response as SiteInfo;
  },
  participants: {
    fetchById: async (id: number) => {
      const response = await api.getSecure(`/participant/get/${id}`);
      if (response.ok) {
        return (await response.json()) as Participant;
      } else if (response.status === 404) {
        return undefined;
      } else {
        throw new Error(`Failed to fetch participant with id ${id}, Error: ${response.status}`);
      }
    },
    lookup: async (
      lookup: ParticipantLookupRequest,
      page_size: number = 15,
      page: number = 1
    ): Promise<PaginatedResponse<ParticipantLookupResponse>> => {
      const response = await api.postSecure(
        `/participant/lookup?page_size=${page_size}&page=${page}`,
        lookup
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch participant lookup, Error: ${response.status}`);
      }
      return (await response.json()) as PaginatedResponse<ParticipantLookupResponse>;
    },
  },

  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login/password', { username, password });
    console.log({ response });
    return response;
  },
};

function appendEndpoint(endpoint: string) {
  return `${API_URL}${endpoint}`;
}

export default api;
