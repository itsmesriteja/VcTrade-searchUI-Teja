import { test, describe, expect, beforeEach } from 'vitest'
// store.spec.ts
import { store } from './store'
import type { User } from './api/randomuser/RandomUserResponse'

describe('Vuex Store', () => {

  // Clear store before each
  beforeEach(() => {
    store.state.favoriteUsers = []
    store.state.fetchedUsers = []
    store.state.selectedUser = null
    store.state.tags = []
    store.state.userTags = {}
  })

  describe('mutations', () => {

    test('should intestialize wtesth correct default state', () => {
      expect(store.state.fetchedUsers).toEqual([])
      expect(store.state.selectedUser).toBeNull()
      expect(store.state.favoriteUsers).toEqual([])
      expect(store.state.tags).toEqual([])
      expect(store.state.userTags).toEqual({})
    })

    test('should add fetched users correctly', () => {
      const users: User[] = [
        { login: { uuid: '1' } } as User,
        { login: { uuid: '2' } } as User
      ]
      store.commit('addFetchedUsers', users)
      expect(store.state.fetchedUsers).toEqual(users)
    })

    test('should set selected user correctly', () => {
      const user: User = { login: { uuid: '1' } } as User
      store.commit('setSelectedUser', user)
      expect(store.state.selectedUser).toEqual(user)
    })

    test('should set favorites correctly', () => {
      const users: User[] = [
        { login: { uuid: '1' } } as User,
        { login: { uuid: '2' } } as User
      ]
      store.commit('setFavorites', users)
      expect(store.state.favoriteUsers).toEqual(users)
    })

    test('should toggle favorite correctly', () => {
      const user: User = { login: { uuid: '1' } } as User
      store.commit('toggleFavorite', user)
      expect(store.state.favoriteUsers).toEqual([user])
      store.commit('toggleFavorite', user)
      expect(store.state.favoriteUsers).toEqual([])
    })

    test('should add tag to user correctly', () => {
      const user: User = { login: { uuid: '1' } } as User
      store.commit('addTagToUser', { user, tag: 'test' })
      expect(store.state.userTags[user.login.uuid]).toEqual(['test'])
      expect(store.state.tags).toEqual(['test'])
    })

    test('should remove tag correctly', () => {
      const user: User = { login: { uuid: '1' } } as User
      store.commit('addTagToUser', { user, tag: 'test' })
      store.commit('removeTag', { uuid: user.login.uuid, tag: 'test' })
      expect(store.state.userTags[user.login.uuid]).toEqual([])
      expect(store.state.tags).toEqual([])
    })

    test('should remove tag from user correctly', () => {
      const user: User = { login: { uuid: '1' } } as User
      store.commit('addTagToUser', { user, tag: 'test' })
      store.commit('addTagToUser', { user, tag: 'test2' })
      store.commit('removeTag', { uuid: user.login.uuid, tag: 'test' })
      expect(store.state.userTags[user.login.uuid]).toEqual(['test2'])
      expect(store.state.tags).toEqual(['test2'])
    })

    test('should update tag correctly', () => {
      const user: User = { login: { uuid: '1' } } as User
      store.commit('addTagToUser', { user, tag: 'test' })
      store.commit('updateTag', { oldTag: 'test', newTag: 'test2' })
      expect(store.state.userTags[user.login.uuid]).toEqual(['test2'])
      expect(store.state.tags).toEqual(['test2'])
    })
  })

  describe('getters', () => {
    test('should return correct favorite users', () => {
      const users: User[] = [
        { login: { uuid: '1' } } as User,
        { login: { uuid: '2' } } as User,
        { login: { uuid: '3' } } as User
      ]
      store.commit('setFavorites', users)
      expect(store.getters.favoriteUsers).toEqual(users)
    })

    test('should return correct fetched users', () => {
      const users: User[] = [
        { login: { uuid: '1' } } as User,
        { login: { uuid: '2' } } as User,
        { login: { uuid: '3' } } as User
      ]
      store.commit('addFetchedUsers', users)
      expect(store.getters.fetchedUsers).toEqual(users)
    })

    test('should return correct selected user', () => {
      const user: User = { login: { uuid: '1' } } as User
      store.commit('setSelectedUser', user)
      expect(store.getters.selectedUser).toEqual(user)
    })

    test('should return correct tags', () => {
      const tags = ['test', 'test2']
      store.commit('addTagToUser', { user: { login: { uuid: '1' } } as User, tag: 'test' })
      store.commit('addTagToUser', { user: { login: { uuid: '2' } } as User, tag: 'test2' })
      expect(store.getters.tags).toEqual(tags)
    })

    test('should return correct user tags', () => {
      const user: User = { login: { uuid: '1' } } as User
      store.commit('addTagToUser', { user, tag: 'test' })
      expect(store.getters.userTags).toEqual({ '1': ['test'] })
    })
  })
})