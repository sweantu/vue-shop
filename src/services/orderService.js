import { apiClient, handleApiError } from './api'

export const orderService = {
  async getOrders(params = {}) {
    try {
      const { data } = await apiClient.get('/orders', {
        params,
      })
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async getOrderById(orderId) {
    try {
      const { data } = await apiClient.get(`/orders/${orderId}`)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async createOrder(orderData) {
    try {
      const { data } = await apiClient.post('/orders', orderData)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async updateOrder(orderId, orderData) {
    try {
      const { data } = await apiClient.put(`/orders/${orderId}`, orderData)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async checkoutOrder(orderId) {
    try {
      const { data } = await apiClient.post(`/orders/${orderId}/checkout`)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },
}
