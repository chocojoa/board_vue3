<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';

import PageTitle from '../../components/PageTitle.vue';
import CommentList from './CommentList.vue';
import { useAuthStore } from '../../store';

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

						<!-- SubTitle & Button -->
						<div class="row mb-3">
							<div class="col mt-1">
								<h3>게시판 상세</h3>
							</div>
							<div class="col-auto">
								<div class="btn-list float-end">
									<a href="#" class="btn" @click="moveBoardList">이전</a>
									<a href="#" class="btn btn-primary" @click="moveBoardModify">수정</a>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col">
								<h4>{{ formData.title }}</h4>
							</div>
							<div class="col-auto">
								<div class="list-inline list-inline-dots d-sm-block d-none">
									<div class="list-inline-item">
										등록일 : <span>{{ formData.createdDate }}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="row mb-3">
							<span v-html="formData.content"></span>
						</div>

						<div class="row p-0">
							<CommentList v-for="(comment, idx) in commentList" :comment="commentList[idx]" :key="comment.commentId" @retrieveCommentList="retrieveCommentList" />
						</div>

						<div class="row">
							<h4>댓글</h4>
							<div class="row input-group mb-3">
								<div class="col">
									<input class="form-control" id="commentContent" v-model="commentFormData.content" type="text" />
								</div>
								<div class="col-auto p-0">
									<a href="#" class="btn btn-primary" @click="createComment">
										저장
									</a>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	const authStore = useAuthStore();

	export default {    
		data() {
			return {
				preTitle : 'Board',
				title : '게시판',
				formData : {
					category : this.$route.query.category,
					boardId : this.$route.query.boardId,
					title : '',
					content : '',
					createdDate : '',          
				},
				commentFormData : {          
					boardId : this.$route.query.boardId,
					parentCommentId : 0,          
					content : '',
					userId : authStore.user.userId,
				},
				commentList : [],
			}
		},
		methods : {
			moveBoardList() {
				let category = this.formData.category;
				this.$router.push({name: 'boardList', query: {category: category}});
			},
			moveBoardModify() {
				let category = this.formData.category;
				let boardId = this.formData.boardId;
				this.$router.push({name: 'boardModify', query: {category: category, boardId : boardId}});
			},
			retrieveBoard() {
				let $vm = this;
				let category = this.formData.category;
				let boardId = this.formData.boardId;
				axios({
					method: 'GET',
					url: `/api/board?category=${category}&boardId=${boardId}`,
				})
				.then(function (data) {
					$vm.formData.createdDate = data.data.createdDate;
					$vm.formData.title = data.data.title;
					$vm.formData.content = data.data.content.replace(/(?:\r\n|\r|\n)/g, '<br />');
				});
			},
			retrieveCommentList() {        
				let $vm = this;
				let category = this.formData.category;
				let boardId = this.formData.boardId;
				axios({
					method: 'GET',
					url: `/api/comments?category=${category}&boardId=${boardId}`,
				})
				.then(function (data) {          
					$vm.commentList = data.data;
				});
			},
			createComment(){
				let $vm = this;
				axios({
					method: 'POST',
					url: '/api/comment',
					data: $vm.commentFormData,
					headers: { 'Content-Type': 'application/json'}
				})
				.then(function () {
						$vm.commentFormData.content = '';
						$vm.retrieveCommentList();
				})
				.catch(function (error) {
					Swal.fire({
						icon: 'error',
						title: '에러가 발생하였습니다.',
						text: error.statusText
					});
				});
			},
		},
		mounted() {
			this.retrieveBoard();
			this.retrieveCommentList();
		}
	}
	
</script>