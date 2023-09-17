<script setup>
import { useAuthStore } from '../../store';
</script>
<template>
	<header class="navbar navbar-expand-md navbar-light d-print-none">
		<div class="container-xl">
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
				<span class="navbar-toggler-icon"></span>
			</button>
			<h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
				<a href="/">고객관리</a>
			</h1>
			<div class="nav-item dropdown">
				<a href="#" class="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown" aria-label="Open user menu">
					<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mood-smile" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
						<path d="M9 10l.01 0"></path>
						<path d="M15 10l.01 0"></path>
						<path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path>
					</svg>
					<div class="d-none d-xl-block ps-2">
							<span>{{ userName }} ({{ email }})</span>
					</div>
				</a>
				<div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
					<a class="dropdown-item">계정정보</a>
					<a class="dropdown-item" @click="logout">로그아웃</a>
				</div>
			</div>
		</div>
	</header>
</template>
<script>
	const authStore = useAuthStore();
	export default {
		data() {
			return { 
				userName: authStore.user.userName,
				email : authStore.user.email,
			}
		},
		methods : {
			logout() {
				authStore.logout();
				this.$router.push({name: 'login' });

				// 로그아웃 시 로그인 정보를 Local Storage에서 삭제
				localStorage.removeItem('piniaState');
			}
		}
	}
</script>