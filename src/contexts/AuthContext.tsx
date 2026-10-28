import { createContext, useEffect, useState, type ReactNode } from "react";
import type {
    AuthState,
    LoginCredentials,
    RegisterCredentials,
    UserProfile,
} from "../types/auth";
import { authService } from "../services/authService";

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
    });

    useEffect(() => {
        const unsubcribe = authService.subscribeToAuth(
            (userProfile: UserProfile | null) => {
                setAuthState({
                    user: userProfile,
                    isLoading: false,
                    isAuthenticated: !!userProfile,
                });
            },
        );
        return () => unsubcribe();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const user = await authService.login(credentials);
        setAuthState({ user, isLoading: false, isAuthenticated: true });
    };
    const register = async (credentials: RegisterCredentials) => {
        const user = await authService.register(credentials);
        setAuthState({ user, isLoading: false, isAuthenticated: true });
    };
    const loginWithGoogle = async () => {
        const user = await authService.loginWithGoogle();
        setAuthState({ user, isLoading: false, isAuthenticated: true });
    };

    const logout = async () => {
        await authService.logout();
        setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
        });
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                login,
                logout,
                register,
                loginWithGoogle,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
