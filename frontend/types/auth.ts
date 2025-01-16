import { User } from './api';

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    birth_date?: string;
}

export interface AuthResponse extends AuthTokens {
    user: User;
}

export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
} 