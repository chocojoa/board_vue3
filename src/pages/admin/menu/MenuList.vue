<script setup>
import { ref, computed, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import api from '@/composables/useAxios'
import { useAuthStore } from '@/store/useAuthStore'
import PageHeader from '@/components/PageHeader.vue'
import MenuTreeNode from './MenuTreeNode.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const authStore = useAuthStore()
const menuList = ref([])
const selectedMenuId = ref(-1)
const dialogOpen = ref(false)

// 트리 구조로 변환
function buildTree(parentId, menus) {
  return menus
    .filter((m) => m.parentMenuId === parentId)
    .map((m) => ({ ...m, children: buildTree(m.menuId, menus) }))
}

const treeData = computed(() => buildTree(0, menuList.value))

const schema = toTypedSchema(
  z.object({
    menuId: z.number().optional(),
    parentMenuId: z.number().default(0),
    menuName: z.string().min(1, '메뉴명을 입력해 주세요.'),
    menuUrl: z.string().default(''),
    sortOrder: z.union([z.string(), z.number()]).default(''),
    icon: z.string().default(''),
    usageStatus: z.boolean().default(true),
    isDisplayed: z.boolean().default(true),
  }),
)

const createForm = useForm({ validationSchema: schema })
const modifyForm = useForm({ validationSchema: schema })

const [cMenuName, cMenuNameAttrs] = createForm.defineField('menuName')
const [cMenuUrl, cMenuUrlAttrs] = createForm.defineField('menuUrl')
const [cSortOrder, cSortOrderAttrs] = createForm.defineField('sortOrder')
const [cIcon, cIconAttrs] = createForm.defineField('icon')

const [mMenuName, mMenuNameAttrs] = modifyForm.defineField('menuName')
const [mMenuUrl, mMenuUrlAttrs] = modifyForm.defineField('menuUrl')
const [mSortOrder, mSortOrderAttrs] = modifyForm.defineField('sortOrder')
const [mIcon, mIconAttrs] = modifyForm.defineField('icon')

async function fetchMenus() {
  try {
    const { data } = await api.get('/api/admin/menus')
    menuList.value = data.data
  } catch (error) {
    toast.error('문제가 발생하였습니다.', { description: error.response?.data?.message })
  }
}

async function fetchMenuById(menuId) {
  try {
    const { data } = await api.get(`/api/admin/menus/${menuId}`)
    modifyForm.setValues(data.data)
  } catch (error) {
    toast.error('메뉴 조회 중 오류가 발생하였습니다.', { description: error.response?.data?.message })
  }
}

function handleSelect(menu) {
  if (selectedMenuId.value === menu.menuId) {
    selectedMenuId.value = -1
    modifyForm.resetForm()
    return
  }
  selectedMenuId.value = menu.menuId
  if (menu.menuId > 0) fetchMenuById(menu.menuId)
}

function initCreate() {
  createForm.setValues({
    menuId: 0,
    parentMenuId: selectedMenuId.value,
    menuName: '',
    menuUrl: '',
    sortOrder: '',
    icon: '',
    usageStatus: true,
    isDisplayed: true,
  })
}

const onCreate = createForm.handleSubmit(async (values) => {
  try {
    await api.post('/api/admin/menus', { ...values, userId: authStore.user.userId })
    toast.success('저장되었습니다.')
    dialogOpen.value = false
    selectedMenuId.value = -1
    await fetchMenus()
  } catch (error) {
    toast.error('문제가 발생하였습니다.', { description: error.response?.data?.message })
  }
})

const onModify = modifyForm.handleSubmit(async (values) => {
  try {
    await api.put(`/api/admin/menus/${values.menuId}`, { ...values, userId: authStore.user.userId })
    toast.success('수정되었습니다.')
    selectedMenuId.value = -1
    await fetchMenus()
    modifyForm.resetForm()
  } catch (error) {
    toast.error('문제가 발생하였습니다.', { description: error.response?.data?.message })
  }
})

async function onDelete() {
  try {
    await api.delete(`/api/admin/menus/${selectedMenuId.value}`)
    toast.success('삭제되었습니다.')
    selectedMenuId.value = -1
    modifyForm.resetForm()
    await fetchMenus()
  } catch (error) {
    toast.error('문제가 발생하였습니다.', { description: error.response?.data?.message })
  }
}

onMounted(fetchMenus)
</script>

<template>
  <div class="my-4">
    <PageHeader title="메뉴관리" />
    <div class="flex space-x-6 mt-4">
      <!-- 메뉴 트리 -->
      <Card class="w-1/4">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>메뉴 목록</CardTitle>
            <Dialog v-if="selectedMenuId > -1" v-model:open="dialogOpen">
              <DialogTrigger as-child>
                <Button variant="outline" @click="initCreate">추가</Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[500px]">
                <form @submit="onCreate" class="space-y-4">
                  <DialogHeader>
                    <DialogTitle>메뉴 추가</DialogTitle>
                    <DialogDescription>선택한 메뉴의 하위메뉴로 생성됩니다.</DialogDescription>
                  </DialogHeader>
                  <FormField name="menuName">
                    <FormItem>
                      <FormLabel>메뉴명</FormLabel>
                      <FormControl>
                        <Input v-model="cMenuName" v-bind="cMenuNameAttrs" />
                      </FormControl>
                      <FormMessage>{{ createForm.errors.value.menuName }}</FormMessage>
                    </FormItem>
                  </FormField>
                  <FormField name="menuUrl">
                    <FormItem>
                      <FormLabel>메뉴 URL</FormLabel>
                      <FormControl>
                        <Input v-model="cMenuUrl" v-bind="cMenuUrlAttrs" />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="sortOrder">
                    <FormItem>
                      <FormLabel>정렬 순서</FormLabel>
                      <FormControl>
                        <Input v-model="cSortOrder" v-bind="cSortOrderAttrs" type="number" />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="icon">
                    <FormItem>
                      <FormLabel>아이콘</FormLabel>
                      <FormControl>
                        <Input v-model="cIcon" v-bind="cIconAttrs" />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <DialogFooter>
                    <Button type="submit">저장</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="treeData.length === 0" class="text-center text-muted-foreground">
            메뉴가 없습니다.
          </div>
          <!-- 재귀 트리 렌더링 -->
          <div v-else>
            <MenuTreeNode
              v-for="node in treeData"
              :key="node.menuId"
              :node="node"
              :selected-id="selectedMenuId"
              @select="handleSelect"
            />
          </div>
        </CardContent>
      </Card>

      <!-- 메뉴 상세 -->
      <Card class="w-3/4">
        <form @submit="onModify">
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>메뉴 상세정보</CardTitle>
              <div v-if="selectedMenuId > 0" class="space-x-2">
                <Button type="submit">수정</Button>
                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button variant="destructive">삭제</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>삭제하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>삭제 시 하위 메뉴까지 삭제됩니다.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction @click="onDelete">삭제</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <FormField name="menuName">
              <FormItem>
                <FormLabel>메뉴명</FormLabel>
                <FormControl>
                  <Input v-model="mMenuName" v-bind="mMenuNameAttrs" />
                </FormControl>
                <FormMessage>{{ modifyForm.errors.value.menuName }}</FormMessage>
              </FormItem>
            </FormField>
            <FormField name="menuUrl">
              <FormItem>
                <FormLabel>메뉴 URL</FormLabel>
                <FormControl>
                  <Input v-model="mMenuUrl" v-bind="mMenuUrlAttrs" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="sortOrder">
              <FormItem>
                <FormLabel>정렬 순서</FormLabel>
                <FormControl>
                  <Input v-model="mSortOrder" v-bind="mSortOrderAttrs" type="number" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="icon">
              <FormItem>
                <FormLabel>아이콘</FormLabel>
                <FormControl>
                  <Input v-model="mIcon" v-bind="mIconAttrs" />
                </FormControl>
              </FormItem>
            </FormField>
          </CardContent>
        </form>
      </Card>
    </div>
  </div>
</template>
