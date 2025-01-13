import { defineStore } from 'pinia'
import { cartService } from '../services/cartService'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isLoading: false,
  }),

  getters: {
    // Total number of unique items
    totalItems: (state) => state.items.length,

    // Total quantity of all items (for header display)
    totalQuantity: (state) => state.items.reduce((total, item) => total + item.quantity, 0),

    totalAmount: (state) =>
      state.items.reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity
      }, 0),

    formattedTotal: (state) => {
      const total = state.items.reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity
      }, 0)
      return total.toFixed(2)
    },
  },

  actions: {
    async fetchCart() {
      this.isLoading = true
      const { data, error } = await cartService.getCarts()
      if (!error && data) {
        this.items = data.items
      }
      this.isLoading = false
      return { error }
    },

    async updateQuantity(productId, quantity) {
      const items = this.items.map((item) => {
        if (item.product_id === productId) {
          return { ...item, quantity }
        }
        return item
      })
      const { error } = await cartService.upsertCart(items)
      if (!error) {
        this.items = items
      }
      return { error }
    },

    async removeItem(productId) {
      const items = this.items.filter((item) => item.product_id !== productId)
      const { error } = await cartService.upsertCart(items)
      if (!error) {
        this.items = items
      }
      return { error }
    },

    async addItem(productId) {
      const existingItem = this.items.find((item) => item.product_id === productId)
      if (existingItem) {
        const { error } = await this.updateQuantity(productId, existingItem.quantity + 1)
        return { error }
      } else {
        const items = [...this.items, { product_id: productId, quantity: 1 }]
        const { error } = await cartService.upsertCart(items)
        if (!error) {
          this.items = items
        }
        return { error }
      }
    },

    async clearCart() {
      const { error } = await cartService.upsertCart([])
      if (!error) {
        this.items = []
      }
      return { error }
    },
  },
})
