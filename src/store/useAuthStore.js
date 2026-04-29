import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    signIn({ user }) {
      this.isAuthenticated = true
      this.user = user
    },
    signOut() {
      this.isAuthenticated = false
      this.user = null
    },
  },
  persist: true,
})
