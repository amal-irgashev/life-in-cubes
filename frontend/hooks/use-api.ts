import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import apiClient from '../lib/api-client';
import { AxiosError } from 'axios';


// Generic type for API responses
export type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

// Example hook for fetching current user
export function useCurrentUser(options?: UseQueryOptions<any, AxiosError>) {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => apiClient.users.getCurrent(),
    ...options,
  });
}

// Example hook for user registration
export function useRegister() {
  return useMutation({
    mutationFn: (data: { username: string; email: string; password: string }) =>
      apiClient.auth.register(data),
  });
}

// Example hook for user login
export function useLogin() {
  return useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      apiClient.auth.login(data),
  });
}

// Example hook for user logout
export function useLogout() {
  return useMutation({
    mutationFn: () => apiClient.auth.logout(),
  });
}

