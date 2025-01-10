<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import {
  UserCircleIcon,
  ShoppingBagIcon,
  ArrowLeftStartOnRectangleIcon,
  ShoppingCartIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUser()
})

const handleLogout = () => {
  userStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <header class="bg-white shadow">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-gray-900">Shop</router-link>
        </div>
        <div class="flex items-center space-x-4">
          <template v-if="userStore.isLoggedIn">
            <div class="relative group">
              <button class="flex items-center gap-2">
                <img :src="userStore.user?.avatar || '/src/assets/default-avatar.png'" alt="User avatar"
                  class="w-8 h-8 rounded-full">
                <span class="text-gray-600">{{ userStore.user?.name || 'Name' }}</span>
              </button>

              <div
                class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300">
                <div class="py-1">
                  <router-link to="/manage/account-settings"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <UserCircleIcon class="mr-3 h-5 w-5 text-gray-400" />
                    Account Settings
                  </router-link>
                  <router-link to="/orders"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <ShoppingBagIcon class="mr-3 h-5 w-5 text-gray-400" />
                    Orders
                  </router-link>
                  <button @click="handleLogout"
                    class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <ArrowLeftStartOnRectangleIcon class="mr-3 h-5 w-5 text-gray-400" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </template>
          <router-link v-else to="/auth/login" class="text-gray-600 hover:text-gray-900">Login</router-link>
          <router-link to="/cart" class="text-gray-600 hover:text-gray-900 flex items-center">
            <ShoppingCartIcon class="h-6 w-6" />
            <span class="ml-1">(0)</span>
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>
