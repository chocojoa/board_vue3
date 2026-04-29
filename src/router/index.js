import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import { useAuthStore } from '@/store/useAuthStore'

const PublicLayout = () => import('@/layouts/PublicLayout.vue')
const PrivateLayout = () => import('@/layouts/PrivateLayout.vue')

const routes = [
  {
    path: '/',
    component: PrivateLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard/Dashboard.vue'),
      },
      {
        path: 'user/profile',
        component: () => import('@/pages/user/Profile.vue'),
      },
      {
        path: 'boards/:categoryId/posts',
        component: () => import('@/pages/post/PostList.vue'),
      },
      {
        path: 'boards/:categoryId/posts/create',
        component: () => import('@/pages/post/PostCreate.vue'),
      },
      {
        path: 'boards/:categoryId/posts/:postId',
        component: () => import('@/pages/post/PostDetail.vue'),
      },
      {
        path: 'boards/:categoryId/posts/:postId/edit',
        component: () => import('@/pages/post/PostEdit.vue'),
      },
      {
        path: 'admin/users',
        component: () => import('@/pages/admin/user/UserList.vue'),
      },
      {
        path: 'admin/users/create',
        component: () => import('@/pages/admin/user/UserCreate.vue'),
      },
      {
        path: 'admin/users/:userId',
        component: () => import('@/pages/admin/user/UserDetail.vue'),
      },
      {
        path: 'admin/users/:userId/edit',
        component: () => import('@/pages/admin/user/UserEdit.vue'),
      },
      {
        path: 'admin/menus',
        component: () => import('@/pages/admin/menu/MenuList.vue'),
      },
      {
        path: 'admin/roles',
        component: () => import('@/pages/admin/role/Role.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: PublicLayout,
    children: [
      { path: '', redirect: '/auth/signIn' },
      {
        path: 'signIn',
        component: () => import('@/pages/auth/SignIn.vue'),
      },
      {
        path: 'signUp',
        component: () => import('@/pages/auth/SignUp.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/common/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/auth/signIn'
  }
  if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
    return '/dashboard'
  }
})

export default router
