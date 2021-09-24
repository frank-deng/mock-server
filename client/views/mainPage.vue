<template>
    添加新条目了
    匹配方式
    <el-radio-group v-model='state.matchMode'>
        <el-radio :label='0'>完全匹配</el-radio>
        <el-radio :label='1'>正则匹配</el-radio>
    </el-radio-group>
</template>
<script setup>
import { reactive } from "@vue/reactivity";

const state=reactive({
    matchMode:0
});
</script>