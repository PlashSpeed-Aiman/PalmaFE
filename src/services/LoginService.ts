/**
 * Service for handling user authentication and session management
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResult {
  success: boolean;
  message: string;
  token?: string;
  user?: UserInfo;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: string;
}

export interface PasswordResetRequest {
  email: string;
}

export class LoginService {
  /**
   * Authenticates a user with the provided credentials
   * @param credentials The login credentials
   * @returns Promise resolving to the login result
   */
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login failed',
        };
      }
      
      return {
        success: true,
        message: 'Login successful',
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    }
  }

  /**
   * Logs out the current user
   * @returns Promise resolving when logout is complete
   */
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (token) {
        await fetch('/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      }
      
      // Clear stored tokens regardless of API response
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear tokens on error
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }
  }

  /**
   * Checks if a user is currently authenticated
   * @returns Promise resolving to a boolean indicating if the user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return !!token; // Return true if token exists
  }

  /**
   * Gets information about the currently logged in user
   * @returns Promise resolving to user information or null if not logged in
   */
  async getCurrentUser(): Promise<UserInfo | null> {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        return null;
      }
      
      // Always fetch fresh user data from the API to reflect latest profile changes
      const API_URL = (import.meta as any).env?.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/UserManagement/details`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // Ensure we bypass any caches
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return null;
        }
        console.error('Failed to fetch current user. Status:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      const userInfo: UserInfo = {
        id: data.id || data.userId || data.sub || '',
        username: data.username || data.preferred_username || data.name || data.fullName || '',
        email: data.email || '',
        fullName: data.fullName || data.name,
        role: data.role || 'user'
      };
      
      return userInfo;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Initiates a password reset for the specified email
   * @param request The password reset request
   * @returns Promise resolving to a boolean indicating success
   */
  requestPasswordReset(request: PasswordResetRequest): Promise<boolean> {
    // Empty implementation
    return Promise.resolve(true);
  }

  /**
   * Validates a password reset token
   * @param token The reset token to validate
   * @returns Promise resolving to a boolean indicating if the token is valid
   */
  validateResetToken(token: string): Promise<boolean> {
    // Empty implementation
    return Promise.resolve(true);
  }

  /**
   * Completes a password reset with a new password
   * @param token The reset token
   * @param newPassword The new password
   * @returns Promise resolving to a boolean indicating success
   */
  resetPassword(token: string, newPassword: string): Promise<boolean> {
    // Empty implementation
    return Promise.resolve(true);
  }
}