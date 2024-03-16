// AuthService.js

import axios from 'axios';
class AuthService {
  async login(username, password) {
    console.log('AuthService: Attempting login...');
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.data.accessToken) {
        console.log('AuthService: Login successful, storing user data...');
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('AuthService: Login error', error.response ? error.response.data : 'No response data');
      throw error;
    }
  }

  logout() {
    console.log('AuthService: Logging out, removing user from storage...');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    console.log('AuthService: Fetching current user from storage...');
    return JSON.parse(localStorage.getItem('user'));
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    const isAuthenticated = !!user && !!user.accessToken;
    console.log(`AuthService: Checking if user is authenticated: ${isAuthenticated}`);
    return isAuthenticated;
  }
}

const authService = new AuthService();

export default authService;
