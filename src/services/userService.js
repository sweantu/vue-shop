import { apiClient, handleApiError } from './api'

export const userService = {
  // Auth endpoints
  async register(userData) {
    try {
      const { data } = await apiClient.post('/users/register', userData)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async login(credentials) {
    try {
      const { data } = await apiClient.post('/users/login', credentials)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async googleOAuthLogin() {
    try {
      const { data } = await apiClient.get('/users/google-oauth/login')
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async googleOAuthCallback(code) {
    try {
      const { data } = await apiClient.get(`/users/google-oauth/callback?code=${code}`)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async getUserInfo() {
    try {
      const { data } = await apiClient.get('/users/me')
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async updateProfile(userData) {
    try {
      const { data } = await apiClient.put('/users/me', userData)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },
}
