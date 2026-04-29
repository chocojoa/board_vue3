<script setup>
import { useRouter } from 'vue-router'
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

const router = useRouter()
const authStore = useAuthStore()

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,15}$/

const schema = toTypedSchema(
  z
    .object({
      userName: z.string().min(1, '이름을 입력해 주세요.'),
      email: z.string().email('올바른 이메일을 입력해 주세요.'),
      password: z.string().regex(passwordRegex, '영문, 숫자, 특수문자를 포함한 8~15자로 입력해 주세요.'),
      verifyPassword: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
    })
    .refine((d) => d.password === d.verifyPassword, {
      message: '비밀번호가 일치하지 않습니다.',
      path: ['verifyPassword'],
    }),
)

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })
const [userName, userNameAttrs] = defineField('userName')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [verifyPassword, verifyPasswordAttrs] = defineField('verifyPassword')

const onSubmit = handleSubmit(async (values) => {
  try {
    const { data } = await api.post('/api/admin/users', {
      ...values,
      createdBy: authStore.user.userId,
    })
    toast.success('저장되었습니다.')
    router.push(`/admin/users/${data.data.userId}`)
  } catch (error) {
    toast.error('저장 도중 문제가 발생하였습니다.', {
      description: error.response?.data?.message,
    })
  }
})
</script>

<template>
  <div class="py-4">
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
      <FormField name="password">
        <FormItem>
          <FormLabel>비밀번호</FormLabel>
          <FormControl>
            <Input v-model="password" v-bind="passwordAttrs" type="password" placeholder="영문+숫자+특수문자 8~15자" />
          </FormControl>
          <FormMessage>{{ errors.password }}</FormMessage>
        </FormItem>
      </FormField>
      <FormField name="verifyPassword">
        <FormItem>
          <FormLabel>비밀번호 확인</FormLabel>
          <FormControl>
            <Input v-model="verifyPassword" v-bind="verifyPasswordAttrs" type="password" placeholder="비밀번호를 다시 입력하세요" />
          </FormControl>
          <FormMessage>{{ errors.verifyPassword }}</FormMessage>
        </FormItem>
      </FormField>
      <div class="flex w-full justify-end space-x-2">
        <Button type="submit">저장</Button>
        <Button type="button" variant="outline" @click="router.push('/admin/users')">목록</Button>
      </div>
    </form>
  </div>
</template>
