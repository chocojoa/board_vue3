<script setup>
import CommentItem from './CommentItem.vue'

defineProps({
  comments: { type: Array, required: true },
  categoryId: { type: String, required: true },
  postId: { type: String, required: true },
  retrieveCommentList: { type: Function, required: true },
})
</script>

<template>
  <div>
    <CommentItem
      v-for="comment in comments"
      :key="comment.commentId"
      :comment="comment"
      :category-id="categoryId"
      :post-id="postId"
      :retrieve-comment-list="retrieveCommentList"
    />
  </div>
</template>
