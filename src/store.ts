import type { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import VuexPersistence from 'vuex-persist'
import type { User, Users } from './api/randomuser/RandomUserResponse'

// Overview of State properties
export interface State {
  fetchedUsers: Users,
  selectedUser: User | null,
  favoriteUsers: Users,
  tags: string[],
  userTags: UserTagsMap
}

// Type Signature for user tags
export interface UserTagsMap {
  [key: string]: string[]
}

// local storage for persistant data
const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage
})

export const store = createStore<State>({
  state: {
    fetchedUsers: [],
    selectedUser: null,
    favoriteUsers: [],
    tags: [],
    userTags: {}
  },

  mutations: {
    setFetchedUsers(state:State, users: Users) {
      state.fetchedUsers = users;
    },
    addFetchedUsers(state:State, users: Users) {
      state.fetchedUsers = [...state.fetchedUsers, ...users];
    },
    setSelectedUser(state:State, user: User | null) {
      state.selectedUser = user;
    },
    setFavorites(state:State, users: Users) {
      state.favoriteUsers = users;
    },

 
  /**
   * Toggles the favorite status of a user in the application state.
   *
   * @param state - The application state.
   * @param user - The user for which to toggle the favorite status.
   */
    toggleFavorite(state: State, user: User): void {
      // Find the index of the user in the favoriteUsers array.
      const index = state.favoriteUsers.findIndex((favoriteUser: User) => favoriteUser.login.uuid === user.login.uuid);
      
      // If the user is found in the favorites, remove them; otherwise, add them to the favorites.
      if (index > -1) {
        state.favoriteUsers.splice(index, 1);
      } else {
        state.favoriteUsers.push(user);
      }
    },

    /**
     * Adds a tag to a specific user and updates the application state.
     * @param state - The application state.
     * @param payload - An object containing the user and tag to be added.
     *   - user: The user to which the tag will be added.
     *   - tag: The tag to be added to the user.
     */
    addTagToUser(state: State, payload: { user: User; tag: string }): void {
      // Retrieve the current tags for the user or initialize an empty array.
      const tags = state.userTags[payload.user.login.uuid] ?? [];

      // Add the new tag to the user's list of tags.
      tags.push(payload.tag);

      // Update the userTags property in the state.
      state.userTags[payload.user.login.uuid] = tags;

      // Add the tag to the global list of tags if it doesn't exist.
      const tagIndex = state.tags.findIndex((t) => t === payload.tag);
      if (tagIndex === -1) {
        state.tags.push(payload.tag);
      }
    },

    /**
     * Mutation for removing a tag from a user and checking if it's used by any other user.
     */
    removeTag(state: State, { uuid, tag }: { uuid: string, tag: string }): void {
      // Remove tag from user
      const tags = state.userTags[uuid] ?? [];
      const index = tags.findIndex((t) => t === tag);
      if (index > -1) {
        tags.splice(index, 1);
      }
      state.userTags[uuid] = tags;

      // Check if tag is used by any other user; if not, delete it
      const tagIndex = Object.values(state.userTags).findIndex((t) => t.includes(tag));
      if (tagIndex === -1) {
        const globalTagIndex = state.tags.findIndex((t) => t === tag);
        if (globalTagIndex > -1) {
          state.tags.splice(globalTagIndex, 1);
        }
      }
    },

  /**
   * Mutation for updating a tag across all users and global tags.
   */
    updateTag(state:State , {oldTag, newTag}: {oldTag: string, newTag: string}) {
      // Search for the old tag in all users and replace it with the new tag
      const users = Object.keys(state.userTags);
      users.forEach((user) => {
        const tags = state.userTags[user];
        const index = tags.findIndex((t) => t === oldTag);
        if (index > -1) {
          tags.splice(index, 1, newTag);
          state.userTags[user] = tags;
        }
      })
      // Search for the old tag in all global tags and replace it with the new tag
      const tagIndex = state.tags.findIndex((t) => t === oldTag);
      if (tagIndex > -1) {
        state.tags.splice(tagIndex, 1, newTag);
      }
    }
  },

  getters: {
    fetchedUsers: (state:State) => state.fetchedUsers,
    selectedUser: (state:State) => state.selectedUser,
    favoriteUsers: (state:State) => state.favoriteUsers,
    tags: (state:State) => state.tags,
    userTags: (state:State) => state.userTags
  },
  plugins: [vuexLocal.plugin],
})

export const key: InjectionKey<Store<State>> = Symbol();

// defining `useStore` composition function
export function useStore() {
  return baseUseStore(key)
}