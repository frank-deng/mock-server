<template>
    <el-table :data='tableData.data'>
        <el-table-column prop='matcher' label='匹配规则'></el-table-column>
        <el-table-column prop='match_type' label='正则匹配'></el-table-column>
        <el-table-column prop='enabled' label='是否启用'></el-table-column>
        <el-table-column label='操作'>
            <template #default='{row}'>
                <el-button>编辑</el-button>
                <el-button @click='doDeleteItem(row.id)'>删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup>
import { ElMessageBox,ElMessage } from 'element-plus';
import { reactive } from "@vue/reactivity";
import {queryItem,deleteItem} from '@/api/main.js';

const tableData=reactive({
    data:[],
    total:0,
    pageNum:0,
    pageSize:10
});
async function query(){
    let resp=await queryItem(tableData.pageNum,tableData.pageSize);
    Object.assign(tableData,{
        data:resp.data.data,
        total:resp.data.total
    });
}
async function doDeleteItem(id){
    try{
        await ElMessageBox.confirm('是否删除此条目', '提示');
        let resp=deleteItem(id);
        if(0!=Number(resp.code)){
            ElMessage.error(resp.message);
        }
        ElMessage.success('删除条目成功');
        query();
    }catch(e){
        if('cancel'===e){
            return;
        }
        console.error(e);
    }
}
query();
</script>
