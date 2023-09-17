import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store';

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
						{ path: 'dashboardMain', name: 'dashboardMain', component: () => import('@/views/dashboard/DashboardMain.vue'), meta: { requiresAuth: true } },
					]
				},
				{
					path: 'board', name: 'board', component: () => import('@/views/layouts/DefaultLayout.vue'),
					children: [        
						{ path: 'boardList', name: 'boardList', component: () => import('@/views/board/BoardList.vue'), meta: { requiresAuth: true } },
						{ path: 'boardNew', name: 'boardNew', component: () => import('@/views/board/BoardNew.vue'), meta: { requiresAuth: true } },
						{ path: 'boardView', name: 'boardView', component: () => import('@/views/board/BoardView.vue'), meta: { requiresAuth: true } },
						{ path: 'boardModify', name: 'boardModify', component: () => import('@/views/board/BoardModify.vue'), meta: { requiresAuth: true } }, 
					]
				},
				{
					path: 'auth', name: 'auth', component: () => import('@/views/layouts/EmptyLayout.vue'),
					children: [
						{ path: 'login', name: 'login', component: () => import('@/views/login/Login.vue') },
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
		{ path: '/:pathMatch(.*)*', redirect: { name : 'error' } }
	]
})

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore();
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		// 사용자가 로그인하지 않은 경우
		if (!authStore.isAuthenticated) {
			// 로그인 페이지로 리다이렉트
			next('/auth/login');
		} else {
			// 사용자가 로그인한 경우
			next();
		}
	}else{
		// 로그인이 필요하지 않은 라우트인 경우
		next();
	}
});

export default router