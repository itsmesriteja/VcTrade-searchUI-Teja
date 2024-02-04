<template>
  <div
    @click="activeUser(user)"
    :class="{ 'active-user': isActive }"
    class="flex w-full p-2 border-2 rounded-lg hover:shadow-lg hover:scale-105 hover:bg-orange-500 hover:bg-opacity-25 cursor-pointer"
  >
    <div class="flex-shrink-0">
      <img class="p-2 rounded-full" :src="user.picture.thumbnail" :alt="user.name.first" />
    </div>
    <div
      class="flex flex-col justify-center w-full overflow-hidden text-ellipsis text-nowrap whitespace-nowrap"
    >
      <span class="font-semibold">{{
        capitalize.capitalizeFirstLetters(`${user.name.first} ${user.name.last}`)
      }}</span>
      <span class="text-gray-600">{{ user.email }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
import type { User } from '@/api/randomuser/RandomUserResponse'
import { useCapitalize } from '@/composables/useCapitalize'

const props = defineProps({
  user: {
    required: true,
    type: Object as () => User
  },

  isActive: {
    type: Boolean
  }
})
const user = computed(() => props.user)
const isActive = computed(() => props.isActive)
const capitalize = useCapitalize()
const emits = defineEmits(['selectedUser'])
const activeUser = (user: User) => {
  emits('selectedUser', user)
}
</script>

<style scoped>
.active-user {
  background-color: #f18a18;
  color: white;
}
</style>