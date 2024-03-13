<script setup>

import { ref } from 'vue'
import {createHistory, fetchPaginatedHistory, spellCheck} from "@/api/API.ts";
import {useWebDataStore} from "@/stores/webdata";
import Table from "@/components/Table.vue";

const dataweb = useWebDataStore();
const isAppear = ref(false)
const input = ref('')
const data= ref([]) // Dữ liệu cần phân trang
const currentPage= ref(1) // Trang hiện tại
const pageSize= ref(10) // Số mục trên mỗi trang


function clear(){
  dataweb.clearData();
  input.value='';
}

</script>


<template>

  <div style="display: inline-block;margin-bottom: 50px">
      <el-button type="primary" @click="spellCheck(input)">Submit URL</el-button>
      <el-input v-model="input"  placeholder="Please input URL" style="width: 400px; margin-left: 10px"/>
      <el-button @click="clear()" style="margin-left: 10px" >Reset</el-button>
  </div>
  <div style=" width: 100% ; display: flex ; margin-bottom: 50px">
    <div  v-if="dataweb.body!=''" >
      <img width="100" height="100"  src="/check.png" style="margin-right: 20px"/>
    </div>
    <div>
      <h2 style="color:aquamarine">{{ dataweb.header }}</h2>
      <a target="_blank" v-if="dataweb.body!=''"  :href="input + dataweb.body" style="margin-top: 20px; color: #00d0ff">{{input}}</a>
    </div>
  </div>

  <div>
    <Table/>
  </div>

</template>