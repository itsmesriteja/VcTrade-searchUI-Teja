<template>
  <!-- Users by country bar chart -->
    <Bar :data="usersByCountryChartData" :options="chartOptions" />
  <!-- Users by Gender Pie chart-->
  <div class="flex items-center justify-center my-24">
    <div class="h-96 w-96 md:h-128 md:w-128 lg:h-192 lg:w-160 xl:h-192 xl:w-192">
      <Pie :data="usersByGenderChartData" :options="chartOptions" />
    </div>
  </div>

  <!-- Users by Age bar chart -->
    <Bar :data="usersByAgeRangeChartData" :options="chartOptions" />
  <!-- Users by Tag   bar chart -->
  <div class="mt-24 w-full">
    <Bar :data="usersByTagChartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'
import type { User, Users } from '@/api/randomuser/RandomUserResponse'
import { useUserTags } from '@/composables/useUserTags'
import { useStore } from '@/store'

const store = useStore()

// fetch users form the store
const users = computed<Users>(() => store.getters.fetchedUsers)

// Sort users by country
const usersByCountry = computed(() => {
  const usersByCountry = users.value.reduce((acc, user) => {
    const country = user.location.country
    if (!acc[country]) {
      acc[country] = 0
    }
    acc[country]++
    return acc
  }, {} as Record<string, number>)
  return Object.entries(usersByCountry).sort((a, b) => b[1] - a[1])
})

const usersByCountryChartData = computed(() => {
  return {
    labels: usersByCountry.value.map(([country]) => country),
    datasets: [
      {
        label: 'Users by country',
        data: usersByCountry.value.map(([, count]) => count),
        backgroundColor: '#F18A18',
        hoverBackgroundColor: '#424242'
      }
    ]
  }
})

// Sort users by gender
const usersByGender = computed(() => {
  const usersByCountry = users.value.reduce((acc, user) => {
    const gender = user.gender
    if (!acc[gender]) {
      acc[gender] = 0
    }
    acc[gender]++
    return acc
  }, {} as Record<string, number>)
  return Object.entries(usersByCountry).sort((a, b) => b[1] - a[1])
})
const usersByGenderChartData = computed(() => {
  return {
    labels: usersByGender.value.map(([gender]) => gender),
    datasets: [
      {
        label: 'Users by gender',
        data: usersByGender.value.map(([, count]) => count),
        backgroundColor: ['#F18A18', '#424242']
      }
    ]
  }
})

// Sort users by age range (the ranges are sub-sets of 5 years: 0-5 / 5-10 / 10-15…)
const usersByAgeRange = computed(() => {
  const usersByAgeRange = users.value.reduce((acc, user) => {
    const ageRange = Math.floor(user.dob.age / 5) * 5
    if (!acc[ageRange]) {
      acc[ageRange] = 0
    }
    acc[ageRange]++
    return acc
  }, {} as Record<number, number>)
  return Object.entries(usersByAgeRange).sort((a, b) => Number(a[0]) - Number(b[0]))
})
const usersByAgeRangeChartData = computed(() => {
  return {
    labels: usersByAgeRange.value.map(([ageRange]) => ageRange),
    datasets: [
      {
        label: 'Users by age range',
        data: usersByAgeRange.value.map(([, count]) => count),
        backgroundColor: '#F18A18',
        hoverBackgroundColor: '#424242'
      }
    ]
  }
})

// Group users by custom tag
const { userTags, allTags } = useUserTags(store)

const usersGroupedByTag = computed(() => {
  // Using allTags we search for the users that have that tag
  // and we count them
  const usersGroupedByTag = allTags.value.reduce((acc, tag) => {
    const usersWithTag = Object.keys(userTags.value).filter((userId) =>
      userTags.value[userId].includes(tag)
    )
    acc[tag] = usersWithTag.length
    return acc
  }, {} as Record<string, number>)
  return Object.entries(usersGroupedByTag).sort((a, b) => b[1] - a[1])
})

const usersByTagChartData = computed(() => {
  return {
    labels: allTags.value,
    datasets: [
      {
        label: 'Users grouped by tag',
        data: usersGroupedByTag.value.map(([, count]) => count),
        backgroundColor: '#F18A18',
        hoverBackgroundColor: '#424242'
      }
    ]
  }
})

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const chartOptions = ref({
  responsive: true
})
</script>