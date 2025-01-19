import { User } from './api';

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    email: string;
    first_name?: string;
    last_name?: string;
    birth_date?: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}

export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
} 