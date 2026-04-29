<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { toast } from 'vue-sonner'
import api from '@/composables/useAxios'
import { useAuthStore } from '@/store/useAuthStore'
import { usePagination } from '@/composables/usePagination'
import { useSorting } from '@/composables/useSorting'
import DataTable from '@/components/DataTable.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const authStore = useAuthStore()
const roles = ref([])
const roleId = ref(0)
const allUsers = ref([])
const roleUsers = ref([])
const roleUserIds = ref(new Set())
const selectedFromAll = ref([])
const selectedFromRole = ref([])
const totalCount = ref(0)

const { page, size, setTotal } = usePagination(10)
const { sortColumn, sortDirection } = useSorting('userName', 'ASC')

const userColumns = computed(() => [
  {
    id: 'select',
    header: () =>
      h(Checkbox, {
        modelValue: selectedFromAll.value.length === allUsers.value.length && allUsers.value.length > 0,
        'onUpdate:modelValue': (v) => {
          selectedFromAll.value = v ? allUsers.value.map((u) => u.userId) : []
        },
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: selectedFromAll.value.includes(row.original.userId),
        'onUpdate:modelValue': (v) => {
          if (v) {
            selectedFromAll.value = [...selectedFromAll.value, row.original.userId]
          } else {
            selectedFromAll.value = selectedFromAll.value.filter((id) => id !== row.original.userId)
          }
        },
      }),
    size: 40,
    enableSorting: false,
  },
  { accessorKey: 'userName', header: '이름', size: 100, enableSorting: true },
  { accessorKey: 'email', header: '이메일', enableSorting: true },
])

const roleUserColumns = computed(() => [
  {
    id: 'select',
    header: () =>
      h(Checkbox, {
        modelValue: selectedFromRole.value.length === roleUsers.value.length && roleUsers.value.length > 0,
        'onUpdate:modelValue': (v) => {
          selectedFromRole.value = v ? roleUsers.value.map((u) => u.userId) : []
        },
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: selectedFromRole.value.includes(row.original.userId),
        'onUpdate:modelValue': (v) => {
          if (v) {
            selectedFromRole.value = [...selectedFromRole.value, row.original.userId]
          } else {
            selectedFromRole.value = selectedFromRole.value.filter((id) => id !== row.original.userId)
          }
        },
      }),
    size: 40,
    enableSorting: false,
  },
  { accessorKey: 'userName', header: '이름', size: 100, enableSorting: false },
  { accessorKey: 'email', header: '이메일', enableSorting: false },
])

async function fetchRoles() {
  const { data } = await api.get('/api/admin/roles?sortColumn=roleName')
  roles.value = data.data.dataList
}

async function fetchUsers() {
  const params = new URLSearchParams({
    startIndex: page.value * size.value,
    pageIndex: page.value,
    pageSize: size.value,
    sortColumn: sortColumn.value,
    sortDirection: sortDirection.value,
  })
  const { data } = await api.get(`/api/admin/users?${params}`)
  allUsers.value = data.data.dataList.filter((u) => !roleUserIds.value.has(u.userId))
  setTotal(data.data.totalCount)
  totalCount.value = data.data.totalCount
}

async function fetchUserRole(rid) {
  const { data } = await api.get(`/api/admin/userRole/${rid}`)
  roleUsers.value = data.data
  roleUserIds.value = new Set(data.data.map((u) => u.userId))
  fetchUsers()
}

function handleRoleChange(val) {
  roleId.value = Number(val)
  roleUsers.value = []
  roleUserIds.value = new Set()
  selectedFromAll.value = []
  selectedFromRole.value = []
  fetchUserRole(val)
}

function handleAddUser() {
  const toAdd = allUsers.value.filter(
    (u) => selectedFromAll.value.includes(u.userId) && !roleUserIds.value.has(u.userId),
  )
  roleUsers.value = [...roleUsers.value, ...toAdd]
  toAdd.forEach((u) => roleUserIds.value.add(u.userId))
  allUsers.value = allUsers.value.filter((u) => !roleUserIds.value.has(u.userId))
  selectedFromAll.value = []
}

function handleRemoveUser() {
  const toRemove = roleUsers.value.filter((u) => selectedFromRole.value.includes(u.userId))
  toRemove.forEach((u) => roleUserIds.value.delete(u.userId))
  roleUsers.value = roleUsers.value.filter((u) => !selectedFromRole.value.includes(u.userId))
  selectedFromRole.value = []
  fetchUsers()
}

async function handleSave() {
  try {
    await api.post(`/api/admin/userRole/${roleId.value}`, {
      roleId: roleId.value,
      addUserList: roleUsers.value.map((u) => u.userId),
      createdBy: authStore.user.userId,
    })
    toast.success('저장되었습니다.')
    selectedFromAll.value = []
    selectedFromRole.value = []
    await fetchUserRole(roleId.value)
  } catch (error) {
    toast.error('저장 중 오류가 발생하였습니다.', { description: error.response?.data?.message })
  }
}

onMounted(() => {
  fetchRoles()
  fetchUsers()
})
</script>

<template>
  <div>
    <div class="flex mb-5">
      <Select @update:model-value="handleRoleChange">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="권한을 선택해 주세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="role in roles"
              :key="role.roleId"
              :value="String(role.roleId)"
            >
              {{ role.roleName }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <div class="flex gap-4">
      <!-- 전체 사용자 -->
      <div class="w-5/12">
        <DataTable
          :columns="userColumns"
          :data="allUsers"
          :total-count="totalCount"
          :page-index="page"
          :page-size="size"
          :sort-column="sortColumn"
          :sort-direction="sortDirection.toLowerCase()"
          @update:page-index="page = $event; fetchUsers()"
          @update:page-size="size = $event; fetchUsers()"
        />
      </div>

      <!-- 버튼 -->
      <div class="w-2/12 space-y-4 flex flex-col items-center justify-center">
        <Button variant="outline" :disabled="roleId === 0 || selectedFromAll.length === 0" @click="handleAddUser">
          추가 &gt;&gt;
        </Button>
        <Button variant="outline" :disabled="roleId === 0 || selectedFromRole.length === 0" @click="handleRemoveUser">
          &lt;&lt; 삭제
        </Button>
      </div>

      <!-- 권한 사용자 -->
      <div class="w-5/12">
        <DataTable
          :columns="roleUserColumns"
          :data="roleUsers"
          :total-count="roleUsers.length"
          :page-index="0"
          :page-size="roleUsers.length || 10"
        />
        <div class="flex w-full justify-end pt-4">
          <Button v-if="roleId > 0" @click="handleSave">저장</Button>
        </div>
      </div>
    </div>
  </div>
</template>
