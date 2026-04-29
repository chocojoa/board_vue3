<script setup>
defineProps({
  node: { type: Object, required: true },
  selectedId: { type: Number, required: true },
})
defineEmits(['select'])
</script>

<template>
  <div>
    <div
      class="px-2 py-1 rounded cursor-pointer text-sm hover:bg-accent"
      :class="{ 'bg-primary text-primary-foreground': selectedId === node.menuId }"
      @click="$emit('select', node)"
    >
      {{ node.menuName }}
    </div>
    <div v-if="node.children && node.children.length > 0" class="pl-4">
      <MenuTreeNode
        v-for="child in node.children"
        :key="child.menuId"
        :node="child"
        :selected-id="selectedId"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>
