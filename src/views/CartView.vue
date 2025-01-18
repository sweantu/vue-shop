<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '../stores/user'

const cartStore = useCartStore()
const userStore = useUserStore()
const router = useRouter()

onMounted(async () => {
  await cartStore.fetchCart()
})


const checkout = () => {
  router.push('/checkout')
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
                <router-link to="/topup" class="text-sm text-indigo-600 hover:text-indigo-500">
                  Top up your balance
                </router-link>
              </div>
            </div>
            <button @click="checkout"
              class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
              Proceed to Checkout
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
