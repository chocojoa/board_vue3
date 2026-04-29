<script setup>
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <div class="py-4">
    <PageHeader
      title="대시보드"
      :breadcrumbs="[{ menuId: 'dashboard', menuName: '대시보드', menuUrl: '/dashboard' }]"
    />
    <div class="mt-4 grid grid-cols-2 gap-4">
      <div class="border rounded-md p-6">
        <h2 class="text-lg font-semibold mb-2">Vue3 게시판</h2>
        <p class="text-muted-foreground text-sm">Spring Boot + Vue3 + shadcn-vue 연동 프로젝트입니다.</p>
      </div>
      <div class="border rounded-md p-6">
        <h2 class="text-lg font-semibold mb-2">기술 스택</h2>
        <ul class="text-sm text-muted-foreground space-y-1">
          <li>Vue 3 + Vite</li>
          <li>shadcn-vue (reka-ui)</li>
          <li>Pinia (상태 관리)</li>
          <li>Vue Router 4</li>
          <li>vee-validate + Zod</li>
          <li>@tanstack/vue-table</li>
          <li>Axios (HttpOnly 쿠키)</li>
        </ul>
      </div>
    </div>
  </div>
</template>
