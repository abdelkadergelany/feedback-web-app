import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// Extended types for your application
interface Feedback {
    id: number;
    title: string;
    description: string;
    category_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Paginate {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface FeedbackWithRelations extends Feedback {
    category: Category;
    user: User;
    comments?: Comment[];
}

interface PaginatedFeedbacks extends Paginate {
    data: FeedbackWithRelations[];
}
