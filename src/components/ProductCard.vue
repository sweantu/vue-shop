<script setup>
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="group relative">
    <router-link :to="`/products/${product.id}`">
      <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
        <img :src="product.images[0]" :alt="product.name"
          class="h-full w-full object-cover object-center lg:h-full lg:w-full">
      </div>
      <div class="mt-4 flex justify-between">
        <div>
          <h3 class="text-sm text-gray-700">
            <span>{{ product.name }}</span>
          </h3>
          <p class="mt-1 text-sm text-gray-500">{{ product.description }}</p>
          <div class="mt-1 flex items-center gap-2">
            <span class="text-xs bg-gray-100 px-2 py-1 rounded">{{ product.category }}</span>
            <span class="text-xs text-gray-500">Stock: {{ product.stock }}</span>
          </div>
        </div>
        <p class="text-sm font-medium text-gray-900">${{ product.price }}</p>
      </div>
    </router-link>
    <button class="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:bg-gray-400"
      :disabled="product.stock === 0" @click="cartStore.addItem(product.id)">
      {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
    </button>
  </div>
</template>
