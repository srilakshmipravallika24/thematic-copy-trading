/**
 * Centralized API Client for Regulated Thematic Copy-Trading Network
 * Supports Bearer token authorization and standardized JSON error extraction.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = null;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('thematic_auth_token');
    }
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('thematic_auth_token', token);
      } else {
        localStorage.removeItem('thematic_auth_token');
      }
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error ${response.status}`);
      }

      return data;
    } catch (err) {
      console.warn(`[API] Error calling ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async register(payload) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Portfolios
  async getPortfolios(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/portfolios${queryString ? `?${queryString}` : ''}`);
  }

  async getPortfolioById(id) {
    return this.request(`/portfolios/${id}`);
  }

  // Copy Trading
  async previewAllocation(portfolioId, capitalAmount, cashBufferPercent = 5) {
    return this.request('/copy/preview', {
      method: 'POST',
      body: JSON.stringify({ portfolioId, capitalAmount, cashBufferPercent }),
    });
  }

  async subscribeCopy(payload) {
    return this.request('/copy/subscribe', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getMyCopyTrades() {
    return this.request('/copy/my-trades');
  }

  async updateCopyStatus(id, status) {
    return this.request(`/copy/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Social
  async getSocialPosts(themeTag) {
    const query = themeTag ? `?themeTag=${encodeURIComponent(themeTag)}` : '';
    return this.request(`/social${query}`);
  }

  async createSocialPost(payload) {
    return this.request('/social', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async addComment(postId, text) {
    return this.request(`/social/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async toggleLike(postId) {
    return this.request(`/social/${postId}/like`, {
      method: 'POST',
    });
  }

  // RIAs
  async getTopAdvisors() {
    return this.request('/ria');
  }

  async getAdvisorById(id) {
    return this.request(`/ria/${id}`);
  }
}

export const api = new ApiService();
