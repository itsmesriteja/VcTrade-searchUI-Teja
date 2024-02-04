import type { Store } from "vuex";
import type { State } from "@/store";
import { computed, ref } from 'vue'
import type { UserTagsMap } from "@/store";
import type { User } from "@/api/randomuser/RandomUserResponse";

export function useUserTags(store: Store<State>) {
  const user = computed<User>(() => store.getters.selectedUser)
  const allUserTags = ref<UserTagsMap>(store.getters.userTags)
  const tags = computed(() => {
    const uuid = user.value?.login.uuid
    if (uuid) {
      return allUserTags.value[uuid] || []
    }
    return []
  })


  const addTagToUser = (user: User, tag: string) => {
    const uuid = user?.login.uuid
    if (uuid) {
      store.commit('addTagToUser', { user, tag })
    }
  }

  const removeTag = (tag: string) => {
    const uuid = user.value?.login.uuid
    if (uuid) {
      store.commit('removeTag', { uuid, tag })
    }
  }

  const updateTag = (oldTag: string, newTag: string) => {
    const uuid = user.value?.login.uuid
    if (uuid) {
      store.commit('updateTag', { uuid, oldTag, newTag })
    }
  }

  const allTags = ref<string[]>(store.getters.tags)

  return {
    tags,
    addTagToUser,
    removeTag,
    updateTag,
    userTags: allUserTags,
    allTags,
  }
}