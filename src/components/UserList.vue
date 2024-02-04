<template>
  <div class="w-full md:w-96 h-full overflow-y-scroll flex flex-col">
    <div class="sticky top-0 p-4 bg-white shadow z-10">
      <!-- Search input field -->
      <form>
        <img :src="logoImage" alt="vcTradeLogo" class="w-24 h-10" />
        <input
          v-model="searchText"
          id="search"
          class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-orange-500 block w-full rounded-md sm:text-sm focus:ring-1"
          type="text"
          placeholder="Search user"
        />
      </form>
      <div class="flex flex-wrap items-center gap-1 py-2">
        <p>Filters:</p>
        <!-- Favorites filters -->
        <div class="text-orange-500">
          <HeartSolidIcon
            data-test="filter-favorite-on"
            v-if="filterFavoritesOnly"
            @click="filterUsersFavoritesOnly()"
          />
          <HeartOutlinedIcon
            data-test="filter-favorite-off"
            v-else
            @click="filterUsersFavoritesOnly()"
          />
        </div>
        <!-- Gender filters -->
        <div v-for="gender in ['female', 'male']" :key="gender">
          <TagPill
            :data-test="`filter-gender-${gender}`"
            :active="filterGender == gender"
            @click="filterUserByGender(gender)"
          >
            {{ gender }}
          </TagPill>
        </div>
        <div></div>
        <!-- Custom tags filters -->
        <div v-for="tag in allTags" :key="tag + filterTag + allTags">
          <TagPill
            :data-test="`filter-tag-${tag}`"
            :active="filterTag == tag"
            @click="filterUserForTag(tag)"
          >
            {{ tag }}
          </TagPill>
        </div>
      </div>
    </div>

    <!-- Users -->
    <div v-if="users.length">
      <div class="w-full p-4" v-for="user in users" :key="user.id.value">
        <UserListItem
          :data-test="user.id.value"
          :user="user"
          @click="selectUser(user)"
          @selectedUser="setActiveUser"
          :isActive="isActive(user.id.value, activeUserId)"
        />
      </div>
    </div>
    <div v-else>
      <div class="w-full p-8 border-2 rounded-lg hover:bg-opacity-25 text-center text-orange-500">
        <div class="flex flex-col items-center">
          <span class="font-semibold text-xl mb-2">No results found</span>
          <span class="text-gray-600">Please enter another search text and try again.</span>
        </div>
      </div>
    </div>

    <!-- Load more -->
    <div v-if="showLoadMore" ref="loadMoreTarget" class="w-full p-4">
      <button
        :disabled="isFetching"
        class="w-full py-2 border-2 rounded-lg disabled:opacity-25"
        @click="loadMoreUsers"
      >
        More results
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, defineEmits } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { useStore } from '@/store'
import { useRandomUser } from '@/composables/useRandomUser'
import UserListItem from '@/components/UserListItem.vue'
import HeartSolidIcon from '@/components/icons/HeartSolidIcon.vue'
import HeartOutlinedIcon from '@/components/icons/HeartOutlinedIcon.vue'
import TagPill from '@/components/TagPill.vue'
import { useUserTags } from '@/composables/useUserTags'
import type { User } from '@/api/randomuser/RandomUserResponse'
import logoImage from '@/assets/logo.jpeg'

const logo = ref(logoImage)
const searchText = ref('')
const store = useStore()
const { loadMoreUsers, isFetching } = await useRandomUser(store)
const emits = defineEmits(['userSelected'])

// event communication to the App.vue component
const selectUser = (user: User) => {
  store.commit('setSelectedUser', user)
  emits('userSelected', true)
}

const activeUserId = ref('')
const setActiveUser = (user: User) => {
  activeUserId.value = user.id.value
}

// set which user is active
const isActive = (userId: string, activeUserId: string) => {
  return userId !== null && activeUserId !== null ? userId === activeUserId : false
}

// Filter favorites only
const filterFavoritesOnly = ref(false)
const filterUsersFavoritesOnly = () => {
  filterFavoritesOnly.value = !filterFavoritesOnly.value
}

// Filter by tag
const { allTags, userTags } = useUserTags(store)
const filterTag = ref<string | null>(null)
const filterUserForTag = (tag: string) => {
  if (filterTag.value === tag) {
    filterTag.value = null
  } else {
    filterTag.value = tag
  }
}

// Filter by gender (m/w)
const filterGender = ref<string | null>(null)
const filterUserByGender = (gender: string) => {
  if (filterGender.value === gender) {
    filterGender.value = null
  } else {
    filterGender.value = gender
  }
}

// Filter users
const users = computed(() =>
  store.state.fetchedUsers
    .filter((user: User) => {
      if (searchText.value === '') return true
      const fullName = `${user.name.first} ${user.name.last}`
      return fullName.toLowerCase().includes(searchText.value.toLowerCase())
    })
    .filter((user: User) => {
      if (filterFavoritesOnly.value) {
        return store.state.favoriteUsers.find((u: User) => u.login.uuid === user.login.uuid)
      }
      return true
    })
    .filter((user: User) => {
      if (filterTag.value) {
        const userTag = userTags.value[user.login.uuid]
        if (userTag) {
          return userTag.includes(filterTag.value)
        }
        return false
      }
      return true
    })
    .filter((user: User) => {
      if (filterGender.value) {
        return user.gender === filterGender.value
      }
      return true
    })
)

// Show More results
const showLoadMore = computed(() => {
  return (
    filterGender?.value === null &&
    filterTag?.value === null &&
    !filterFavoritesOnly.value &&
    users.value.length >= 25
  )
})

// Infinite scroll
const loadMoreTarget = ref(null)
const loadMoreIsVisible = useElementVisibility(loadMoreTarget)
watch(loadMoreIsVisible, (isVisible) => {
  if (isVisible && showLoadMore.value) {
    loadMoreUsers()
  }
})
</script>