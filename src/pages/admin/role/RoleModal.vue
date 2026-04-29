<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import api from '@/composables/useAxios'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/button'
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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps({
  roleId: { type: Number, default: 0 },
  retrieveRoleList: { type: Function, required: true },
})

const authStore = useAuthStore()
const dialogOpen = ref(false)
const isCreate = props.roleId === 0

const schema = toTypedSchema(
  z.object({
    roleName: z.string().min(1, '권한명을 입력해 주세요.'),
    description: z.string().default(''),
  }),
)

const { handleSubmit, defineField, errors, resetForm, setValues } = useForm({
  validationSchema: schema,
})
const [roleName, roleNameAttrs] = defineField('roleName')
const [description, descriptionAttrs] = defineField('description')

async function handleOpen() {
  if (!isCreate) {
    try {
      const { data } = await api.get(`/api/admin/roles/${props.roleId}`)
      setValues({ roleName: data.data.roleName, description: data.data.description })
    } catch (error) {
      toast.error('조회 중 오류가 발생했습니다.', { description: error.response?.data?.message })
    }
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    const payload = { ...values, userId: authStore.user.userId }
    if (isCreate) {
      await api.post('/api/admin/roles', payload)
      toast.success('저장되었습니다.')
    } else {
      await api.put(`/api/admin/roles/${props.roleId}`, payload)
      toast.success('수정되었습니다.')
    }
    resetForm()
    dialogOpen.value = false
    props.retrieveRoleList()
  } catch (error) {
    toast.error('오류가 발생했습니다.', { description: error.response?.data?.message })
  }
})

async function onDelete() {
  try {
    await api.delete(`/api/admin/roles/${props.roleId}`)
    toast.success('삭제되었습니다.')
    dialogOpen.value = false
    props.retrieveRoleList()
  } catch (error) {
    toast.error('삭제 중 오류가 발생했습니다.', { description: error.response?.data?.message })
  }
}
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <Button
        v-if="isCreate"
        variant="outline"
        @click="handleOpen"
      >등록</Button>
      <Button
        v-else
        variant="outline"
        size="sm"
        class="px-3 py-1"
        @click="handleOpen"
      >수정</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <form @submit="onSubmit" class="space-y-4">
        <DialogHeader>
          <DialogTitle>{{ isCreate ? '권한 추가' : '권한 수정' }}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <FormField name="roleName">
          <FormItem>
            <FormLabel>권한명</FormLabel>
            <FormControl>
              <Input v-model="roleName" v-bind="roleNameAttrs" placeholder="권한명을 입력하세요" />
            </FormControl>
            <FormMessage>{{ errors.roleName }}</FormMessage>
          </FormItem>
        </FormField>
        <FormField name="description">
          <FormItem>
            <FormLabel>설명</FormLabel>
            <FormControl>
              <Textarea v-model="description" v-bind="descriptionAttrs" placeholder="설명을 입력하세요" />
            </FormControl>
          </FormItem>
        </FormField>
        <DialogFooter>
          <Button type="button" variant="outline" @click="dialogOpen = false">취소</Button>
          <Button v-if="!isCreate" type="button" variant="destructive" @click="onDelete">삭제</Button>
          <Button type="submit">저장</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
