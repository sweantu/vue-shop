<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '../services/productService'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const selectedImage = ref('')
const isLoading = ref(true)

onMounted(async () => {
  const { data, error } = await productService.getProduct(route.params.id)
  if (error) {
    router.push('/404')
    return
  }
  product.value = data
  selectedImage.value = data.images[0]
  isLoading.value = false
})
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="!isLoading && product" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Image Gallery -->
      <div class="space-y-4">
        <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
          <img :src="selectedImage" :alt="product.name" class="h-full w-full object-cover object-center">
        </div>
        <div class="grid grid-cols-4 gap-4">
          <button v-for="image in product.images" :key="image" @click="selectedImage = image"
            class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg"
            :class="{ 'ring-2 ring-indigo-500': selectedImage === image }">
            <img :src="image" :alt="product.name" class="h-full w-full object-cover object-center">
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ product.name }}</h1>
          <p class="mt-2 text-gray-500">{{ product.description }}</p>
        </div>

        <div class="flex items-center justify-between">
          <p class="text-3xl font-bold text-gray-900">${{ product.price }}</p>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            :class="product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock' }}
          </span>
        </div>

        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-500">Category:</span>
            <span class="text-sm bg-gray-100 px-2 py-1 rounded">{{ product.category }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-500">SKU:</span>
            <span class="text-sm">{{ product.sku }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-500">Tags:</span>
            <div class="flex gap-1">
              <span v-for="tag in product.tags" :key="tag" class="text-xs bg-gray-100 px-2 py-1 rounded">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <button class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          :disabled="product.stock === 0">
          {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
        </button>
      </div>
    </div>

    <div v-else-if="isLoading" class="text-center py-12">
      Loading...
    </div>
  </main>
</template>
