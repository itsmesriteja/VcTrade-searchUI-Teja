import { describe, test, expect, vi } from 'vitest'
import { useUserTags } from './useUserTags'
import type { User } from '../api/randomuser/RandomUserResponse'

describe('useUserTags', () => {
    test('should return a list of tags', async () => {
        const store = {
            getters: {
                selectedUser: {
                    login: {
                        uuid: '1'
                    }
                },
                userTags: {
                    '1': ['test']
                }
            }
        }
        const { tags } = await useUserTags(store as any)
        expect(tags.value).toEqual(['test'])
    })

    test('should return an empty list of tags', async () => {
        const store = {
            getters: {
                selectedUser: {
                    login: {
                        uuid: '1'
                    }
                },
                userTags: {
                    '1': []
                }
            }
        }
        const { tags } = await useUserTags(store as any)
        expect(tags.value).toEqual([])
    })

    test('should commit addTagToUser', async () => {
        const store = {
            commit: vi.fn(),
            getters: {
                selectedUser: {
                    login: {
                        uuid: '1'
                    }
                } as User,
                userTags: {
                    '1': []
                }
            }
        }
        const { addTagToUser } = await useUserTags(store as any)
        addTagToUser(store.getters.selectedUser, 'test')
        expect(store.commit).toHaveBeenCalledWith('addTagToUser', { user: store.getters.selectedUser, tag: 'test' })
    })

    test('should commit removeTag', async () => {
        const store = {
            commit: vi.fn(),
            getters: {
                selectedUser: {
                    login: {
                        uuid: '1'
                    }
                } as User,
                userTags: {
                    '1': []
                }
            }
        }
        const { removeTag } = await useUserTags(store as any)
        removeTag('test')
        expect(store.commit).toHaveBeenCalledWith('removeTag', { uuid: '1', tag: 'test' })
    })

    test('should commit updateTag', async () => {
        const store = {
            commit: vi.fn(),
            getters: {
                selectedUser: {
                    login: {
                        uuid: '1'
                    }
                } as User,
                userTags: {
                    '1': []
                }
            }
        }
        const { updateTag } = await useUserTags(store as any)
        updateTag('test', 'test2')
        expect(store.commit).toHaveBeenCalledWith('updateTag', { uuid: '1', oldTag: 'test', newTag: 'test2' })
    })

    test('should return all tags', async () => {
        const store = {
            getters: {
                tags: ['test']
            }
        }
        const { allTags } = await useUserTags(store as any)
        expect(allTags.value).toEqual(['test'])
    })

})