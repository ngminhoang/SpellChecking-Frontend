<script setup>

import {ref} from 'vue'
import {createHistory, fetchPaginatedHistory, spellCheck} from "@/api/API.ts";
import {useWebDataStore} from "@/stores/webdata";
import Table from "@/components/Table.vue";

const dataweb = useWebDataStore();
const input = ref('')

function clear() {
  dataweb.clearData();
  input.value = '';
}

</script>


<template>
  <div class="form-container">
    <el-button type="primary" @click="spellCheck(input)">Submit URL</el-button>
    <el-input v-model="input" placeholder="Please input URL" class="url-input"/>
    <el-button @click="clear()" class="reset-button">Reset</el-button>
  </div>
  <div class="result-container">
    <div v-if="dataweb.body !== ''" class="check-icon">
      <img width="100" height="100" src="/check.png"/>
    </div>
    <div class="result-content">
      <h2>{{ dataweb.header }}</h2>
      <a v-if="dataweb.body !== ''" :href="input + dataweb.body" target="_blank" class="result-link">{{ input }}</a>
    </div>
  </div>
  <div>
    <Table/>
  </div>
</template>



<style scoped>
.form-container {
  display: inline-block;
  margin-bottom: 50px;
}

.url-input {
  width: 400px;
  margin-left: 10px;
}

.reset-button {
  margin-left: 10px;
}

.result-container {
  width: 100%;
  display: flex;
  margin-bottom: 50px;
}

.check-icon {
  margin-right: 20px;
}

.result-content {
  color: aquamarine;
}

.result-link {
  margin-top: 20px;
  color: #00d0ff;
}
</style>