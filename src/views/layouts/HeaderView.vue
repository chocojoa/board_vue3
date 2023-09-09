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
							<span sec:authentication="principal.userDTO.userName"></span>
							(<span sec:authentication="principal.userDTO.email"></span>)
					</div>
				</a>
				<div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
					<a th:href="@{/user/profile(email=${#authentication.name})}" class="dropdown-item">계정정보</a>
					<a th:href="@{/auth/logOut}" class="dropdown-item">로그아웃</a>
				</div>
			</div>
		</div>
	</header>
</template>