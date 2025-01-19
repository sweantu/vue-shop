<script setup>
import { ref, onMounted, watch } from 'vue'
import { orderService } from '../services/orderService'
import TablePagination from '@/components/common/TablePagination.vue'
import { formatDate } from '../utils/dateFormat'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'

const orders = ref([])
const isLoading = ref(false)
const error = ref(null)

// Filter and sort states
const filters = ref({
  status: '',
  payment_status: '',
  search: ''
})

const sorting = ref({
  column: 'created_at',
  order: 'desc'
})

const pagination = ref({
  total: 0,
  page: 1,
  size: 10,
  pages: 1
})

const fetchOrders = async () => {
  try {
    isLoading.value = true
    error.value = null

    const params = {
      page: pagination.value.page,
      size: pagination.value.size,
      sort_order: sorting.value.order,
      sort_by: sorting.value.column,
      ...(filters.value.status && { status: filters.value.status }),
      ...(filters.value.payment_status && { payment_status: filters.value.payment_status }),
      ...(filters.value.search && { search: filters.value.search })
    }

    const { data, error: apiError } = await orderService.getOrders(params)
    if (apiError) {
      throw new Error(apiError)
    }

    orders.value = data.items
    pagination.value = {
      total: data.total,
      page: data.page,
      size: data.size,
      pages: data.pages
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch orders'
  } finally {
    isLoading.value = false
  }
}

const handleSort = (column) => {
  if (sorting.value.column === column) {
    sorting.value.order = sorting.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sorting.value.column = column
    sorting.value.order = 'asc'
  }
  fetchOrders()
}

const handlePageChange = (newPage) => {
  pagination.value.page = newPage
  fetchOrders()
}

const getSortIcon = (column) => {
  if (sorting.value.column !== column) return null
  return sorting.value.order === 'asc' ? ChevronUpIcon : ChevronDownIcon
}

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

const getTotalItems = (items) => {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

const getItemsSummary = (items) => {
  if (items.length === 0) return 'No items'
  if (items.length === 1) return items[0].name
  return `${items[0].name} +${items.length - 1} more`
}

watch([filters], () => {
  pagination.value.page = 1
  fetchOrders()
}, { deep: true })

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Orders</h1>
        <p class="mt-2 text-sm text-gray-700">
          Showing {{ orders.length }} of {{ pagination.total }} orders
        </p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">Order Status</label>
        <select v-model="filters.status"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label for="payment_status" class="block text-sm font-medium text-gray-700">Payment Status</label>
        <select v-model="filters.payment_status"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option value="">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
        <input type="text" v-model="filters.search"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search orders...">
      </div>
    </div>

    <!-- Orders Table -->
    <div class="mt-8 flex flex-col">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <div v-if="isLoading" class="p-4 text-center">Loading...</div>
            <div v-else-if="error" class="p-4 text-center text-red-600">{{ error }}</div>
            <table v-else class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" @click="handleSort('created_at')"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Date
                      <component :is="getSortIcon('created_at')" v-if="getSortIcon('created_at')"
                        class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('id')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Order ID
                      <component :is="getSortIcon('id')" v-if="getSortIcon('id')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('status')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Status
                      <component :is="getSortIcon('status')" v-if="getSortIcon('status')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('payment_status')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Payment
                      <component :is="getSortIcon('payment_status')" v-if="getSortIcon('payment_status')"
                        class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Total Items
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Items
                  </th>
                  <th scope="col" @click="handleSort('total_amount')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Total
                      <component :is="getSortIcon('total_amount')" v-if="getSortIcon('total_amount')"
                        class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="order in orders" :key="order.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                    {{ formatDate(order.created_at) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    <router-link :to="`/manage/orders/${order.id}`" class="text-indigo-600 hover:text-indigo-900">
                      {{ order.id }}
                    </router-link>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                      :class="getStatusColor(order.status)">
                      {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                      :class="getPaymentStatusColor(order.payment_status)">
                      {{ order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ getTotalItems(order.items) }}
                  </td>
                  <td class="px-3 py-4 text-sm text-gray-500">
                    <div class="flex items-center space-x-2">
                      <img :src="order.items[0]?.image" :alt="order.items[0]?.name"
                        class="h-8 w-8 rounded-md object-cover">
                      <span>{{ getItemsSummary(order.items) }}</span>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    ${{ order.total_amount }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <TablePagination v-if="orders.length > 0" class="mt-4" :total="pagination.total" :current-page="pagination.page"
      :page-size="pagination.size" :total-pages="pagination.pages" @page-change="handlePageChange" />
  </div>
</template>
