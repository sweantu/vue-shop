<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { productService } from '../services/productService'

const route = useRoute()
const router = useRouter()

const products = ref([])
const totalPages = ref(0)
const isLoading = ref(false)

const filters = ref({
  page: parseInt(route.query.page) || 1,
  size: parseInt(route.query.size) || 10,
  category: route.query.category || '',
  search: route.query.search || '',
  sort_by: route.query.sort_by || '',
  sort_order: route.query.sort_order || 'asc'
})

const categories = ['accessories', 'books', 'electronics'] // Add all your categories

const fetchProducts = async () => {
  isLoading.value = true
  const { data, error } = await productService.getProducts(filters.value)
  if (!error) {
    products.value = data.items
    totalPages.value = data.pages
  }
  isLoading.value = false
}

const updateFilters = (newFilters) => {
  filters.value = { ...filters.value, ...newFilters, page: 1 }
  router.push({ query: filters.value })
}

watch(() => route.query, () => {
  filters.value = {
    page: parseInt(route.query.page) || 1,
    size: parseInt(route.query.size) || 10,
    category: route.query.category || '',
    search: route.query.search || '',
    sort_by: route.query.sort_by || '',
    sort_order: route.query.sort_order || 'asc'
  }
  fetchProducts()
}, { immediate: true })
</script>

<template>
  <main class="flex-grow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters -->
      <div class="mb-8 space-y-4">
        <div class="flex items-center gap-4">
          <input v-model="filters.search" @input="updateFilters({ search: filters.search })" type="text"
            placeholder="Search products..." class="px-4 py-2 border rounded-md">

          <select v-model="filters.category" @change="updateFilters({ category: filters.category })"
            class="px-4 py-2 border rounded-md">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>

          <select v-model="filters.sort_by" @change="updateFilters({ sort_by: filters.sort_by })"
            class="px-4 py-2 border rounded-md">
            <option value="">Sort By</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
            <option value="created_at">Date</option>
          </select>

          <select v-model="filters.sort_order" @change="updateFilters({ sort_order: filters.sort_order })"
            class="px-4 py-2 border rounded-md">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="!isLoading" class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
      <div v-else class="text-center py-12">
        Loading...
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex justify-center space-x-2">
        <button v-for="page in totalPages" :key="page" @click="updateFilters({ page })" class="px-4 py-2 rounded-md"
          :class="filters.page === page ? 'bg-indigo-600 text-white' : 'bg-gray-200'">
          {{ page }}
        </button>
      </div>
    </div>
  </main>
</template>
