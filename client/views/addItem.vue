<template>
    <el-form>
        <el-form-item>
            <el-checkbox :true-label='true' :false-label="false" v-model='state.enabled'>启用</el-checkbox>
            <el-checkbox :true-label='true' :false-label="false" v-model='state.regexp'>使用正则匹配</el-checkbox>
        </el-form-item>
        <el-form-item label='匹配规则'>
            <el-input v-model='state.matcher'></el-input>
        </el-form-item>
    </el-form>
    <el-button>添加条目</el-button>
</template>
<script setup>
import { reactive } from "@vue/reactivity";

const state=reactive({
    enabled:false,
    regexp:false,
    matcher:''
})
</script>