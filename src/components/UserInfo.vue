<template>
  <!-- Fallback template: if there is no user -->
  <div class="flex items-center justify-center h-screen" v-if="!user">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Welcome to VC Trade Search UI</h1>
      <p class="text-lg mb-4">Please select a user to proceed further</p>
    </div>
  </div>
  <!-- User Info -->
  <div v-else>
    <div class="flex flex-col items-center justify-center w-full h-full p-4">
      <img class="p-8 rounded-full w-64 h-64" :src="user.picture.large" :alt="user.name.first" />

      <div class="flex flex-col items-center w-full p-2">
        <p class="font-bold text-lg">{{ userName }}</p>
        <p class="font-thin">ID: {{ user.id.value }}</p>
        <p>Email: {{ user.email }}</p>
        <p>Age: {{ user.dob.age }}</p>
        <p>City: {{ user.location.city }}</p>
        <p>Country: {{ user.location.country }}</p>

        <div @click="toggleFavorite()" class="mt-4 cursor-pointer">
          <HeartSolidIcon v-if="isFavorite" class="text-red-500" data-test="favorite" />
          <HeartOutlinedIcon v-else class="text-red-500" data-test="no-favorite" />
        </div>
      </div>

      <div class="flex items-center mt-4 text-sm">
        <UserTags />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { computed, ref } from 'vue'
import { useCapitalize } from '@/composables/useCapitalize'
import HeartOutlinedIcon from '@/components/icons/HeartOutlinedIcon.vue'
import HeartSolidIcon from '@/components/icons/HeartSolidIcon.vue'
import type { User } from '@/api/randomuser/RandomUserResponse'
import UserTags from '@/components/UserTags.vue'

const store = useStore()
const capitalize = useCapitalize()
const user = computed<User>(() => store.getters.selectedUser)

// capitalizing the user name
const userName = computed(() => {
  if (user.value) {
    return `${capitalize.capitalizeFirstLetters(
      user.value.name.first
    )} ${capitalize.capitalizeFirstLetters(user.value.name.last)}`
  }
  return ''
})

// Favourite toggling
const toggleFavorite = () => {
  if (user.value) {
    store.commit('toggleFavorite', user.value)
  }
}

const favoriteUsers = ref(store.getters.favoriteUsers)
// finding whether the user is already favourite or not
const isFavorite = computed(() => {
  return favoriteUsers.value.find((u: User) => u.login.uuid === user.value?.login.uuid)
})
</script>