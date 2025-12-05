export interface MenuItem {
    id: string | number;
    label: string;
    path: string;
    exact?: boolean;
    requiresAuth?: boolean;
    adminOnly?: boolean;
}