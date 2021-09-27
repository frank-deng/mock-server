<template>
    <el-dialog v-model='controller.display'>
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
        <template #footer>
            <el-button v-if='controller.editMode' @click='doSubmit'>更新条目</el-button>
            <el-button v-else @click='doSubmit'>添加条目</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ElMessageBox,ElMessage } from 'element-plus';
import { computed, reactive } from "@vue/reactivity";
import {addItem,updateItem} from '@/api/main.js';
import { watch } from '@vue/runtime-core';

const controller=reactive({
    resolve:null,
    reject:null,
    display:false,
    editMode:computed(()=>{
        return state.id ? true : false
    })
});
const state=reactive({
    id:null,
    enabled:false,
    match_type:0,
    matcher:'',
    resp_type:0,
    resp_code:200,
    resp_header:[],
    resp_content:''
});
watch(()=>controller.display,(display)=>{
    if(display){
        return;
    }
    if(controller.resolve&&controller.reject){
        controller.reject('cancel');
    }
    Object.assign(controller,{
        resolve:null,
        reject:null
    });
});
function open(data={}){
    return new Promise((resolve,reject)=>{
        Object.assign(state,{
            id:null,
            enabled:false,
            match_type:0,
            matcher:'',
            resp_type:0,
            resp_code:200,
            resp_header:[],
            resp_content:''
        },data||{});
        Object.assign(controller,{
            resolve,
            reject,
            display:true
        });
    });
}
async function doSubmit(){
    let resp=null;
    if(controller.editMode){
        resp=await updateItem({
            ...state,
            resp_header:''
        });
    }else{
        resp=await addItem({
            ...state,
            resp_header:''
        });
    }
    if(0!=Number(resp.data.code)){
        ElMessage.error(resp.data.message);
        return;
    }
    if(controller.resolve){
        controller.resolve();
    }
    Object.assign(controller,{
        resolve:null,
        reject:null,
        display:false
    });
}
defineExpose({
    open
});
</script>