<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Smile, ChevronDown } from 'lucide-vue-next'
import { useAuthStore } from '@/store/useAuthStore'
import { useMenuStore } from '@/store/useMenuStore'
import api from '@/composables/useAxios'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

const router = useRouter()
const authStore = useAuthStore()
const menuStore = useMenuStore()

const user = computed(() => authStore.user)
const menuList = computed(() => menuStore.menuList)

const parentMenus = computed(() =>
  menuList.value.filter((m) => m.parentMenuId === 0),
)

function childMenus(menuId) {
  return menuList.value.filter(
    (m) => m.parentMenuId === menuId && m.childCount === 0 && m.isDisplayed,
  )
}

const openMenuId = ref(null)
let closeTimer = null

function handleMouseEnter(menuId) {
  clearTimeout(closeTimer)
  openMenuId.value = menuId
}

function handleMouseLeave() {
  closeTimer = setTimeout(() => {
    openMenuId.value = null
  }, 80)
}

async function handleSignOut() {
  try {
    await api.post('/api/auth/signOut')
    authStore.signOut()
    menuStore.clear()
    router.push('/auth/signIn')
  } catch (error) {
    toast.error('로그아웃 도중 문제가 발생하였습니다.', {
      description: error.response?.data?.message,
    })
  }
}
</script>

<template>
  <nav class="sticky top-0 z-50 w-full border-b bg-background">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-14 items-center">

        <!-- 로고 (좌측 고정) -->
        <div class="w-44 flex-shrink-0">
          <RouterLink
            to="/"
            class="font-bold text-base tracking-tight hover:text-foreground/80 transition-colors"
          >
            Vue3 연습화면
          </RouterLink>
        </div>

        <!-- 메뉴 (중앙) -->
        <div class="flex flex-1 justify-center">
          <div class="flex items-center gap-1">
            <template v-for="menu in parentMenus" :key="menu.menuId">

              <!-- 자식 있는 메뉴 → hover 드롭다운 -->
              <div
                v-if="menu.childCount > 0"
                class="relative"
                @mouseenter="handleMouseEnter(menu.menuId)"
                @mouseleave="handleMouseLeave"
              >
                <button
                  class="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  :class="openMenuId === menu.menuId ? 'bg-accent text-accent-foreground' : 'text-foreground/80'"
                >
                  {{ menu.menuName }}
                  <ChevronDown
                    :size="13"
                    class="transition-transform duration-200"
                    :class="openMenuId === menu.menuId ? 'rotate-180' : ''"
                  />
                </button>

                <div
                  v-show="openMenuId === menu.menuId"
                  class="absolute left-0 top-full z-50 mt-1 min-w-40 rounded-md border bg-background py-1 shadow-md"
                >
                  <RouterLink
                    v-for="child in childMenus(menu.menuId)"
                    :key="child.menuId"
                    :to="child.menuUrl"
                    class="block px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                    @click="openMenuId = null"
                  >
                    {{ child.menuName }}
                  </RouterLink>
                </div>
              </div>

              <!-- 자식 없는 최상위 메뉴 → 직접 링크 -->
              <RouterLink
                v-else-if="menu.isDisplayed"
                :to="menu.menuUrl"
                class="rounded-md px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {{ menu.menuName }}
              </RouterLink>

            </template>
          </div>
        </div>

        <!-- 프로필 드롭다운 (우측 고정) -->
        <div class="w-44 flex-shrink-0 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent cursor-pointer">
              <Smile :size="16" class="text-muted-foreground" />
              <span v-if="user" class="max-w-32 truncate font-medium">
                {{ user.userName }}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-52">
              <div v-if="user" class="px-2 py-1.5">
                <p class="text-sm font-medium">{{ user.userName }}</p>
                <p class="text-xs text-muted-foreground truncate">{{ user.email }}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="router.push('/user/profile')">
                프로필
              </DropdownMenuItem>
              <DropdownMenuItem
                class="text-destructive focus:text-destructive"
                @click="handleSignOut"
              >
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </div>
  </nav>
</template>
