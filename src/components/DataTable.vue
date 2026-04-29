<script setup>
import { computed } from 'vue'
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import Pagination from './Pagination.vue'

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  totalCount: { type: Number, default: 0 },
  pageIndex: { type: Number, default: 0 },
  pageSize: { type: Number, default: 10 },
  sortColumn: { type: String, default: '' },
  sortDirection: { type: String, default: 'asc' },
})

const emit = defineEmits(['update:pageIndex', 'update:pageSize', 'sort'])

const sorting = computed(() =>
  props.sortColumn
    ? [{ id: props.sortColumn, desc: props.sortDirection === 'desc' }]
    : [],
)

const pagination = computed(() => ({
  pageIndex: props.pageIndex,
  pageSize: props.pageSize,
}))

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  get rowCount() {
    return props.totalCount
  },
  manualPagination: true,
  manualSorting: true,
  get state() {
    return {
      pagination: pagination.value,
      sorting: sorting.value,
    }
  },
  onPaginationChange: (updater) => {
    const next =
      typeof updater === 'function' ? updater(pagination.value) : updater
    if (next.pageIndex !== props.pageIndex) {
      emit('update:pageIndex', next.pageIndex)
    }
    if (next.pageSize !== props.pageSize) {
      emit('update:pageSize', next.pageSize)
      emit('update:pageIndex', 0)
    }
  },
  onSortingChange: (updater) => {
    const next =
      typeof updater === 'function' ? updater(sorting.value) : updater
    if (next.length > 0) {
      emit('sort', { column: next[0].id, direction: next[0].desc ? 'desc' : 'asc' })
    }
  },
})

defineExpose({ table })
</script>

<template>
  <div class="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :style="{ width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined }"
            :class="header.column.getCanSort() ? 'cursor-pointer select-none' : ''"
            @click="header.column.getCanSort() ? header.column.getToggleSortingHandler()?.($event) : undefined"
          >
            <div class="flex items-center" v-if="!header.isPlaceholder">
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
              <ChevronUp v-if="header.column.getIsSorted() === 'asc'" :size="14" class="ml-1" />
              <ChevronDown v-else-if="header.column.getIsSorted() === 'desc'" :size="14" class="ml-1" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="columns.length" class="h-12 text-center">
            검색 결과가 없습니다.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <Pagination :table="table" />
</template>
