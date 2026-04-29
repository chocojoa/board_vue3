<script setup>
import { ref, reactive, computed, watch, onMounted, h } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import api from '@/composables/useAxios'
import { usePagination } from '@/composables/usePagination'
import { useSorting } from '@/composables/useSorting'
import DataTable from '@/components/DataTable.vue'
import PageHeader from '@/components/PageHeader.vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const route = useRoute()
const router = useRouter()
const categoryId = computed(() => route.params.categoryId)

const searchCondition = reactive({
  title: '',
  author: '',
  startCreatedDate: '',
  endCreatedDate: '',
})

const totalCount = ref(0)
const dataList = ref([])

const { page, size, setTotal } = usePagination(10)
const { sortColumn, sortDirection, toggleSort } = useSorting('rowNumber', 'DESC')

const columns = computed(() => [
  { accessorKey: 'rowNumber', header: '번호', size: 80, enableSorting: true },
  {
    accessorKey: 'title',
    header: '제목',
    size: 400,
    enableSorting: true,
    cell: ({ row }) =>
      h(
        RouterLink,
        { to: `/boards/${row.original.categoryId}/posts/${row.original.postId}` },
        () => row.getValue('title'),
      ),
  },
  { accessorKey: 'viewCount', header: '조회수', size: 80, enableSorting: true },
  { accessorKey: 'author', header: '작성자', size: 100, enableSorting: true },
  { accessorKey: 'createdDate', header: '작성일', size: 100, enableSorting: true },
])

async function fetchList() {
  try {
    const params = new URLSearchParams({
      startIndex: page.value * size.value,
      pageIndex: page.value,
      pageSize: size.value,
      sortColumn: sortColumn.value,
      sortDirection: sortDirection.value,
      title: searchCondition.title,
      author: searchCondition.author,
      startCreatedDate: searchCondition.startCreatedDate,
      endCreatedDate: searchCondition.endCreatedDate,
    })
    const { data } = await api.get(`/api/boards/${categoryId.value}/posts?${params}`)
    totalCount.value = data.data.totalCount
    dataList.value = data.data.dataList
    setTotal(data.data.totalCount)
  } catch (error) {
    toast.error('게시글 목록 조회 중 오류가 발생하였습니다.', {
      description: error.response?.data?.message,
    })
  }
}

function handleSort({ column, direction }) {
  sortColumn.value = column
  sortDirection.value = direction.toUpperCase()
  page.value = 0
}

watch([page, size, sortColumn, sortDirection], fetchList)
onMounted(fetchList)
</script>

<template>
  <div class="my-4">
    <PageHeader title="자유게시판" />

    <!-- 검색 영역 -->
    <div class="flex w-full justify-center items-center gap-2 mb-4">
      <div class="flex w-full items-center">
        <Label for="title" class="w-20 text-center">제목</Label>
        <Input
          id="title"
          v-model="searchCondition.title"
          @keydown.enter="fetchList"
        />
      </div>
      <div class="flex w-full items-center">
        <Label for="author" class="w-20 text-center">작성자</Label>
        <Input
          id="author"
          v-model="searchCondition.author"
          @keydown.enter="fetchList"
        />
      </div>
      <Button class="ml-2" @click="fetchList">검색</Button>
    </div>

    <!-- 데이터 테이블 -->
    <div class="py-4">
      <DataTable
        :columns="columns"
        :data="dataList"
        :total-count="totalCount"
        :page-index="page"
        :page-size="size"
        :sort-column="sortColumn"
        :sort-direction="sortDirection.toLowerCase()"
        @update:page-index="page = $event"
        @update:page-size="size = $event"
        @sort="handleSort"
      />
    </div>

    <!-- 등록 버튼 -->
    <div class="flex w-full justify-end">
      <Button
        variant="outline"
        @click="router.push(`/boards/${categoryId}/posts/create`)"
      >
        등록
      </Button>
    </div>
  </div>
</template>
