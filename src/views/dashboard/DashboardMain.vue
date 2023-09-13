<script setup>
	import PageTitle from '../../components/PageTitle.vue';
</script>

<template>
	<div class="page-wrapper">
		<div class="container-xl">
			<!-- Page title -->
			<PageTitle :preTitle="preTitle" :title="title" ref="table" />
		</div>
		<div class="page-body">
			<div class="container-xl">
				<div class="card">
					<div class="card-body">
						<p>
							<span>게시판 및 로그인 관련 Vue3.0 공부 화면 입니다.</span>
						</p>
						<p>
							<span>프로젝트 구성은 다음과 같습니다.</span>
						</p>
						<ul>
							<li>Java 17</li>
							<li>Spring Boot 3.1.2</li>
							<li>Mybatis</li>
							<li>MySQL 8.0</li>
							<li>Vue 3.0</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	export default {    
		data() {
			return {        
				preTitle : 'Dashboard',
				title : '대시보드',
			}
		}
	}
	
</script>