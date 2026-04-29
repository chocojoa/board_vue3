<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import api from '@/composables/useAxios'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

const props = defineProps({
  categoryId: { type: String, required: true },
  postId: { type: String, required: true },
  parentCommentId: { type: Number, default: 0 },
  retrieveCommentList: { type: Function, required: true },
  handleCommentClose: { type: Function, default: null },
})

const authStore = useAuthStore()

const schema = toTypedSchema(
  z.object({ content: z.string().min(1, '내용을 입력해 주세요.') }),
)

const { handleSubmit, defineField, errors, resetForm } = useForm({ validationSchema: schema })
const [content, contentAttrs] = defineField('content')

const onSubmit = handleSubmit(async (values) => {
  try {
    await api.post(
      `/api/boards/${props.categoryId}/posts/${props.postId}/comments`,
      {
        categoryId: props.categoryId,
        postId: props.postId,
        parentCommentId: props.parentCommentId,
        content: values.content,
        userId: authStore.user.userId,
      },
    )
    resetForm()
    props.retrieveCommentList()
    if (props.handleCommentClose) props.handleCommentClose()
    toast.success('댓글이 등록되었습니다.')
  } catch (error) {
    toast.error('댓글 등록 중 오류가 발생했습니다.', {
      description: error.response?.data?.message,
    })
  }
})
</script>

<template>
  <form @submit="onSubmit">
    <div class="flex items-start space-x-2 pt-4 pb-2">
      <div class="flex-1">
        <FormField name="content">
          <FormItem>
            <FormControl>
              <Textarea
                v-model="content"
                v-bind="contentAttrs"
                placeholder="댓글을 입력하세요"
                class="min-h-16"
              />
            </FormControl>
            <FormMessage>{{ errors.content }}</FormMessage>
          </FormItem>
        </FormField>
      </div>
      <Button type="submit" size="sm" class="mt-1">저장</Button>
    </div>
  </form>
</template>
