<template>
  <el-form
      label-position="left"
      style="max-width: 460px"
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
  >

    <el-form-item label="Mail" prop="mail">
      <el-input v-model="ruleForm.mail"/>
    </el-form-item>
    <el-form-item label="Password" prop="pass">
      <el-input v-model="ruleForm.pass" type="password"/>
    </el-form-item>


    <el-form-item>
      <el-button type="primary" @click=" login(ruleForm.mail,ruleForm.pass)"
      >Login
      </el-button
      >
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {useAccountStore} from "@/stores/account";
import router from '@/router';
import {login} from "@/api/API";

const account = useAccountStore();
const ruleFormRef = ref<FormInstance>()


const checkMail = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the email'));
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return callback(new Error('Please input a valid email'));
    } else {
      callback();
    }
  }
}

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (ruleForm.checkPass != '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}

const ruleForm = reactive({
  pass: '',
  mail: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  pass: [{validator: validatePass, trigger: 'blur'}],
  mail: [{validator: checkMail, trigger: 'blur'}],
})


const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>