<template>
    <el-form>
        <el-form-item>
            <el-checkbox :true-label='true' :false-label="false" v-model='state.enabled'>启用</el-checkbox>
            <el-checkbox :true-label='1' :false-label="0" v-model='state.match_type'>使用正则匹配</el-checkbox>
        </el-form-item>
        <el-form-item label='匹配规则'>
            <el-input v-model='state.matcher'></el-input>
        </el-form-item>
        <el-form-item label='返回类型'>
            <el-radio-group v-model='state.resp_type'>
                <el-radio :label='0'>固定内容</el-radio>
                <el-radio :label='1'>文件</el-radio>
                <el-radio :label='2'>代码生成的内容</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label='返回码'>
            <el-input v-model='state.resp_code'></el-input>
        </el-form-item>
        <el-form-item label='返回内容'>
            <el-input type='textarea' v-model='state.resp_content'></el-input>
        </el-form-item>
    </el-form>
    <el-button @click='doSubmit'>添加条目</el-button>
</template>
<script setup>
import { reactive } from "@vue/reactivity";
import {addItem} from '@/api/add.js';

const state=reactive({
    enabled:false,
    match_type:0,
    matcher:'',
    resp_type:0,
    resp_code:200,
    resp_header:[],
    resp_content:''
})
function doSubmit(){
    addItem({
        ...state,
        resp_header:''
    });
}
</script>