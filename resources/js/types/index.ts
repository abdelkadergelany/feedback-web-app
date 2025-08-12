export interface Feedback {
    id: number;
    title: string;
    description: string;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    category: {
        id: number;
        name: string;
    };
    comments_count?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}