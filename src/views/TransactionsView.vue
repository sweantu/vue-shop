<script setup>
import { ref, onMounted, watch } from 'vue'
import TablePagination from '../components/common/TablePagination.vue'
import { formatDate } from '../utils/dateFormat'
import { transactionService } from '../services/transactionService'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'


const transactions = ref([])
const isLoading = ref(false)
const error = ref(null)

// Filter and sort states
const filters = ref({
  type: '',
  status: '',
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

const fetchData = async () => {
  isLoading.value = true
  error.value = null

  const params = {
    page: pagination.value.page,
    size: pagination.value.size,
    sort_order: sorting.value.order,
    sort_by: sorting.value.column,
    ...(filters.value.type && { type: filters.value.type }),
    ...(filters.value.status && { status: filters.value.status }),
    ...(filters.value.search && { search: filters.value.search })
  }

  const { data, error: apiError } = await transactionService.getTransactions(params)
  if (apiError) {
    error.value = apiError
    return
  }

  if (data) {
    transactions.value = data.items
    pagination.value = {
      total: data.total,
      page: data.page,
      size: data.size,
      pages: data.pages
    }
  }
  isLoading.value = false
}

const handleSort = (column) => {
  if (sorting.value.column === column) {
    sorting.value.order = sorting.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sorting.value.column = column
    sorting.value.order = 'asc'
  }
  fetchData()
}

const handlePageChange = (newPage) => {
  pagination.value.page = newPage
  fetchData()
}

const getSortIcon = (column) => {
  if (sorting.value.column !== column) return null
  return sorting.value.order === 'asc' ? ChevronUpIcon : ChevronDownIcon
}

const getStatusColor = (status) => {
  const colors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getTypeColor = (type) => {
  const colors = {
    deposit: 'text-green-600',
    withdraw: 'text-red-600',
    payment: 'text-blue-600'
  }
  return colors[type] || 'text-gray-600'
}

watch([filters], () => {
  pagination.value.page = 1
  fetchData()
}, { deep: true })

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Transactions</h1>
        <p class="mt-2 text-sm text-gray-700">
          Showing {{ transactions.length }} of {{ pagination.total }} transactions
        </p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
        <select v-model="filters.type"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option value="">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="payment">Payment</option>
        </select>
      </div>
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <select v-model="filters.status"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
        <input type="text" v-model="filters.search"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search transactions...">
      </div>
    </div>

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
                  <th scope="col" @click="handleSort('type')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Type
                      <component :is="getSortIcon('type')" v-if="getSortIcon('type')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('amount')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Amount
                      <component :is="getSortIcon('amount')" v-if="getSortIcon('amount')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('balance')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Balance
                      <component :is="getSortIcon('balance')" v-if="getSortIcon('balance')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" @click="handleSort('status')"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                    <div class="flex items-center">
                      Status
                      <component :is="getSortIcon('status')" v-if="getSortIcon('status')" class="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="transaction in transactions" :key="transaction.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                    {{ formatDate(transaction.created_at) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm" :class="getTypeColor(transaction.type)">
                    {{ transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm font-medium" :class="getTypeColor(transaction.type)">
                    {{ transaction.type === 'withdraw' ? '-' : '+' }}${{ transaction.amount }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    ${{ transaction.balance }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                      :class="getStatusColor(transaction.status)">
                      {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ transaction.description || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <TablePagination :total="pagination.total" :current-page="pagination.page" :page-size="pagination.size"
      :total-pages="pagination.pages" @page-change="handlePageChange" />
  </div>
</template>
