<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import api from '@/composables/useAxios'
import PageHeader from '@/components/PageHeader.vue'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()
const userId = route.params.userId

const user = ref({})

onMounted(async () => {
  try {
    const { data } = await api.get(`/api/admin/users/${userId}`)
    user.value = data.data
  } catch (error) {
    toast.error('사용자 정보 조회 중 문제가 발생하였습니다.', {
      description: error.response?.data?.message,
    })
  }
})
</script>

<template>
  <div class="py-4">
    <PageHeader title="사용자관리" />
    <div class="border rounded-md mt-2">
      <div class="p-6 space-y-4">
        <div class="flex items-center w-full">
          <span class="font-medium w-24">이름</span>
          <span>{{ user.userName }}</span>
        </div>
        <div class="flex items-center w-full">
          <span class="font-medium w-24">이메일</span>
          <span>{{ user.email }}</span>
        </div>
        <div class="flex justify-end space-x-2">
          <Button @click="router.push(`/admin/users/${userId}/edit`)">수정</Button>
          <Button variant="outline" @click="router.push('/admin/users')">목록</Button>
        </div>
      </div>
    </div>
  </div>
</template>
