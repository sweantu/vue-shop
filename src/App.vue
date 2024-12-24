<script setup>
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'

const showLogin = ref(true)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex justify-center space-x-4 pt-8">
      <button @click="showLogin = true" class="px-4 py-2 text-sm font-medium"
        :class="showLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'">
        Login
      </button>
      <button @click="showLogin = false" class="px-4 py-2 text-sm font-medium"
        :class="!showLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'">
        Register
      </button>
    </div>

    <Transition name="fade" mode="out-in">
      <LoginForm v-if="showLogin" />
      <RegisterForm v-else />
    </Transition>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

