<template>
  <div>
      <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }"><a @click="to">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  methods: {
    to() {
      this.towelcome();
    },
  }
};
</script>

<style>

</style>
