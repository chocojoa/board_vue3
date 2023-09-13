<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';

import { RouterLink } from 'vue-router';

</script>

<template>
	<div class="border-top-wide border-primary d-flex flex-column">
		<div class="page page-center" style="height: 99vh">
			<div class="container container-tight py-4">
				<div class="card card-md">
					<form>
						<div class="card-body">
							<h2 class="card-title text-center mb-4 fw-bold">계정 생성</h2>
							<div class="mb-3">
								<label class="form-label required" for="userName">이름</label>
								<input type="text" class="form-control" v-model="formData.userName" required />
								<div class="invalid-feedback">이름을 입력해 주세요.</div>
							</div>
							<div class="mb-3">
								<label class="form-label required" for="email">이메일 주소</label>
								<input type="email" class="form-control" v-model="formData.email" required />
								<div class="invalid-feedback">이메일 형식에 맞게 입력해 주세요 </div>
							</div>
							<div class="mb-3">
								<label class="form-label required" for="password">비밀번호</label>
								<input type="password" class="form-control" v-model="formData.password" autocomplete="off" pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$" required/>
								<div class="invalid-feedback">최소 8자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자로 입력해 주세요</div>
							</div>
							<div class="form-footer">
								<button type="button" class="btn btn-primary w-100" @click="validateUser">계정 생성</button>
							</div>
						</div>
					</form>
				</div>
				<div class="text-center text-muted mt-3">
					이미 계정이 있습니까? <RouterLink :to="{ name: 'login'}">로그인</RouterLink>
				</div>
			</div>
		</div>
	</div>

</template>
<script>
	export default {
		data() {
			return {
				formData : {
					userName : '',
					email : '',
					password : '',
					createdBy : 0
				}
			};
		},
		methods: {
			validateUser(event) {
				let $vm = this;
				Swal.fire({
					title: '계정생성 하시겠습니까?',
					icon: 'question',
					showCancelButton: true,
					focusConfirm: false,
					confirmButtonText: '저장',
					cancelButtonText: '취소'
				}).then((result) => {
					if(result.isConfirmed) {
						let form = document.querySelector('form');
						if (!form.checkValidity()) {
							event.preventDefault();
							event.stopPropagation();
						} else {
							$vm.createUser();
						}
						form.classList.add('was-validated');
					}
				});
			},
			createUser(){
				let $vm = this;
				axios({
					method: 'POST',
					url: '/api/auth/signUp',
					data: $vm.formData,
					headers: { 'Content-Type': 'application/json'}
				}).then(function () {
					Swal.fire({
						icon: 'success',
						title: '저장되었습니다.',
						timer: 1500,
					}).then(() => {
						$vm.$router.push({name: 'login'});
					});
				}).catch(function (error) {
					Swal.fire({
						icon: 'error',
						title: '에러가 발생하였습니다.',
						text: error.statusText
					});
				});
			}
		}
	}
</script>