<script setup>
import { computed } from 'vue'
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
import { Textarea } from '@/components/ui/textarea'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const categoryId = computed(() => route.params.categoryId)

const schema = toTypedSchema(
  z.object({
    title: z.string().min(1, '제목을 입력해 주세요.'),
    content: z.string().min(1, '내용을 입력해 주세요.'),
  }),
)

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })
const [title, titleAttrs] = defineField('title')
const [content, contentAttrs] = defineField('content')

const onSubmit = handleSubmit(async (values) => {
  try {
    const { data } = await api.post(`/api/boards/${categoryId.value}/posts`, {
      ...values,
      userId: authStore.user.userId,
    })
    toast.success('저장되었습니다.')
    router.push(`/boards/${categoryId.value}/posts/${data.data.postId}`)
  } catch (error) {
    toast.error('저장 도중 문제가 발생하였습니다.', {
      description: error.response?.data?.message,
    })
  }
})
</script>

<template>
  <div class="my-4">
    <PageHeader title="자유게시판" />
    <form class="space-y-6" @submit="onSubmit">
      <FormField name="title">
        <FormItem>
          <FormLabel>제목</FormLabel>
          <FormControl>
            <Input v-model="title" v-bind="titleAttrs" placeholder="제목을 입력하세요" />
          </FormControl>
          <FormMessage>{{ errors.title }}</FormMessage>
        </FormItem>
      </FormField>

      <FormField name="content">
        <FormItem>
          <FormLabel>내용</FormLabel>
          <FormControl>
            <Textarea
              v-model="content"
              v-bind="contentAttrs"
              placeholder="내용을 입력하세요"
              class="min-h-48"
            />
          </FormControl>
          <FormMessage>{{ errors.content }}</FormMessage>
        </FormItem>
      </FormField>

      <div class="flex w-full justify-end space-x-2">
        <Button type="submit">저장</Button>
        <Button
          type="button"
          variant="outline"
          @click="router.push(`/boards/${categoryId}/posts`)"
        >
          취소
        </Button>
      </div>
    </form>
  </div>
</template>
