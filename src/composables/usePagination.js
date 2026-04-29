import { ref } from 'vue'

export function usePagination(initialSize = 10) {
  const page = ref(0)
  const size = ref(initialSize)
  const total = ref(0)

  function setTotal(value) {
    total.value = value
  }

  function setPage(value) {
    page.value = value
  }

  function setSize(value) {
    size.value = value
    page.value = 0
  }

  return { page, size, total, setTotal, setPage, setSize }
}
