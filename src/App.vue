<template>
  <div class="flex h-screen overflow-hidden">
    <div class="flex-shrink-0">
      <!-- User List Component -->
      <Suspense>
        <UserList @userSelected="handleUserSelectEvent" />
        <template #fallback>
          <div class="p-4 font-bold">
            <p>Loading...</p>
          </div>
        </template>
      </Suspense>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-y-auto">
      <!-- Header with Statistics Icon -->
      <div class="flex justify-end items-center px-4 md:px-8 py-2">
        <p class="mr-2">Overall Statistics:</p>
        <div class="cursor-pointer">
          <div v-if="showCharts">
            <ChartSolidIcon @click="toggleCharts" />
          </div>
          <div v-else>
            <ChartOutlinedIcon @click="toggleCharts" />
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div v-if="showCharts & !userSelected" class="p-4">
        <ChartStatistics />
      </div>
      <div v-else class="p-4">
        <UserInfo />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserList from '@/components/UserList.vue'
import UserInfo from '@/components/UserInfo.vue'
import ChartOutlinedIcon from '@/components/icons/ChartOutlinedIcon.vue'
import ChartSolidIcon from '@/components/icons/ChartSolidIcon.vue'
import ChartStatistics from '@/components/ChartStatistics.vue'
import logoImage from '@/assets/logo.jpeg'
import { ref, defineEmits } from 'vue'

const logo = ref(logoImage)
const showCharts = ref(false)

// toggling charts
const toggleCharts = () => {
  showCharts.value = !showCharts.value
  userSelected.value = !userSelected.value
}

// component communication with userlist
const userSelected = ref(true)
const handleUserSelectEvent = (isSelected) => {
  userSelected.value = isSelected
  showCharts.value = !isSelected
}
</script>