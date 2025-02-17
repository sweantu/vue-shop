<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { userService } from '@/services/userService'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUser()
  if (userStore.isLoggedIn) {
    router.push('/')
  }
})

const formData = ref({
  username: '',
  password: ''
})

const errors = ref({})
const isLoading = ref(false)
const successMessage = ref('')

const handleSubmit = async (e) => {
  e.preventDefault()
  errors.value = {}
  successMessage.value = ''

  if (!formData.value.username) {
    errors.value.username = 'Username is required'
  }
  if (!formData.value.password) {
    errors.value.password = 'Password is required'
  }

  if (Object.keys(errors.value).length === 0) {
    isLoading.value = true
    const { data, error } = await userService.login(formData.value)

    if (error) {
      errors.value.submit = error
    } else {
      formData.value = {
        username: '',
        password: ''
      }
      successMessage.value = 'Login successful!'
      userStore.login(data.access_token)
      router.push('/')
    }
    isLoading.value = false
  }
}

const handleGoogleLogin = async () => {
  const { data, error } = await userService.googleOAuthLogin()
  if (error) {
    console.error('Google OAuth error:', error)
  } else {
    window.location.href = data.auth_url
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errors.submit" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ errors.submit }}</p>
          </div>
        </div>
      </div>

      <form class="mt-8 space-y-4" @submit="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input id="username" v-model="formData.username" type="text"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-500': errors.username }" />
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" v-model="formData.password" type="password"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-500': errors.password }" />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <!-- Google OAuth Button -->
      <div>
        <button @click="handleGoogleLogin"
          class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <img src="/src/assets/Google-sso.png" alt="Sign in with Google" class="h-5 w-5 mr-2" />
          Sign in with Google
        </button>
      </div>

      <div class="text-right text-sm">
        Don't have an account?
        <router-link to="/register" class="text-indigo-600 hover:text-indigo-500">
          Register
        </router-link>
      </div>
    </div>
  </div>
</template>
