import { apiClient, handleApiError } from './api'

export const cartService = {
  async getCarts() {
    try {
      const { data } = await apiClient.get('/carts')
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async upsertCart(items) {
    try {
      const { data } = await apiClient.put('/carts', { items })
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },
}
