
<template>

  <div class="flex gap-4 mb-4 items-center" style="margin-bottom: 20px">
    <label style="margin-right: 20px">Soft:</label>
    <el-radio-group @input="fetchSearch" v-model="radio" style="margin-right: 30px">
      <el-radio :label="dateSort">Date</el-radio>
      <el-radio :label="titleSort">Title</el-radio>
      <el-radio :label="linkSort">Link</el-radio>
    </el-radio-group>
    <el-input
        v-model="input"
        style="width: 500px"
        size="large"
        placeholder="Search"
        :suffix-icon="Search"
        @input="fetchDoubleSearch"
    />

  </div>
  <el-table :data="tableData" style="width: 100%" max-height="500">
    <el-table-column prop="createdDate" label="Date" width="160"/>
    <el-table-column prop="title" label="Title" width="500"></el-table-column>
    <el-table-column prop="link" label="Link" width="1000">
      <template #default="{ row }">
        <a :href="row.link+row.param" target="_blank">{{ row.link }}</a>
      </template>
    </el-table-column>
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
  <div class="demo-pagination-block"
       style="display: flex; flex-direction: column; align-items: center; margin-top: 20px">
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
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
import {onMounted, ref} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus'
import {
  deleteHistory,
  fetchPaginatedHistoryBySearch
} from "@/api/API";
import {Search} from '@element-plus/icons-vue'
import {dateSort, titleSort, linkSort} from "@/api/APIUrl";

const currentPage = ref(1);
const totalPage = ref(10);
const pageSize = ref(10);
const tableData = ref([]);


const input = ref('')

const radio = ref(3)

onMounted(async () => {
  await fetchSearch();
});


const deleteRow = async (index: number, id: number) => {
  ElMessageBox.confirm(
      'Do you really want to delete this row?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
  )
      .then(async () => {
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

}


const fetchSearch = async () => {
  currentPage.value = 1;
  fetchPage();
}

const fetchPage = async () => {
  const data = await fetchPaginatedHistoryBySearch(input.value, pageSize.value, currentPage.value - 1, radio.value);
  tableData.value = data.histories;
  totalPage.value = data.totalPage * pageSize.value;
}

const fetchDoubleSearch = async () => {
  await fetchSearch();
  await fetchSearch();
}


const handleSizeChange = async (val: number) => {
  pageSize.value = val;
  await fetchSearch();
}

const handleCurrentChange = async (val: number) => {
  currentPage.value = val;
  await fetchPage();
}

// watch(radio, async (currentValue, oldValue) => {
//   await fetchSearch();
// });

// watch(input, async (currentValue, oldValue) => {
//   await fetchSearch();
// });


</script>


<style scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>