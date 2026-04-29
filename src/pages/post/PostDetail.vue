<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import api from '@/composables/useAxios'
import { useAuthStore } from '@/store/useAuthStore'
import PageHeader from '@/components/PageHeader.vue'
import { Button } from '@/components/ui/button'
import CommentCreate from './CommentCreate.vue'
import CommentList from './CommentList.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const categoryId = computed(() => route.params.categoryId)
const postId = computed(() => route.params.postId)

const post = ref({})
const comments = ref([])

async function fetchPost() {
  try {
    const { data } = await api.get(
      `/api/boards/${categoryId.value}/posts/${postId.value}?userId=${authStore.user.userId}`,
    )
    post.value = data.data
  } catch (error) {
    toast.error('게시글 조회 중 오류가 발생했습니다.', {
      description: error.response?.data?.message,
    })
  }
}

async function fetchComments() {
  try {
    const { data } = await api.get(
      `/api/boards/${categoryId.value}/posts/${postId.value}/comments`,
    )
    comments.value = data.data
  } catch (error) {
    toast.error('댓글 조회 중 오류가 발생했습니다.', {
      description: error.response?.data?.message,
    })
  }
}

onMounted(async () => {
  await Promise.all([fetchPost(), fetchComments()])
})
</script>

<template>
  <div class="my-4">
    <PageHeader title="자유게시판" />
    <div>
      <div class="flex justify-between mx-1 pt-4 pb-2">
        <span class="font-semibold">{{ post.title }}</span>
        <div class="space-x-2 text-sm">
          <span>등록일: {{ post.createdDate }}</span>
          <span>작성자: {{ post.author }}</span>
          <span>조회수: {{ post.viewCount }}</span>
        </div>
      </div>
      <div class="w-full border rounded-sm px-2 py-2">
        <p class="whitespace-pre-wrap">{{ post.content }}</p>
      </div>
    </div>

    <div class="flex w-full justify-end mt-4 space-x-2">
      <Button @click="router.push(`/boards/${categoryId}/posts/${postId}/edit`)">수정</Button>
      <Button variant="outline" @click="router.push(`/boards/${categoryId}/posts`)">목록</Button>
    </div>

    <CommentCreate
      :category-id="categoryId"
      :post-id="postId"
      :retrieve-comment-list="fetchComments"
    />
    <CommentList
      :comments="comments"
      :category-id="categoryId"
      :post-id="postId"
      :retrieve-comment-list="fetchComments"
    />
  </div>
</template>
