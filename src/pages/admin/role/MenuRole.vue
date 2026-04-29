<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import api from '@/composables/useAxios'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import MenuCheckTree from './MenuCheckTree.vue'

const authStore = useAuthStore()
const roleId = ref(0)
const roles = ref([])
const treeData = ref([])
const checkedMenuIds = ref([])

function buildTree(parentId, menus) {
  return menus
    .filter((m) => m.parentMenuId === parentId)
    .map((m) => ({ ...m, children: buildTree(m.menuId, menus) }))
}

function getAllDescendantIds(node) {
  const ids = [node.menuId]
  if (node.children?.length) {
    for (const child of node.children) {
      ids.push(...getAllDescendantIds(child))
    }
  }
  return ids
}

function collectHalfCheckedIds(nodes) {
  const result = []
  for (const node of nodes) {
    if (node.children?.length) {
      const allIds = getAllDescendantIds(node)
      const checkedCount = allIds.filter((id) => checkedMenuIds.value.includes(id)).length
      if (checkedCount > 0 && checkedCount < allIds.length) {
        result.push(node.menuId)
      }
      result.push(...collectHalfCheckedIds(node.children))
    }
  }
  return result
}

async function fetchRoles() {
  const { data } = await api.get('/api/admin/roles?sortColumn=roleName')
  roles.value = data.data.dataList
}

async function fetchMenuRoles(selectedRoleId) {
  const { data } = await api.get(`/api/admin/menuRole/${selectedRoleId}`)
  const menuList = data.data

  const checked = []
  const halfChecked = []
  menuList.forEach((m) => {
    if (m.checked) checked.push(m.menuId)
    if (m.halfChecked) halfChecked.push(m.menuId)
  })
  checkedMenuIds.value = checked

  treeData.value = buildTree(0, menuList)
}

function handleRoleChange(val) {
  roleId.value = Number(val)
  fetchMenuRoles(val)
}

async function handleSave() {
  try {
    const halfCheckedIds = collectHalfCheckedIds(treeData.value)
    await api.post(`/api/admin/menuRole/${roleId.value}`, {
      roleId: roleId.value,
      addMenuList: [...checkedMenuIds.value, ...halfCheckedIds],
      createdBy: authStore.user.userId,
    })
    toast.success('저장되었습니다.')
  } catch (error) {
    toast.error('문제가 발생하였습니다.', { description: error.response?.data?.message })
  }
}

onMounted(fetchRoles)
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

    <Card>
      <CardContent class="mt-6">
        <div v-if="treeData.length === 0" class="text-center text-muted-foreground py-4">
          권한을 선택해 주세요
        </div>
        <MenuCheckTree
          v-else
          :nodes="treeData"
          v-model:checked="checkedMenuIds"
        />
      </CardContent>
    </Card>

    <div class="flex w-full justify-end pt-4">
      <Button v-if="roleId > 0" @click="handleSave">저장</Button>
    </div>
  </div>
</template>
