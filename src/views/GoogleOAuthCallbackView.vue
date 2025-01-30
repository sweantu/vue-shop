<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h2 class="text-lg font-medium">Processing authentication...</h2>
      <p class="mt-2 text-sm text-gray-500">Please wait while we complete your sign-in.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { userService } from '../services/userService'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  try {
    // Get code from URL and decode it
    const code = decodeURIComponent(route.query.code)

    if (!code) {
      throw new Error('Authorization code not found')
    }

    // Send code to backend
    const { data, error } = await userService.googleOAuthCallback(code)

    if (error) {
      throw new Error(error)
    }

    // Login user (backend will set cookie)
    userStore.login(data.access_token)

    // Redirect to home or intended page
    router.push('/')
  } catch (error) {
    console.error('Google OAuth error:', error)
    router.push('/login?error=auth_failed')
  }
})
</script>
