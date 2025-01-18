import { apiClient, handleApiError } from './api'

export const transactionService = {
  async getTransactions(params = {}) {
    try {
      const { data } = await apiClient.get('/transactions', { params })
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async deposit(data) {
    try {
      const response = await apiClient.post('/transactions/deposit', data)
      return { data: response.data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async withdraw(data) {
    try {
      const response = await apiClient.post('/transactions/withdraw', data)
      return { data: response.data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },
}
