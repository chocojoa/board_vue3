<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import api from '@/composables/useAxios'
import { useAuthStore } from '@/store/useAuthStore'
import PageHeader from '@/components/PageHeader.vue'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const userId = route.params.userId

const schema = toTypedSchema(
  z.object({
    userName: z.string().min(1, '이름을 입력해 주세요.'),
    email: z.string().email('올바른 이메일을 입력해 주세요.'),
  }),
)

const { handleSubmit, defineField, errors, setValues } = useForm({ validationSchema: schema })
const [userName, userNameAttrs] = defineField('userName')
const [email, emailAttrs] = defineField('email')

onMounted(async () => {
  try {
    const { data } = await api.get(`/api/admin/users/${userId}`)
    setValues({ userName: data.data.userName, email: data.data.email })
  } catch (error) {
    toast.error('사용자 정보 조회 중 문제가 발생하였습니다.', {
      description: error.response?.data?.message,
    })
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await api.put(`/api/admin/users/${userId}`, {
      ...values,
      modifiedBy: authStore.user.userId,
    })
    toast.success('수정되었습니다.')
    router.push(`/admin/users/${userId}`)
  } catch (error) {
    toast.error('저장 도중 문제가 발생하였습니다.', {
      description: error.response?.data?.message,
    })
  }
})
</script>

<template>
  <div class="my-4">
    <PageHeader title="사용자관리" />
    <form class="mt-2 space-y-6" @submit="onSubmit">
      <FormField name="userName">
        <FormItem>
          <FormLabel>이름</FormLabel>
          <FormControl>
            <Input v-model="userName" v-bind="userNameAttrs" placeholder="이름을 입력하세요" />
          </FormControl>
          <FormMessage>{{ errors.userName }}</FormMessage>
        </FormItem>
      </FormField>
      <FormField name="email">
        <FormItem>
          <FormLabel>이메일</FormLabel>
          <FormControl>
            <Input v-model="email" v-bind="emailAttrs" type="email" placeholder="이메일을 입력하세요" />
          </FormControl>
          <FormMessage>{{ errors.email }}</FormMessage>
        </FormItem>
      </FormField>
      <div class="flex w-full justify-end space-x-2">
        <Button type="submit">저장</Button>
        <Button type="button" variant="outline" @click="router.push('/admin/users')">목록</Button>
      </div>
    </form>
  </div>
</template>
