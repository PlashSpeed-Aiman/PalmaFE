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
      
      // For now, we'll decode the JWT token to get user info
      // In a real app, you might want to make an API call to get fresh user data
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      console.log('JWT payload:', payload);
      
      // Check for the specific claim format
      const claimName = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      if (claimName) {
        console.log('Found username in claim format:', claimName);
      }
      
      return {
        id: payload.sub || payload.id,
        username: payload.username || payload.preferred_username || payload.name || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        email: payload.email,
        role: payload.role || 'user'
      };
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