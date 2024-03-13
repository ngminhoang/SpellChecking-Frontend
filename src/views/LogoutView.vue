<script setup>

import { ref } from 'vue'
const input = ref('')

</script>


<template>
  <div style="display: inline-block">
    <el-button type="primary">Submit URL</el-button>
    <el-input v-model="input"  placeholder="Please input URL" style="width: 400px; padding-left: 10px"/>
  </div>
  <div>

  </div>

</template>