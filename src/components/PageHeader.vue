<script setup>
import { ref, watch } from 'vue'
import api from '@/composables/useAxios'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const props = defineProps({
  title: { type: String, required: true },
  breadcrumbs: { type: Array, default: null },
})

const breadcrumbs = ref(props.breadcrumbs || [])

async function fetchBreadcrumbs() {
  try {
    const { data } = await api.get(
      encodeURI(`/api/common/menus/breadcrumbs?menuName=${props.title}`),
    )
    breadcrumbs.value = data.data
  } catch {
    // 브레드크럼 조회 실패 시 무시
  }
}

watch(
  () => props.title,
  () => {
    if (!props.breadcrumbs && props.title) {
      fetchBreadcrumbs()
    }
  },
  { immediate: true },
)
</script>

<template>
  <nav class="flex items-center mb-2">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <RouterLink to="/">처음</RouterLink>
        </BreadcrumbItem>
        <template v-for="item in breadcrumbs" :key="item.menuId">
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <RouterLink :to="item.menuUrl">{{ item.menuName }}</RouterLink>
          </BreadcrumbItem>
        </template>
      </BreadcrumbList>
    </Breadcrumb>
  </nav>
  <header class="py-1">
    <h1 class="text-lg font-bold">{{ title }}</h1>
  </header>
</template>
