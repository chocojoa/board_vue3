<script setup>
import { Checkbox } from '@/components/ui/checkbox'

const props = defineProps({
  nodes: { type: Array, required: true },
  checked: { type: Array, required: true },
})
const emit = defineEmits(['update:checked'])

function getAllDescendantIds(node) {
  const ids = [node.menuId]
  if (node.children?.length) {
    for (const child of node.children) {
      ids.push(...getAllDescendantIds(child))
    }
  }
  return ids
}

function getNodeState(node) {
  if (!node.children?.length) {
    return props.checked.includes(node.menuId)
  }
  const allIds = getAllDescendantIds(node)
  const checkedCount = allIds.filter((id) => props.checked.includes(id)).length
  if (checkedCount === 0) return false
  if (checkedCount === allIds.length) return true
  return 'indeterminate'
}

function toggle(node) {
  const allIds = getAllDescendantIds(node)
  const state = getNodeState(node)
  const set = new Set(props.checked)
  if (state === true) {
    allIds.forEach((id) => set.delete(id))
  } else {
    allIds.forEach((id) => set.add(id))
  }
  emit('update:checked', [...set])
}
</script>

<template>
  <div>
    <div v-for="node in nodes" :key="node.menuId">
      <div class="flex items-center gap-2 py-1.5 px-2 rounded-sm hover:bg-muted/50">
        <Checkbox
          :id="`menu-${node.menuId}`"
          :model-value="getNodeState(node)"
          @update:model-value="toggle(node)"
        />
        <label :for="`menu-${node.menuId}`" class="text-sm cursor-pointer select-none">
          {{ node.menuName }}
        </label>
      </div>
      <div v-if="node.children?.length" class="pl-6">
        <MenuCheckTree
          :nodes="node.children"
          :checked="checked"
          @update:checked="$emit('update:checked', $event)"
        />
      </div>
    </div>
  </div>
</template>
