<template>
  <div class="common-layout">
    <table>
      <tr>
        <td style="width: 100px"><h3>Name: </h3></td>
        <td><h3 class="highlight">{{ account.name }}</h3></td>
      </tr>
      <tr>
        <td style="width: 100px"><h3>Mail: </h3></td>
        <td><h3 class="highlight">{{ account.mail }}</h3></td>
      </tr>
    </table>
  </div>

  <el-button plain style="margin-top: 10px" @click="dialogVisible = true">
    Edit
  </el-button>

  <el-dialog
      v-model="dialogVisible"
      title="Edit Account"
      width="500"
      :before-close="handleClose"
  >
    <span>
      <el-input placeholder="new name" v-model="name"/>
      <!--      <el-input placeholder="new mail" v-model="mail"/>-->
      <el-input placeholder="new password" v-model="pass"/>
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="UpdateAccount(name,mail,pass)">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script lang="ts" setup>
import {ref} from 'vue'
import {useAccountStore} from "@/stores/account";
import {ElMessageBox} from 'element-plus'
import {updateAccount} from "@/api/API";

const dialogVisible = ref(false)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
      .then(() => {
        done()
      })
}


const account = useAccountStore();
const mail = ref(account.mail);
const name = ref('');
const pass = ref('');

const UpdateAccount = (name: any, mail: any, pass: any) => {
  updateAccount(name, mail, pass);
  dialogVisible.value = false
}
</script>


<style scoped>
.common-layout {
  margin: 20px;
}

table {
  width: 100%;
}

td {
  vertical-align: top;
}

.highlight {
  color: #9cffdb;
}
</style>