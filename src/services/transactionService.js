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
}
