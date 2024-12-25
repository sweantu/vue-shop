<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo } from '../services/api'

const router = useRouter()
const isLoggedIn = !!localStorage.getItem('token')
const user = ref(null)

onMounted(async () => {
  if (isLoggedIn) {
    const { data, error } = await getUserInfo()
    if (!error) {
      user.value = data
    } else {
      user.value = null
      localStorage.removeItem('token')
    }
  }
})

const handleLogout = () => {
  localStorage.removeItem('token')
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
          <template v-if="isLoggedIn">
            <div class="relative group">
              <div class="flex items-center gap-2">
                <img :src="user?.avatar || '/src/assets/default-avatar.png'" alt="User avatar"
                  class="w-8 h-8 rounded-full">
                <span class="text-gray-600">{{ user?.name || 'Name' }}</span>
              </div>

              <div
                class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                  <router-link to="/account"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
                    role="menuitem">
                    Account Settings
                  </router-link>
                  <router-link to="/orders"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
                    role="menuitem">
                    My Orders
                  </router-link>
                  <button @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
                    role="menuitem">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </template>
          <router-link v-else to="/auth/login" class="text-gray-600 hover:text-gray-900">Login</router-link>
          <router-link to="/cart" class="text-gray-600 hover:text-gray-900">Cart (0)</router-link>
        </div>
      </div>
    </nav>
  </header>
</template>
