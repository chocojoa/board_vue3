<script setup>
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-vue-next'

const props = defineProps({
  table: { type: Object, required: true },
})

const pageIndex = computed(() => props.table.getState().pagination.pageIndex)
const pageSize = computed(() => props.table.getState().pagination.pageSize)
const pageCount = computed(() => props.table.getPageCount())
const pageNumbers = computed(() =>
  Array.from({ length: pageCount.value }, (_, i) => i),
)
</script>

<template>
  <div class="flex items-center justify-between mt-2">
    <div class="flex items-center justify-center text-sm font-medium">
      페이지 {{ pageIndex + 1 }} / {{ pageCount || 1 }}
    </div>
    <div class="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanPreviousPage()"
        @click="table.firstPage()"
      >
        <ChevronsLeft :size="16" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()"
      >
        <ChevronLeft :size="16" />
      </Button>
      <Button
        v-for="num in pageNumbers"
        :key="num"
        variant="outline"
        size="sm"
        :class="pageIndex === num ? 'font-bold' : ''"
        @click="table.setPageIndex(num)"
      >
        {{ num + 1 }}
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage()"
      >
        <ChevronRight :size="16" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanNextPage()"
        @click="table.lastPage()"
      >
        <ChevronsRight :size="16" />
      </Button>
    </div>
    <div class="flex items-center space-x-2">
      <p class="text-sm font-medium">페이지당 행</p>
      <Select
        :model-value="String(pageSize)"
        @update:model-value="(v) => table.setPageSize(Number(v))"
      >
        <SelectTrigger class="h-8 w-[70px]">
          <SelectValue :placeholder="String(pageSize)" />
        </SelectTrigger>
        <SelectContent side="top">
          <SelectItem v-for="s in [10, 20, 30, 40, 50]" :key="s" :value="String(s)">
            {{ s }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
