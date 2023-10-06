import decode from 'jwt-decode';

class AuthService {
  constructor() {
    this.token = null;
    this.decodedToken = null;
  }

  getProfile() {
    if (!this.decodedToken) {
      this.decodedToken = decode(this.getToken());
    }
    return this.decodedToken;
  }

  loggedIn() {
    return !!this.getToken() && !this.isTokenExpired();
  }

  isTokenExpired() {
    try {
      if (!this.decodedToken) {
        this.decodedToken = decode(this.getToken());
      }

      return this.decodedToken.exp < Date.now() / 1000;
    } catch (err) {
      console.error('Error decoding token:', err);
      // If there's an error, treat the token as expired
      return true;
    }
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('id_token');
    }
    return this.token;
  }

  login(idToken) {
    this.token = idToken;
    this.decodedToken = decode(idToken);
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }
  
  logout() {
    this.token = null;
    this.decodedToken = null;
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();

export const isAuthenticated = () => {
  const authService = new AuthService();
  return authService.loggedIn();
};
