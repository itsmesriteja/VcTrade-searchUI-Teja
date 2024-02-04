<template>
  <div
    class="px-3 py-1 text-sm font-bold text-center bg-gray-200 rounded-full min-w-16 cursor-pointer"
    :class="{ border: active, 'border-orange-400': active }"
  >
    <div class="flex items-center justify-center gap-1">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    required: false,
    default: false
  }
})

const active = computed(() => props.active)
</script>