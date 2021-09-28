<template>
    <el-table :data='tableData.data' size='mini'>
        <el-table-column prop='matcher' label='匹配规则'></el-table-column>
        <el-table-column :width='100' prop='match_type' label='正则匹配' align='center'>
            <template #default='{row}'>{{row.match_type ? '是' : '否'}}</template>
        </el-table-column>
        <el-table-column :width='100' prop='enabled' label='是否启用' align='center'>
            <template #default='{row}'>
                <el-checkbox v-model='row.enabled' :true-label="true" :false-label="false" @change='doUpdateEnabled(row)'></el-checkbox>
            </template>
        </el-table-column>
        <el-table-column :width='100' align='center'>
            <template #header>
                <el-link type='primary' @click='doAddItem()'>添加</el-link>
            </template>
            <template #default='{row}'>
                <el-link type='primary' @click='doEditItem(row)'>编辑</el-link>&nbsp;
                <el-link type='danger' @click='doDeleteItem(row.id)'>删除</el-link>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next"
        :total="tableData.total"
        @current-change="pageNumChange"
        @size-change="pageSizeChange"></el-pagination>
    <itemDetail :ref='$refs.itemDetail'></itemDetail>
</template>
<script setup>
import { ElMessageBox,ElMessage } from 'element-plus';
import { reactive, ref } from "@vue/reactivity";
import {queryItem,deleteItem,updateItemEnabled} from '@/api/main.js';
import itemDetail from './itemDetail.vue';

const $refs={
    itemDetail:ref(null)
};

const tableData=reactive({
    data:[],
    total:0,
    pageNum:0,
    pageSize:10
});
function pageNumChange(pageNum){
    tableData.pageNum=pageNum;
    query();
}
function pageSizeChange(pageSize){
    tableData.pageSize=pageSize;
    query();
}
async function query(){
    let resp=await queryItem(tableData.pageNum,tableData.pageSize);
    Object.assign(tableData,{
        data:resp.data.data,
        total:resp.data.total
    });
}
async function doEditItem(data){
    try{
        await $refs.itemDetail.value.open(data);
        await query();
    }catch(e){
        if('cancel'===e){
            return;
        }
        console.error(e);
    }
}
async function doAddItem(){
    try{
        await $refs.itemDetail.value.open();
        await query();
    }catch(e){
        if('cancel'===e){
            return;
        }
        console.error(e);
    }
}
async function doDeleteItem(id){
    try{
        await ElMessageBox.confirm('是否删除此条目', '提示');
        let resp=deleteItem(id);
        if(0!=Number(resp.data.code)){
            ElMessage.error(resp.data.message);
        }
        ElMessage.success('删除条目成功');
        await query();
    }catch(e){
        if('cancel'===e){
            return;
        }
        console.error(e);
    }
}
async function doUpdateEnabled(row){
    try{
        let resp=await updateItemEnabled(row.id,row.enabled);
        if(0!=resp.data.code){
            ElMessage.error(resp.data.message);
            query();
        }
    }catch(e){
        console.error(e);
        query();
    }
}
query();
</script>
