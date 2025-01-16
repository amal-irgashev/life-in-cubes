// User types
export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile: UserProfile;
}

// Profile types
export interface UserProfile {
    id: number;
    birth_date: string;
    created_at: string;
    updated_at: string;
}

// Tag types
export interface Tag {
    id: number;
    name: string;
    created_at: string;
}

// Event types
export interface Event {
    id: number;
    user: User;
    week_index: number;
    day_of_week: number;
    title: string;
    description: string;
    icon: string;
    color?: string;
    tags: Tag[];
    created_at: string;
    updated_at: string;
}

// API Response types
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// Request types
export interface EventCreateRequest {
    week_index: number;
    day_of_week: number;
    title: string;
    description: string;
    icon: string;
    color?: string;
    tags?: { name: string }[];
}

export interface EventUpdateRequest extends Partial<EventCreateRequest> {} 