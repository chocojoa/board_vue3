<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Nav from './Nav.vue'
import NotFound from '@/pages/common/NotFound.vue'
import { useMenuStore } from '@/store/useMenuStore'
import { allowUrl } from '@/router/allowUrl'

const route = useRoute()
const menuStore = useMenuStore()

const menuUrlList = computed(() =>
  menuStore.menuList.filter((m) => m.menuUrl !== '').map((m) => m.menuUrl),
)

const hasAccess = computed(() => {
  const path = route.path
  if (allowUrl.includes(path)) return true
  return menuUrlList.value.some((url) => path.includes(url))
})
</script>

<template>
  <div v-if="hasAccess" class="bg-slate-50 min-h-screen">
    <Nav />
    <main>
      <div class="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
        <div class="bg-white border rounded-sm px-6 py-4">
          <RouterView />
        </div>
      </div>
    </main>
  </div>
  <NotFound v-else />
</template>
