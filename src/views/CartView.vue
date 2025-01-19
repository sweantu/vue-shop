<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '../stores/user'
import { orderService } from '../services/orderService'

const cartStore = useCartStore()
const userStore = useUserStore()
const router = useRouter()

const isLoading = ref(false)
const error = ref(null)
const orderId = ref(null)
const showSuccessMessage = ref(false)

const formData = ref({
  shipping_address: '',
  note: ''
})

onMounted(async () => {
  await cartStore.fetchCart()
})

const createOrder = async () => {
  try {
    isLoading.value = true
    error.value = null

    const orderPayload = {
      items: cartStore.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      })),
      shipping_address: formData.value.shipping_address,
      note: formData.value.note
    }

    const { data, error: orderError } = await orderService.createOrder(orderPayload)
    if (orderError) {
      throw new Error(orderError)
    }

    orderId.value = data.id
  } catch (err) {
    error.value = err.message || 'Failed to create order'
  } finally {
    isLoading.value = false
  }
}

const confirmPayment = async () => {
  try {
    isLoading.value = true
    error.value = null

    const { error: paymentError } = await orderService.checkoutOrder(orderId.value)
    if (paymentError) {
      throw new Error(paymentError)
    }

    await cartStore.clearCart()
    showSuccessMessage.value = true

    // Redirect to orders page after 2 seconds
    setTimeout(() => {
      router.push('/orders')
    }, 2000)
  } catch (err) {
    error.value = err.message || 'Failed to process payment'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold mb-8">Shopping Cart</h1>

    <div v-if="cartStore.isLoading" class="text-center py-12">
      Loading...
    </div>

    <div v-else-if="cartStore.totalItems > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <ul class="divide-y divide-gray-200">
            <li v-for="item in cartStore.items" :key="item.product_id" class="p-6">
              <div class="grid grid-cols-3 gap-6">
                <!-- Product Image -->
                <div class="col-span-1">
                  <img :src="item.image" :alt="item.name" class="w-full h-32 object-cover rounded-lg">
                </div>

                <!-- Product Details -->
                <div class="col-span-1">
                  <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
                  <p class="mt-1 text-lg font-medium text-gray-900">${{ item.price }}</p>
                  <p class="mt-1 text-sm text-gray-600">{{ item.stock }} in stock</p>
                </div>

                <!-- Quantity, Price and Remove -->
                <div class="col-span-1">
                  <div class="flex flex-col items-end">
                    <div class="flex items-center gap-4">
                      <div class="flex items-center">
                        <label for="quantity" class="mr-2 text-sm text-gray-600">Quantity:</label>
                        <div class="flex items-center border border-gray-300 rounded-md">
                          <button @click="cartStore.updateQuantity(item.product_id, Math.max(1, item.quantity - 1))"
                            class="px-2 py-1 text-gray-600 hover:bg-gray-100 border-r border-gray-300">
                            -
                          </button>
                          <span class="px-4 py-1">{{ item.quantity }}</span>
                          <button
                            @click="cartStore.updateQuantity(item.product_id, Math.min(item.stock, item.quantity + 1))"
                            class="px-2 py-1 text-gray-600 hover:bg-gray-100 border-l border-gray-300">
                            +
                          </button>
                        </div>
                      </div>

                      <button @click="cartStore.removeItem(item.product_id)"
                        class="text-gray-400 hover:text-red-500 transition-colors">
                        <TrashIcon class="h-5 w-5" />
                      </button>
                    </div>

                    <div class="mt-4 text-lg font-medium text-gray-900">
                      ${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900">Order Summary</h2>

          <div class="mt-6 space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Subtotal</p>
              <p class="text-sm font-medium text-gray-900">${{ cartStore.formattedTotal }}</p>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <div class="flex items-center justify-between">
                <p class="text-base font-medium text-gray-900">Order Total</p>
                <p class="text-base font-medium text-gray-900">${{ cartStore.formattedTotal }}</p>
              </div>
            </div>
            <div class="border-t border-gray-200 pt-4">
              <div class="flex items-center justify-between">
                <p class="text-base text-gray-900">Your Balance</p>
                <p class="text-base text-gray-900">${{ userStore.user?.balance || '0.00' }}</p>
              </div>
              <div v-if="parseFloat(cartStore.formattedTotal) > parseFloat(userStore.user?.balance || 0)" class="mt-2">
                <p class="text-sm text-red-600">
                  You need ${{ (cartStore.formattedTotal - (userStore.user?.balance || 0)).toFixed(2) }} more to
                  complete this purchase
                </p>
                <router-link to="/manage/transactions" class="text-sm text-indigo-600 hover:text-indigo-500">
                  Top up your balance
                </router-link>
              </div>
            </div>

            <!-- Shipping Form -->
            <div v-if="!orderId && parseFloat(cartStore.formattedTotal) <= parseFloat(userStore.user?.balance || 0)"
              class="border-t border-gray-200 pt-4 space-y-4">
              <div>
                <label for="shipping_address" class="block text-sm font-medium text-gray-700">
                  Shipping Address
                </label>
                <textarea id="shipping_address" v-model="formData.shipping_address" rows="3" required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your shipping address"></textarea>
              </div>

              <div>
                <label for="note" class="block text-sm font-medium text-gray-700">
                  Order Note (Optional)
                </label>
                <textarea id="note" v-model="formData.note" rows="2"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Add any special instructions"></textarea>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="text-sm text-red-600">
              {{ error }}
            </div>

            <!-- Success Message -->
            <div v-if="showSuccessMessage" class="text-sm text-green-600">
              Order successfully processed! Redirecting to orders page...
            </div>

            <!-- Action Buttons -->
            <button v-if="!orderId" @click="createOrder"
              :disabled="isLoading || parseFloat(cartStore.formattedTotal) > parseFloat(userStore.user?.balance || 0) || !formData.shipping_address"
              class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? 'Processing...' : 'Proceed to Checkout' }}
            </button>

            <button v-else-if="!showSuccessMessage" @click="confirmPayment" :disabled="isLoading"
              class="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50">
              {{ isLoading ? 'Processing...' : 'Confirm Payment' }}
            </button>

            <router-link to="/" class="block text-center text-sm text-indigo-600 hover:text-indigo-500">
              Continue Shopping
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-500 mb-4">Your cart is empty</p>
      <router-link to="/"
        class="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
        Continue Shopping
      </router-link>
    </div>
  </main>
</template>
