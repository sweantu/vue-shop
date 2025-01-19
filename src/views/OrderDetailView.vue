<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { orderService } from '../services/orderService'
import { formatDate } from '../utils/dateFormat'

const route = useRoute()
const order = ref(null)
const isLoading = ref(false)
const error = ref(null)

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const fetchOrderDetail = async () => {
  try {
    isLoading.value = true
    error.value = null
    const { data, error: apiError } = await orderService.getOrderById(route.params.id)
    if (apiError) throw new Error(apiError)
    order.value = data
  } catch (err) {
    error.value = err.message || 'Failed to fetch order details'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="isLoading" class="text-center py-12">Loading...</div>
    <div v-else-if="error" class="text-center text-red-600 py-12">{{ error }}</div>
    <template v-else-if="order">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Order #{{ order.id }}
          </h2>
        </div>
      </div>

      <!-- Order Status -->
      <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500">Order Status</dt>
            <dd class="mt-1">
              <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                :class="getStatusColor(order.status)">
                {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
              </span>
            </dd>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500">Payment Status</dt>
            <dd class="mt-1">
              <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                :class="getPaymentStatusColor(order.payment_status)">
                {{ order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) }}
              </span>
            </dd>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500">Order Date</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(order.created_at) }}</dd>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">${{ order.total_amount }}</dd>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="mt-8 bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Order Items</h3>
          <div class="mt-6 flow-root">
            <ul class="-my-5 divide-y divide-gray-200">
              <li v-for="item in order.items" :key="item.product_id" class="py-5">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <img :src="item.image" :alt="item.name" class="h-16 w-16 rounded-md object-cover">
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                    <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                    <p class="text-sm text-gray-500">Price: ${{ item.price }}</p>
                  </div>
                  <div class="flex-shrink-0">
                    <p class="text-sm font-medium text-gray-900">
                      ${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Shipping Information -->
      <div class="mt-8 bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Shipping Information</h3>
          <div class="mt-4 space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Shipping Address</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ order.shipping_address }}</dd>
            </div>
            <div v-if="order.tracking_number">
              <dt class="text-sm font-medium text-gray-500">Tracking Number</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ order.tracking_number }}</dd>
            </div>
            <div v-if="order.note">
              <dt class="text-sm font-medium text-gray-500">Order Note</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ order.note }}</dd>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="mt-8 bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Order Timeline</h3>
          <div class="mt-4 flow-root">
            <ul class="-mb-8">
              <li v-if="order.created_at">
                <div class="relative pb-8">
                  <div class="relative flex space-x-3">
                    <div>
                      <span class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <span class="text-white text-sm">✓</span>
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-500">Order Created</p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        {{ formatDate(order.created_at) }}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li v-if="order.shipped_at">
                <div class="relative pb-8">
                  <div class="relative flex space-x-3">
                    <div>
                      <span class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <span class="text-white text-sm">✓</span>
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-500">Order Shipped</p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        {{ formatDate(order.shipped_at) }}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li v-if="order.delivered_at">
                <div class="relative">
                  <div class="relative flex space-x-3">
                    <div>
                      <span
                        class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <span class="text-white text-sm">✓</span>
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-500">Order Delivered</p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        {{ formatDate(order.delivered_at) }}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li v-if="order.cancelled_at">
                <div class="relative">
                  <div class="relative flex space-x-3">
                    <div>
                      <span class="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                        <span class="text-white text-sm">✗</span>
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-500">Order Cancelled</p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        {{ formatDate(order.cancelled_at) }}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
