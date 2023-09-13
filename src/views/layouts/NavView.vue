<script setup>
import { RouterLink } from 'vue-router';

</script>

<template>
	<div class="navbar-expand-md">
		<div class="collapse navbar-collapse" id="navbar-menu">
			<div class="navbar navbar-light">
				<div class="container-xl">
					<ul class="navbar-nav">
						<li class="nav-item" :class="{active:active === 'dashboard'}" @click="active = 'dashboard'">
							<RouterLink class="nav-link" :to="{ name: 'dashboardMain'}" >
								<span class="nav-link-icon d-md-none d-lg-inline-block">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-report-analytics" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
										<path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
										<path d="M9 17v-5"></path>
										<path d="M12 17v-1"></path>
										<path d="M15 17v-3"></path>
									</svg>
								</span>
								<span class="nav-link-title">대시보드</span>
							</RouterLink>
						</li>
						<li class="nav-item" :class="{active:active === 'board'}" @click="active = 'board'">
							<RouterLink class="nav-link" :to="{ name: 'boardList', query: { category: 'free' }}">
								<span class="nav-link-icon d-md-none d-lg-inline-block">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-report-analytics" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
										<path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
										<path d="M9 17v-5"></path>
										<path d="M12 17v-1"></path>
										<path d="M15 17v-3"></path>
									</svg>
								</span>
								<span class="nav-link-title">게시판</span>
							</RouterLink>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return { 
			active: 'dashboard'
		}
	}
}

</script>