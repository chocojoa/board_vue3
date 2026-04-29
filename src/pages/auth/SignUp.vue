<script setup>
import { useRouter } from 'vue-router'
import { Baby } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import api from '@/composables/useAxios'
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

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,15}$/

const schema = toTypedSchema(
  z
    .object({
      userName: z.string().min(1, '이름을 입력해 주세요.'),
      email: z.string().email('올바른 이메일을 입력해 주세요.'),
      password: z
        .string()
        .regex(passwordRegex, '영문, 숫자, 특수문자를 포함한 8~15자로 입력해 주세요.'),
      verifyPassword: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
    })
    .refine((data) => data.password === data.verifyPassword, {
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
    await api.post('/api/auth/signUp', values)
    toast.success('계정이 생성되었습니다.')
    router.push('/auth/signIn')
  } catch (error) {
    toast.error('계정 생성 도중 문제가 발생하였습니다.', {
      description: error.response?.data?.message,
    })
  }
})
</script>

<template>
  <div class="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="flex justify-center">
        <Baby :size="40" />
      </div>
      <h2 class="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        회원가입
      </h2>
    </div>
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit="onSubmit">
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

        <Button type="submit" class="flex w-full justify-center rounded-sm font-semibold">
          가입하기
        </Button>
      </form>

      <p class="mt-10 text-center text-sm">
        이미 계정이 있으신가요?
        <RouterLink to="/auth/signIn" class="font-semibold">로그인</RouterLink>
      </p>
    </div>
  </div>
</template>
