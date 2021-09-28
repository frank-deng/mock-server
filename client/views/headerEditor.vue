<template>
    <el-table size='mini' :data='props.modelValue'>
        <el-table-column label='Header'>
            <template #default='{row}'>
                <el-input v-model='row.key'></el-input>
            </template>
        </el-table-column>
        <el-table-column label='Value'>
            <template #default='{row}'>
                <el-input v-model='row.value'></el-input>
            </template>
        </el-table-column>
        <el-table-column :width='80'>
            <template #header>
                <el-link type='primary' @click='addItem'>添加</el-link>
            </template>
            <template #default={row,$index}>
                <el-link type='danger' @click='deleteItem(row,$index)'>删除</el-link>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup>
const props=defineProps({
    modelValue:{
        type:Array,
        default:()=>[]
    }
});
const $emit=defineEmits(["input"]);
function addItem(){
    props.modelValue.push({
        key:'',
        value:''
    });
    $emit('update:modelValue',props.modelValue);
}
function deleteItem(row,index){
    props.modelValue.splice(index,1);
    $emit('update:modelValue',props.modelValue);
}
</script>
