export type UserRole = 'admin' | 'user' | 'manager';

// Dữ liệu User mở rộng lưu trên Firestore (Collection 'users')
export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: UserRole;
    createdAt: string;
}

// Dữ liệu dùng khi Đăng nhập
export interface LoginCredentials {
    email: string;
    password: string;
}
// Dữ liệu dùng khi Đăng ký
export interface RegisterCredentials {
    email: string;
    password: string;
    displayName: string;
}

export interface AuthState {
    user: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}