<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../store';
</script>

<template>
	<div class='card-body p-2'>
		<div class='row'>
			<div class='col-auto' v-if="comment.step > 0">
				<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-corner-down-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M6 6v6a3 3 0 0 0 3 3h10l-4 -4m0 8l4 -4"></path>
				</svg>
			</div>
			<div class='col-auto'>
				<span>{{ comment.userName }}</span>
			</div>
			<div class='col'>
				<span>{{ comment.content }}</span>
			</div>
			<div class='col-auto' v-if="comment.step === 0">
				<button class="btn btn-sm" v-on:click="showCommentDiv = !showCommentDiv" v-if="!showCommentDiv">댓글</button>
			</div>
			<div class='col-auto'>
				<span>{{ comment.createdDate }}</span>
			</div>
		</div>
		<div class='row mt-2' v-if="comment.step === 0 && showCommentDiv">
			<div class='col'>
				<input type='text' v-model='replyData.content' class='form-control form-control-sm' />
			</div>
			<div class='col-auto btn-list'>
				<button class='btn btn-primary btn-sm' @click="createReplyComment">저장</button>
				<button class='btn btn-secondary btn-sm' @click="closeReplyComment">취소</button>
			</div>
		</div>
	</div>
</template>
<script>

	const authStore = useAuthStore();

	export default {
		props : {
			comment : Object
		},
		data() {
			return {
				showCommentDiv : false,
				replyData : {
					boardId : this.comment.boardId,
					parentCommentId : this.comment.commentId,
					content : '',
					userId : authStore.user.userId
				}
			}
		},
		methods : {
			createReplyComment(){                      
				let $vm = this;
				axios({
					method: 'POST',
					url: '/api/comment',
					data: $vm.replyData,
					headers: { 'Content-Type': 'application/json'}
				})
				.then(function () {
					$vm.showCommentDiv = false;
					$vm.replyData.content = '';
					$vm.$emit('retrieveCommentList');
				})
				.catch(function (error) {
					Swal.fire({
						icon: 'error',
						title: '에러가 발생하였습니다.',
						text: error.statusText
					});
				});
			},
			closeReplyComment(){
				this.showCommentDiv = false;
				this.replyData.content = '';
			}
		}
	}
</script>