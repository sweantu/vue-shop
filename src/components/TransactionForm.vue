<script setup>
import { ref } from 'vue'

defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['deposit', 'withdraw'].includes(value)
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  amount: '',
  description: ''
})

const handleSubmit = () => {
  emit('submit', form.value)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
      <div class="mt-1">
        <input type="number" step="0.01" min="0" v-model="form.amount" id="amount"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="0.00">
      </div>
    </div>
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">Description (Optional)</label>
      <div class="mt-1">
        <textarea v-model="form.description" id="description" rows="3"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter description..."></textarea>
      </div>
    </div>
    <div v-if="error" class="text-sm text-red-600">
      {{ error }}
    </div>

    <div class="flex justify-end gap-2">
      <button type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
        @click="handleCancel">
        Cancel
      </button>
      <button type="button" @click="handleSubmit" :disabled="isSubmitting" :class="[
        type === 'deposit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700',
        'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2'
      ]">
        {{ isSubmitting ? 'Processing...' : 'Confirm' }}
      </button>
    </div>
  </div>
</template>
