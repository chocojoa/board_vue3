import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', 
      redirect: { name : 'dashboardMain' },
      children: [
        {
          path: 'dashboard', name: 'dashboard', component: () => import('@/views/layouts/DefaultLayout.vue'),
          children: [
            { path: 'dashboardMain', name: 'dashboardMain', component: () => import('@/views/dashboard/DashboardMain.vue') },
          ]
        },
        {
          path: 'board', name: 'board', component: () => import('@/views/layouts/DefaultLayout.vue'),
          children: [        
            { path: 'boardList', name: 'boardList', component: () => import('@/views/board/BoardList.vue') },
            { path: 'boardNew', name: 'boardNew', component: () => import('@/views/board/BoardNew.vue') },
            { path: 'boardView', name: 'boardView', component: () => import('@/views/board/BoardView.vue') },
            { path: 'boardModify', name: 'boardModify', component: () => import('@/views/board/BoardModify.vue') }, 
          ],
        },
        {
          path: 'auth', name: 'auth', component: () => import('@/views/layouts/EmptyLayout.vue'),
          children: [
            { path: 'signIn', name: 'signIn', component: () => import('@/views/login/SignIn.vue') },
            { path: 'signUp', name: 'signUp', component: () => import('@/views/login/SignUp.vue') },        
          ],
        },
        {
          path: 'error', name: 'error', component: () => import('@/views/layouts/EmptyLayout.vue'),
          children: [
            { path: '', name: 'notFoundPage', component: () => import('@/views/error/NotFoundPage.vue') },
          ]
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name : 'error' }
    }
  ]
})

export default router
