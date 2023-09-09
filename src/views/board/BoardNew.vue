<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';

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

            <!-- SubTitle & Button -->
            <div class="row mb-3">
              <div class="col mt-1">
                <h3>게시판 등록</h3>
              </div>
              <div class="col-auto">
                <div class="btn-list float-end">
                  <a href="#" class="btn" @click="moveBoardList">이전</a>
                  <a href="#" class="btn btn-primary" @click="validateBoard">저장</a>
                </div>
              </div>
            </div>

            <!-- form -->
            <form>
              <div class="row mb-3">
                <div class="col-lg-12">
                  <label class="form-label required" for="title">제목</label>
                  <input class="form-control" v-model="formData.title" type="text" required />
                  <div class="invalid-feedback">제목을 입력해 주세요.</div>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-lg-12">
                  <label class="form-label required" for="content">내용</label>
                  <textarea class="form-control" v-model="formData.content" rows="10" required></textarea>
                  <div class="invalid-feedback">내용을 입력해 주세요</div>
                </div>
              </div>
            </form>

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
        preTitle : 'Board',
        title : '게시판',
        formData : {
          category : this.$route.query.category,
          title : '',
          content : ''
        },
      }
    },
    methods : {
      moveBoardList() {
        let category = this.$route.query.category;
        this.$router.push({name: 'boardList', query: {category: category}});
      },
      validateBoard(event) {
        let $vm = this;
        Swal.fire({
          title: '저장하시겠습니까?',
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
              $vm.createBoard($vm.formData);
            }
            form.classList.add('was-validated');
          }
        });
      },
      createBoard(jsonData){
        let $vm = this;
        axios({
          method: 'POST',
          url: '/api/board',
          data: jsonData,
          headers: { 'Content-Type': 'application/json'}
        })
        .then(function () {
          Swal.fire({
            icon: 'success',
            title: '저장되었습니다.',
						timer: 1500,
					}).then(() => {
						$vm.moveBoardList();
					});
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
    }
  }
  
</script>