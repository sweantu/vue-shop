import { apiClient, handleApiError } from './api'

export const productService = {
  async getProducts(params = {}) {
    try {
      const { data } = await apiClient.get('/products', { params })
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async getProduct(productId) {
    try {
      const { data } = await apiClient.get(`/products/${productId}`)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },
}
