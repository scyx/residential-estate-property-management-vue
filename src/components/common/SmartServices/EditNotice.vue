<template>
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>智慧服务</el-breadcrumb-item>
        <el-breadcrumb-item>修改公告</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card>
        <el-form
        :label-position="right"
        label-width="80px"
        :model="currentNotice"
        :rules="rules"
        ref="editNoticeForm"
      >
        <el-form-item :label-width="label_width" label="公告标题" prop="title">
          <el-input class="add-notice-input" v-model="currentNotice.title" placeholder="必填，请填写公告标题"></el-input>
        </el-form-item>
        <el-form-item :label-width="label_width" label="公告类型" prop="type">
          <el-select
            class="add-notice-input"
            clearable
            v-model="currentNotice.type"
            filterable
            placeholder="请选择公告类型"
            size="medium"
          >
            <el-option v-for="item in notice_type_List" :key="item.id" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="label_width" label="公告内容" prop="content">
          <el-input class="add-notice-input" type="textarea" :rows="8" placeholder="请输入内容" v-model="currentNotice.content"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-button @click="toList" >取 消</el-button>
        <el-button type="primary" @click="submitEditForm('editNoticeForm')">提 交</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
	data() {
		return {
            // label 宽度
            label_width: '30%',
            currentNotice: {},
            rules: {
				title: [{ required: true, message: '请输入公告标题' }],
				type: [{ required: true, message: '请选择公告类型' }],
				content: [{ required: true, message: '请输入公告内容' }],
            },
            notice_type_List: ['业主通知', '员工通知', '小区通知'],
        };
	},
	created() {
        if (this.$route.query.NoticeId > 0) {
            this.getNoticeById(this.$route.query.NoticeId);
        }
    },
	methods: {
        // 回公告列表页
        toList() {
            this.$router.push({ path: 'notice' });
        },
         // 提交添加公告表单
        submitEditForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					// this.$message.success('chenggongle');
					this.editNotice();
				} else {
					return false;
				}
			});
        },
        async editNotice() {
            const { data: res } = await this.$http.put(
				'editNotice',
				this.currentNotice
			);
			console.log(res);
			if (res.code === 200) {
				this.$message.success('修改成功');
				this.editDialogVisible = false;
				this.toList();
			}
        }
    }
};
</script>

<style>
.add-notice-input {
	width: 70%;
	float: left;
}
</style>
