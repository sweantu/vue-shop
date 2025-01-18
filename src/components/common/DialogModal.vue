<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  maxWidth: {
    type: String,
    default: 'sm:max-w-lg'
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-10 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="close"></div>

    <!-- Modal panel -->
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div
        :class="[maxWidth, 'relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6']">
        <!-- Modal header -->
        <div>
          <h3 class="text-base font-semibold leading-6 text-gray-900">
            {{ title }}
          </h3>
        </div>

        <!-- Modal content -->
        <div class="mt-4">
          <slot></slot>
        </div>

        <!-- Modal actions -->
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
