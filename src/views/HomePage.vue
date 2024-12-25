<script setup>
import { ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'

const products = ref([
  {
    id: 1,
    name: 'Product 1',
    price: 99.99,
    description: 'Sample description',
    image: 'https://via.placeholder.com/300'
  },
  {
    id: 2,
    name: 'Product 2',
    price: 149.99,
    description: 'Sample description',
    image: 'https://via.placeholder.com/300'
  }
])
</script>

<template>
  <main class="flex-grow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">Products</h2>
      <div class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </div>
  </main>
</template>
