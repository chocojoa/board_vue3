<script setup>
import { ref } from 'vue'
import { CornerDownRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import CommentCreate from './CommentCreate.vue'

const props = defineProps({
  comment: { type: Object, required: true },
  categoryId: { type: String, required: true },
  postId: { type: String, required: true },
  retrieveCommentList: { type: Function, required: true },
})

const isReplyOpen = ref(false)
const marginStyle = props.comment.step > 0
  ? { marginLeft: `${props.comment.step * 2}em` }
  : {}

function toggleReply() {
  isReplyOpen.value = !isReplyOpen.value
}
</script>

<template>
  <div>
    <div :style="marginStyle">
      <div class="flex items-center justify-between border-b py-1">
        <div class="flex items-center space-x-2">
          <CornerDownRight v-if="comment.step > 0" :size="16" />
          <span class="font-medium text-sm">{{ comment.author }}</span>
          <span class="whitespace-pre-wrap text-sm">{{ comment.content }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <Button variant="ghost" size="sm" @click="toggleReply">
            {{ isReplyOpen ? '취소' : '댓글' }}
          </Button>
          <span class="text-xs text-muted-foreground">{{ comment.createdDate }}</span>
        </div>
      </div>
    </div>
    <CommentCreate
      v-if="isReplyOpen"
      :category-id="categoryId"
      :post-id="postId"
      :parent-comment-id="comment.commentId"
      :retrieve-comment-list="retrieveCommentList"
      :handle-comment-close="() => (isReplyOpen = false)"
    />
  </div>
</template>
