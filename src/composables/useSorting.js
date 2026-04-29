import { ref } from 'vue'

export function useSorting(initialColumn = '', initialDirection = 'asc') {
  const sortColumn = ref(initialColumn)
  const sortDirection = ref(initialDirection)

  function toggleSort(column) {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortColumn.value = column
      sortDirection.value = 'asc'
    }
  }

  return { sortColumn, sortDirection, toggleSort }
}
