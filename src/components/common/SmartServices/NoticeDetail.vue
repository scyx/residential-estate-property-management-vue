<template>
  <div>
      <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>智慧服务</el-breadcrumb-item>
        <el-breadcrumb-item>公告详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card>
        <div class="title">
        <h1>{{currentNotice.title}}</h1>
        <div>
            <span class="type">类型：{{currentNotice.type}}</span>
        </div>
        <span class="type"><i class="el-icon-time"></i>{{currentNotice.publish_time}}</span>
        </div>
        <el-divider></el-divider>
        <div class="content">
            {{currentNotice.content}}
        </div>
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
            currentNotice: {},
        };
    },
    created() {
        if (this.$route.query.NoticeId > 0) {
            this.getNoticeById(this.$route.query.NoticeId);
        }
    },
    methods: {
    },
};
</script>

<style scoped>
h1 {
    font-size: 30px;
    color: #888888 !important;
}
.type {
    color: #888888 !important;
}
</style>
