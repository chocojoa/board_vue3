<script setup>
import { ref } from 'vue'
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import PageTitle from '../../components/PageTitle.vue';

DataTable.use(DataTablesCore);

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
                <h3>게시판 목록</h3>
              </div>
              <div class="col-auto">
                <div class="btn-list float-end">
                  <a href="#" class="btn btn-primary" @click="regBoard">등록</a>
                  <a href="#" class="btn btn-dark" @click="searchBoard">검색</a>
                </div>
              </div>
            </div>

            <!-- Search -->
            <div class="row mb-3">
              <div class="col-md-4 col-sm-12">
                <label class="form-label" for="title">제목</label>
                <div>
                    <input type="text" class="form-control" id="title" v-model="searchData.title" @keyup.enter="searchBoard" />
                </div>
              </div>
              <div class="col-md-4 col-sm-12">
                <label class="form-label" for="title">작성자</label>
                <div>
                    <input type="text" class="form-control" id="userName" v-model="searchData.userName" @keyup.enter="searchBoard" />
                </div>
              </div>
              <div class="col-md-4 col-sm-12">
                <label class="form-label" for="title">작성일</label>
                <div class="row g-2 align-items-center input-daterange">
                  <div class="col">
                    <input type="text" class="form-control" id="startCreatedDate" v-model="searchData.startCreatedDate" @keyup.enter="searchBoard" />
                  </div>
                  <div class="col-auto">
                    ~
                  </div>
                  <div class="col">
                    <input type="text" class="form-control" id="endCreatedDate" v-model="searchData.endCreatedDate" @keyup.enter="searchBoard" />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Datatables -->
            <DataTable :ajax="ajax" :options="options" class="display" ref="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>작성일</th>
                </tr>
              </thead>
            </DataTable>
              
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  @import 'datatables.net-dt';
  @import '../../assets/datatables.css';
</style>

<script>
  import langKor from '../../assets/datatables_kor.js';

  let dt;
  const table = ref(); 

  export default {
    data() {
      let $vm = this;
      let category = this.$route.query.category;

      return {
        preTitle : 'Board',
        title : '게시판',
        searchData : {
          title : '',
          userName : '',
          startCreatedDate : '',
          endCreatedDate : '',
        },
        ajax : {
          type : 'POST',
          url : '/api/boards',
          data : function (data) {
            data.category = category;
            data.title = $vm.searchData.title;
            data.userName = $vm.searchData.userName;
            data.startCreatedDate = $vm.searchData.startCreatedDate;
            data.endCreatedDate = $vm.searchData.endCreatedDate;
            data['order'].forEach(function(item, index) {
              data['order'][index]['column'] = data['columns'][item.column]['data'];
            });
            return JSON.stringify(data);
          },
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          dataSrc: 'data'
        },
        options : {
          language: langKor,
          serverSide: true,
          processing: true,
          searching: false,
          responsive: true,
          columns: [
            { data: 'rowNumber' },
            { 
              data: 'title',
              render: function(data, type, row){
                return `<span>${row.title} [${row.commentCount}]</span>`;
              }
            },
            { data: 'userName' },
            { data: 'createdDate' },
          ],           
          columnDefs: [
            { targets: [0,1,2,3], className: 'dt-head-center'},
            { width: '10%', targets: 0, className: 'dt-body-center' },
            { width: '50%', targets: 1, className: 'dt-body-left' },
            { width: '10%', targets: 2, className: 'dt-body-center' },
            { width: '10%', targets: 3, className: 'dt-body-center' },
          ],
          order: [
            [0, 'desc']
          ]
        }
      }
    },
    methods: {
      regBoard() {
        let category = this.$route.query.category;
        this.$router.push({name: 'boardNew', query: {category: category}});
      },
      viewBoard(boardId) {
        let category = this.$route.query.category;        
        this.$router.push({name: 'boardView', query: {category: category, boardId: boardId}});
      },
      searchBoard() {
        dt = table.value.dt;
        dt.draw();
      }
    },
    mounted() {
      let $vm = this;
      dt = table.value.dt;
      dt.on('click', 'tbody tr', function () {
        let data = dt.row(this).data();
        let boardId = data.boardId;
        $vm.viewBoard(boardId);
      });
    }
  }
  
</script>