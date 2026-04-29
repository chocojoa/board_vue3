<script setup>
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

const authStore = useAuthStore()
const user = authStore.user

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,15}$/

const schema = toTypedSchema(
  z
    .object({
      userName: z.string().min(1, '이름을 입력해 주세요.'),
      email: z.string().email('올바른 이메일을 입력해 주세요.'),
      password: z.string().optional(),
      verifyPassword: z.string().optional(),
    })
    .refine(
      (d) => !d.password || d.password === d.verifyPassword,
      { message: '비밀번호가 일치하지 않습니다.', path: ['verifyPassword'] },
    ),
)

const { handleSubmit, defineField, errors, setValues } = useForm({
  validationSchema: schema,
  initialValues: { userName: user?.userName ?? '', email: user?.email ?? '' },
})

const [userName, userNameAttrs] = defineField('userName')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [verifyPassword, verifyPasswordAttrs] = defineField('verifyPassword')

const onSubmit = handleSubmit(async (values) => {
  try {
    await api.put(`/api/common/profile/${user.userId}`, {
      ...values,
      modifiedBy: user.userId,
    })
    toast.success('수정되었습니다.')
  } catch (error) {
    toast.error('저장 도중 문제가 발생하였습니다.', {
      description: error.response?.data?.message,
    })
  }
})
</script>

<template>
  <div class="py-4">
    <PageHeader
      title="Profile"
      :breadcrumbs="[{ menuId: 'profile', menuName: 'Profile', menuUrl: '/user/profile' }]"
    />
    <form class="mt-2 space-y-6" @submit="onSubmit">
      <FormField name="userName">
        <FormItem>
          <FormLabel>이름</FormLabel>
          <FormControl>
            <Input v-model="userName" v-bind="userNameAttrs" />
          </FormControl>
          <FormMessage>{{ errors.userName }}</FormMessage>
        </FormItem>
      </FormField>
      <FormField name="email">
        <FormItem>
          <FormLabel>이메일</FormLabel>
          <FormControl>
            <Input v-model="email" v-bind="emailAttrs" type="email" />
          </FormControl>
          <FormMessage>{{ errors.email }}</FormMessage>
        </FormItem>
      </FormField>
      <FormField name="password">
        <FormItem>
          <FormLabel>비밀번호 (변경 시만 입력)</FormLabel>
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
            <Input v-model="verifyPassword" v-bind="verifyPasswordAttrs" type="password" />
          </FormControl>
          <FormMessage>{{ errors.verifyPassword }}</FormMessage>
        </FormItem>
      </FormField>
      <div class="flex w-full justify-end">
        <Button type="submit">저장</Button>
      </div>
    </form>
  </div>
</template>
