import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { LoginService, type LoginCredentials, type UserInfo } from '../services/LoginService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const loginService = new LoginService();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          const isAuth = await loginService.isAuthenticated();
          setIsAuthenticated(isAuth);
          
          if (isAuth) {
            const currentUser = await loginService.getCurrentUser();
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await fetch(API_URL+'/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await result.json();
      
      if (data.message === 'Login successful') {
        console.log('Login successful:', data);
        setIsAuthenticated(true);
        
        // Store token in localStorage if rememberMe is true
        if (credentials.rememberMe) {
          localStorage.setItem('auth_token', data.token);
        } else {
          // Store in sessionStorage if not remembering
          sessionStorage.setItem('auth_token', data.token);
        }
        
        // Get user info from token
        const userInfo = await loginService.getCurrentUser();
        console.log('User info from token after login:', userInfo);
        setUser(userInfo || data.user);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await fetch(API_URL+'/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await result.json();
      return data.success;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await fetch(API_URL+'/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`
        },
      });
      
      // Clear stored tokens
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}