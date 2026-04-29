<script setup>
import { ref, computed, watch, onMounted, h } from 'vue'
import api from '@/composables/useAxios'
import { usePagination } from '@/composables/usePagination'
import { useSorting } from '@/composables/useSorting'
import DataTable from '@/components/DataTable.vue'
import RoleModal from './RoleModal.vue'
import { toast } from 'vue-sonner'

const totalCount = ref(0)
const dataList = ref([])

const { page, size, setTotal } = usePagination(10)
const { sortColumn, sortDirection } = useSorting('rowNumber', 'DESC')

async function fetchList() {
  try {
    const params = new URLSearchParams({
      startIndex: page.value * size.value,
      pageIndex: page.value,
      pageSize: size.value,
      sortColumn: sortColumn.value,
      sortDirection: sortDirection.value,
    })
    const { data } = await api.get(`/api/admin/roles?${params}`)
    totalCount.value = data.data.totalCount
    dataList.value = data.data.dataList
    setTotal(data.data.totalCount)
  } catch (error) {
    toast.error('권한 목록 조회 중 오류가 발생하였습니다.', {
      description: error.response?.data?.message,
    })
  }
}

function handleSort({ column, direction }) {
  sortColumn.value = column
  sortDirection.value = direction.toUpperCase()
  page.value = 0
}

const columns = computed(() => [
  { accessorKey: 'rowNumber', header: '번호', size: 80, enableSorting: true },
  { accessorKey: 'roleName', header: '권한명', size: 150, enableSorting: true },
  { accessorKey: 'description', header: '설명', enableSorting: true },
  { accessorKey: 'createdAt', header: '등록일', size: 120, enableSorting: true },
  {
    header: '수정',
    size: 80,
    enableSorting: false,
    cell: ({ row }) =>
      h(RoleModal, {
        roleId: row.original.roleId,
        retrieveRoleList: fetchList,
      }),
  },
])

watch([page, size, sortColumn, sortDirection], fetchList)
onMounted(fetchList)
</script>

<template>
  <div>
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
    <div class="flex w-full justify-end pt-4">
      <RoleModal :retrieve-role-list="fetchList" />
    </div>
  </div>
</template>
