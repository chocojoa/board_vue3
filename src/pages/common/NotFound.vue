<script setup>
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const router = useRouter()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center">
    <h1 class="text-4xl font-bold">404</h1>
    <p class="mt-2 text-muted-foreground">페이지를 찾을 수 없습니다.</p>
    <Button class="mt-6" @click="router.push('/')">처음으로</Button>
  </div>
</template>
