import axios from 'axios'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/store/useAuthStore'
import { useMenuStore } from '@/store/useMenuStore'
import router from '@/router'

const api = axios.create({
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

function processQueue(error) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isExpired =
      error.response?.status === 401 &&
      error.response?.data?.message === 'JWT_TOKEN_IS_EXPIRED'

    if (isExpired && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await api.post('/api/auth/reissue')
        processQueue(null)
        return api(originalRequest)
      } catch (reissueError) {
        processQueue(reissueError)
        const authStore = useAuthStore()
        const menuStore = useMenuStore()
        authStore.signOut()
        menuStore.clear()
        router.push('/auth/signIn')
        return Promise.reject(reissueError)
      } finally {
        isRefreshing = false
      }
    }

    const message = error.response?.data?.message || '오류가 발생했습니다.'
    if (error.response?.status !== 401) {
      toast.error(message)
    }

    return Promise.reject(error)
  },
)

export function useAxios() {
  return api
}

export default api
