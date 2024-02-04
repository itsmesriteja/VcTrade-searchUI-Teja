import type { Store } from 'vuex';
import type { State } from '@/store';
import { ref } from 'vue';
import { useFetchUsers } from './useFetchUsers';

export async function useRandomUser(store: Store<State>, page = 0) {
  const refIsFetching = ref(false)
  const refError = ref(null)
  const refRandomUserError = ref(null)
  const loadMoreUsers = async () => {
    const { data, isFetching: fetching, error } = await useFetchUsers(page)
    refIsFetching.value = fetching.value
    refError.value = error.value
    refRandomUserError.value = data.value?.error
    if (error.value) {
      return
    }
    if (data.value) {
      store.commit('addFetchedUsers', data.value?.results)
    }
  }

  if (store.state.fetchedUsers.length == 0) {
    await loadMoreUsers()
  }

  return {
    loadMoreUsers,
    isFetching: refIsFetching,
    error: refError,
    randomUserError: refRandomUserError,
  }
}