<script setup>
import { useAuthStore } from '@/store/authStore';
import Swal from 'sweetalert2';
</script>

<template>
	<div class="border-top-wide border-primary d-flex flex-column">
		<div class="page page-center" style="height: 99vh">
			<div class="container container-tight py-4">
				<div class="card card-md">
					<form>
						<div class="card-body">
							<h2 class="card-title text-center mb-4 fw-bold">로그인</h2>
							<div class="mb-3">
								<label class="form-label">이메일 주소</label>
								<input type="email" class="form-control" id="email" v-model="email" />
							</div>
							<div class="mb-2">
								<label class="form-label">
									비밀번호
									<span class="form-label-description">
										<a th:href="@{/auth/resetPassword}">비밀번호 초기화</a>
									</span>
								</label>
								<div class="input-group input-group-flat">
									<input type="password" class="form-control" autocomplete="off" id="password" v-model="password" />
									<span class="input-group-text" id="keyShow">
										<a href="#" id="showPassIcon" class="link-secondary" title="비밀번호 표시" data-bs-toggle="tooltip">
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
												<path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="2" />
												<path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />
											</svg>
										</a>
										<a href="#" id="hidePassIcon" class="link-secondary" title="비밀번호 숨기기" data-bs-toggle="tooltip" style="display: none">
											<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
												<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
												<path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
												<path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
												<path d="M3 3l18 18"></path>
											</svg>
										</a>
									</span>
								</div>
							</div>
							<div class="mb-2">
								<label class="form-check">
									<input type="checkbox" class="form-check-input" id="rememberMe" name="rememberMe" />
									<span class="form-check-label">이메일 주소 기억</span>
								</label>
							</div>
							<div class="form-footer">
								<button type="button" class="btn btn-primary w-100" @click="validateLogin">로그인</button>
							</div>
						</div>
					</form>
				</div>
				<div class="text-center text-muted mt-3">
					계정이 없다면? <RouterLink :to="{ name: 'signUp'}">개정 생성</RouterLink>
				</div>
			</div>
		</div>
	</div>

</template>
<script>
	export default {
		data() {
			return {
				email : '',
				password : '',
			};
		},
		methods: {
			validateLogin(event) {
				let $vm = this;
				let form = document.querySelector('form');
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				} else {
					$vm.handleSubmit();
				}
				form.classList.add('was-validated');
			},

			async handleSubmit() {
				try {
					const authStore = useAuthStore();
					await authStore.login({
						email: this.email,
						password: this.password
					});

					// 스토어 상태를 Local Storage에 저장
					localStorage.setItem('piniaState', JSON.stringify(authStore.$state));					
					
					// 로그인 성공 후 리다이렉트 또는 다른 작업 수행
					this.$router.push('/');
				} catch (error) {
					Swal.fire({
						icon: 'error',
						title: '에러가 발생하였습니다.',
						text: error.message
					});
				}
			}
		}
	}
</script>