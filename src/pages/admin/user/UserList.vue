<script setup>
import { ref, reactive, computed, watch, onMounted, h } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import api from '@/composables/useAxios'
import { usePagination } from '@/composables/usePagination'
import { useSorting } from '@/composables/useSorting'
import DataTable from '@/components/DataTable.vue'
import PageHeader from '@/components/PageHeader.vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()

const searchCondition = reactive({ userName: '', email: '' })
const totalCount = ref(0)
const dataList = ref([])

const { page, size, setTotal } = usePagination(10)
const { sortColumn, sortDirection } = useSorting('rowNumber', 'DESC')

const columns = computed(() => [
  { accessorKey: 'rowNumber', header: '번호', size: 80, enableSorting: true },
  {
    accessorKey: 'userName',
    header: '이름',
    size: 120,
    enableSorting: true,
    cell: ({ row }) =>
      h(RouterLink, { to: `/admin/users/${row.original.userId}` }, () =>
        row.getValue('userName'),
      ),
  },
  { accessorKey: 'email', header: '이메일', enableSorting: true },
  { accessorKey: 'createdAt', header: '등록일', size: 120, enableSorting: true },
])

async function fetchList() {
  try {
    const params = new URLSearchParams({
      startIndex: page.value * size.value,
      pageIndex: page.value,
      pageSize: size.value,
      sortColumn: sortColumn.value,
      sortDirection: sortDirection.value,
      userName: searchCondition.userName,
      email: searchCondition.email,
    })
    const { data } = await api.get(`/api/admin/users?${params}`)
    totalCount.value = data.data.totalCount
    dataList.value = data.data.dataList
    setTotal(data.data.totalCount)
  } catch (error) {
    toast.error('사용자 목록 조회 중 오류가 발생하였습니다.', {
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
    <PageHeader title="사용자관리" />

    <div class="flex w-full items-center gap-2 mb-4">
      <div class="flex w-full items-center">
        <Label for="userName" class="w-20 text-center">이름</Label>
        <Input id="userName" v-model="searchCondition.userName" @keydown.enter="fetchList" />
      </div>
      <div class="flex w-full items-center">
        <Label for="email" class="w-20 text-center">이메일</Label>
        <Input id="email" v-model="searchCondition.email" @keydown.enter="fetchList" />
      </div>
      <Button class="ml-2" @click="fetchList">검색</Button>
    </div>

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

    <div class="flex w-full justify-end">
      <Button @click="router.push('/admin/users/create')">등록</Button>
    </div>
  </div>
</template>
