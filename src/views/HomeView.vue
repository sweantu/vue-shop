<script setup>
import { onMounted, ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { productService } from '../services/productService'



const products = ref([])
const isLoading = ref(false)

const fetchProducts = async () => {
  isLoading.value = true
  const { data, error } = await productService.getProducts()
  if (!error) {
    products.value = data.items
  }
  isLoading.value = false
}

onMounted(() => {
  fetchProducts()
})

</script>

<template>
  <main class="flex-grow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Products Grid -->
      <div v-if="!isLoading" class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
      <div v-else class="text-center py-12">
        Loading...
      </div>
      <div class="text-center mt-8">
        <router-link to="/products" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          View all products →
        </router-link>
      </div>
    </div>
  </main>
</template>
