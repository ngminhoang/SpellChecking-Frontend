<template>

  <div class="flex gap-4 mb-4 items-center" style="margin-bottom: 20px">
<!--    <el-switch-->
<!--        v-model="checkOrder"-->
<!--        size="large"-->
<!--        active-text="Default"-->
<!--        inactive-text="DESC"-->
<!--        style="margin-right: 30px"-->
<!--    />-->
    <label style="margin-right: 20px">Soft:</label>
    <el-radio-group v-model="radio"  style="margin-right: 30px">
      <el-radio :label="3">Date</el-radio>
      <el-radio :label="6">Title</el-radio>
      <el-radio :label="9">Link</el-radio>
    </el-radio-group>
    <el-input
        v-model="input"
        style="width: 500px"
        size="large"
        placeholder="Search"
        :suffix-icon="Search"
    />

  </div>
  <el-table :data="tableData" style="width: 100%" max-height="500">
    <el-table-column  prop="date" label="Date" width="160" />
    <el-table-column prop="title" label="Title" width="500"></el-table-column>
    <el-table-column prop="link" label="Link" width="1000"><template #default="{ row }">
      <a :href="row.link+row.param" target="_blank">{{ row.link }}</a>
    </template></el-table-column>
    <el-table-column prop="id" label="ID" width="0" :hidden="true"></el-table-column>
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default="scope">
        <el-button
            link
            type="primary"
            size="small"
            @click.prevent="deleteRow(scope.$index, scope.row.id)"
            style="color: #f33636;"
        >
          Remove
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="demo-pagination-block" style="display: flex; flex-direction: column; align-items: center; margin-top: 20px">
    <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="100"
        :small="small"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:total="totalPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  deleteHistory,
  fetchPageCount,
  fetchPageCountBySearch,
  fetchPaginatedHistory,
  fetchPaginatedHistoryBySearch
} from "@/api/API";
import { Search } from '@element-plus/icons-vue'

const currentPage4 = ref(1);
const totalPage = ref(null);
const pageSize4 = ref(10);
const tableData = ref([]);

const checkOrder = ref(true);

const input = ref('')

const radio = ref(3)

onMounted(async () => {
  try {
    const data = await fetchPaginatedHistory(pageSize4.value,currentPage4.value-1,radio.value);
    tableData.value = data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

onMounted(async () => {
  try {
    const data = await fetchPageCount(pageSize4.value);
    totalPage.value= data*pageSize4.value;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const deleteRow = async (index: number, id:number) => {
  try {
    ElMessageBox.confirm(
        'Do you really want to delete this row?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
    )
        .then( async () => {
          ElMessage({
            type: 'success',
            message: 'Delete completed',
          });
          const data = await deleteHistory(id);
          tableData.value.splice(index, 1);
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Delete canceled',
          })
        })
  } catch (error) {
    console.error('Error fetching data:', error);
  }

}

const handleSizeChange = async (val: number) => {
  if(input.value==null|| input.value==''){
    try {
      currentPage4.value = 1;
      const data = await fetchPaginatedHistory(pageSize4.value, currentPage4.value - 1,radio.value);
      tableData.value = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    try {
      const data = await fetchPageCount(pageSize4.value);
      totalPage.value = data * pageSize4.value;
      console.log(totalPage.value);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }
  else {
    try {
      currentPage4.value = 1;
      const data = await fetchPaginatedHistoryBySearch(input.value,pageSize4.value, currentPage4.value - 1,radio.value);
      tableData.value = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    try {
      const data = await fetchPageCountBySearch(input.value,pageSize4.value);
      totalPage.value = data * pageSize4.value;
      console.log(totalPage.value);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}

const handleCurrentChange = async (val: number) => {
  currentPage4.value = val;
  if(input.value==null|| input.value=='') {
    try {
      const data = await fetchPaginatedHistory(pageSize4.value, currentPage4.value - 1, radio.value);
      tableData.value = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  else{
    try {
      const data = await fetchPaginatedHistoryBySearch(input.value, pageSize4.value, currentPage4.value - 1, radio.value);
      tableData.value = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}

watch(radio, async (currentValue, oldValue) => {
  if(input.value==null|| input.value==''){
    try {
      currentPage4.value = 1;
      const data = await fetchPaginatedHistory(pageSize4.value, currentPage4.value - 1, radio.value);
      tableData.value = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    try {
      const data = await fetchPageCount(pageSize4.value);
      totalPage.value = data * pageSize4.value;
      console.log(totalPage.value);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }
  else {
    try {
      currentPage4.value = 1;
      const data = await fetchPaginatedHistoryBySearch(input.value,pageSize4.value, currentPage4.value - 1, radio.value);
      tableData.value = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    try {
      const data = await fetchPageCountBySearch(input.value,pageSize4.value);
      totalPage.value = data * pageSize4.value;
      console.log(totalPage.value);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
});

watch(input, async (currentValue, oldValue) => {
  if(input.value==null|| input.value==''){
  try {
    currentPage4.value = 1;
    const data = await fetchPaginatedHistory(pageSize4.value, currentPage4.value - 1, radio.value);
    tableData.value = data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  try {
    const data = await fetchPageCount(pageSize4.value);
    totalPage.value = data * pageSize4.value;
    console.log(totalPage.value);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

}
else {
    try {
      currentPage4.value = 1;
      const data = await fetchPaginatedHistoryBySearch(input.value,pageSize4.value, currentPage4.value - 1, radio.value);
      tableData.value = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    try {
      const data = await fetchPageCountBySearch(input.value,pageSize4.value);
      totalPage.value = data * pageSize4.value;
      console.log(totalPage.value);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    try {
      currentPage4.value = 1;
      const data = await fetchPaginatedHistoryBySearch(input.value,pageSize4.value, currentPage4.value - 1, radio.value);
      tableData.value = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    try {
      const data = await fetchPageCountBySearch(input.value,pageSize4.value);
      totalPage.value = data * pageSize4.value;
      console.log(totalPage.value);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }
});


</script>


<style scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>