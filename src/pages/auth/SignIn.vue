<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Baby } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import api from '@/composables/useAxios'
import { useAuthStore } from '@/store/useAuthStore'
import { useMenuStore } from '@/store/useMenuStore'
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
const menuStore = useMenuStore()

const schema = toTypedSchema(
  z.object({
    email: z.string().email('올바른 이메일을 입력해 주세요.'),
    password: z.string().min(1, '비밀번호를 입력해 주세요.'),
  }),
)

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    const { data } = await api.post('/api/auth/signIn', values)
    const { user } = data.data

    const menuRes = await api.get(`/api/common/menus/${user.userId}`)
    menuStore.setMenuList(menuRes.data.data)
    authStore.signIn(data.data)
    router.push('/')
  } catch (error) {
    toast.error('문제가 발생하였습니다.', {
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
        로그인
      </h2>
    </div>
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit="onSubmit">
        <FormField name="email">
          <FormItem>
            <FormLabel>이메일</FormLabel>
            <FormControl>
              <Input
                v-model="email"
                v-bind="emailAttrs"
                type="email"
                placeholder="이메일을 입력하세요"
              />
            </FormControl>
            <FormMessage>{{ errors.email }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="password">
          <FormItem>
            <FormLabel>비밀번호</FormLabel>
            <FormControl>
              <Input
                v-model="password"
                v-bind="passwordAttrs"
                type="password"
                placeholder="비밀번호를 입력하세요"
              />
            </FormControl>
            <FormMessage>{{ errors.password }}</FormMessage>
          </FormItem>
        </FormField>

        <Button type="submit" class="flex w-full justify-center rounded-sm font-semibold">
          로그인
        </Button>
      </form>

      <p class="mt-10 text-center text-sm">
        계정이 없으신가요?
        <RouterLink to="/auth/signUp" class="font-semibold">회원가입</RouterLink>
      </p>
    </div>
  </div>
</template>
