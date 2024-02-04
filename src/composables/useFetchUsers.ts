import { useFetch } from '@vueuse/core';
import { getFetchUsersURL } from '@/api/randomuser';
import type { RandomUserResponse } from '@/api/randomuser/RandomUserResponse';

export async function useFetchUsers(page: number = 0) {
  const url = getFetchUsersURL({
    page: page,
  })

  const result = await useFetch<RandomUserResponse>(url)
  .get()
  .json()

  return result
}