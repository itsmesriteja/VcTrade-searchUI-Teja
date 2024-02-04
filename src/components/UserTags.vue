<template>
  <div>
    <!-- Create Tags headline -->
    <div class="text-center">
      <p class="font-semibold text-lg">Tags:</p>
    </div>

    <!-- Add tag input in the center of the page -->
    <div class="flex justify-center p-4">
      <form class="flex items-center gap-2 text-sm" @submit.prevent="">
        <input
          data-test="add-tag-input"
          v-model="newTag"
          class="px-2 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-orange-500 block w-full rounded-md sm:text-sm focus:ring-1"
          type="text"
          placeholder="Enter tag"
          @keyup.enter="createNewTag()"
        />
        <PlusSolidIcon
          data-test="add-tag-button"
          class="text-stone-700 cursor-pointer"
          @click="createNewTag()"
        />
      </form>
    </div>

    <!-- Display existing tags -->
    <div class="flex flex-wrap justify-center gap-1">
      <div v-for="tag in tags" :key="toTagKey(tag + uuid)">
        <TagPill>
          <div v-if="editTagActive(toTagKey(tag + uuid))">
            <input
              data-test="update-tag-input"
              v-model="tagToReplaceTag"
              id="tag"
              class="px-2 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-orange-500 block w-full rounded-full sm:text-sm focus:ring-1"
              type="text"
            />
          </div>
          <div v-else>
            {{ tag }}
          </div>
          <div v-if="editTagActive(toTagKey(tag + uuid))">
            <PencilSolidIcon
              data-test="update-tag-button-on"
              @click="editTag(toTagKey(tag + uuid), tag)"
            />
          </div>
          <div v-else>
            <PencilOutlinedIcon
              data-test="update-tag-button-off"
              @click="editTag(toTagKey(tag + uuid), tag)"
            />
          </div>
          <XCircleSolidIcon data-test="remove-tag-button" @click="removeTag(tag)" />
        </TagPill>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PlusSolidIcon from '@/components/icons/PlusSolidIcon.vue'
import XCircleSolidIcon from '@/components/icons/XCircleOutlinedIcon.vue'
import { useStore } from '@/store'
import TagPill from '@/components/TagPill.vue'
import { useUserTags } from '@/composables/useUserTags'
import type { User } from '@/api/randomuser/RandomUserResponse'
import PencilSolidIcon from '@/components/icons/PencilSolidIcon.vue'
import PencilOutlinedIcon from '@/components/icons/PencilOutlinedIcon.vue'

const store = useStore()
const user = computed<User>(() => store.getters.selectedUser)
const uuid = computed(() => user.value.login.uuid)
const newTag = ref('')
const tagToReplaceTag = ref('')
const { addTagToUser, removeTag, updateTag, tags } = useUserTags(store)

// creating a new tag
const createNewTag = () => {
  if (newTag.value === '') return
  if (!user.value) return
  addTagToUser(user.value, newTag.value)
  newTag.value = ''
}

// Editing the tag
const tagToEdit = ref<string | null>(null)
const toTagKey = (...vars: string[]) => vars.join('-')
const editTagActive = (key: string) => {
  return key === tagToEdit.value
}
const editTag = (key: string, originalTag: string) => {
  if (editTagActive(key)) {
    updateTag(originalTag, tagToReplaceTag.value)
    tagToEdit.value = null
    tagToReplaceTag.value = ''
  } else {
    tagToEdit.value = key
    tagToReplaceTag.value = originalTag
  }
}
</script>