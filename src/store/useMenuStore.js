import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuList: [],
  }),
  actions: {
    setMenuList(menuList) {
      this.menuList = menuList
    },
    clear() {
      this.menuList = []
    },
  },
  persist: true,
})
