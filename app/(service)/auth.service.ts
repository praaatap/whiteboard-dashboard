const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface AuthResponse {
  message: string;
  user: any;
  token: string;
}

class AuthService {
  // Get token from localStorage
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  // Set token in localStorage
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  // Set user in localStorage
  setUser(user: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get user from localStorage
  getUser(): any {
    if (typeof window === 'undefined') return null;

    try {
      const userStr = localStorage.getItem('user');

      // ✅ FIX: Check for null, undefined, or "undefined" string
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null;
      }

      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Signup
  async signup(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Signup failed' }));
      throw new Error(error.message || 'Signup failed');
    }

    const responseData: AuthResponse = await response.json();

    this.setToken(responseData.token);
    this.setUser(responseData.user);

    return responseData;
  }

  // Login
  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Invalid credentials');
    }

    const responseData: AuthResponse = await response.json();

    this.setToken(responseData.token);
    this.setUser(responseData.user);

    return responseData;
  }

  // Get current user from backend
  async getCurrentUser(): Promise<any | null> {
    const token = this.getToken();
    if (!token) {
      return null; // not logged in
    }

    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // token invalid or expired
      this.clearAuth();
      return null;
    }

    const data = await response.json();
    return data.user;
  }


  // Logout
  async logout(): Promise<void> {
    const token = this.getToken();

    if (token) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearAuth();
  }

  // Clear auth data
  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
