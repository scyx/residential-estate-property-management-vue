<template>
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>智慧服务</el-breadcrumb-item>
        <el-breadcrumb-item>发布公告</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="member-container" v-if="watching">
      <div>
        <h4 v-if="watching">查询条件</h4>
        <el-divider></el-divider>
        <div class="search-area-main" v-if="watching">
          <el-input
          clearable
            class="common-input"
            size="medium"
            v-model="queryInfo.notice_title"
            placeholder="请输入公告标题"
          ></el-input>
          <el-select
            clearable
            v-model="queryInfo.notice_type"
            filterable
            placeholder="请选择公告类型"
            size="medium"
            class="type-select"
          >
            <el-option v-for="item in noticeTypeList" :key="item.id" :value="item"></el-option>
          </el-select>
          <el-button size="medium" class="search-button" type="primary" @click="getNoticeList">查询</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="member-container">
      <div class="clearfix" v-if="publishing">
        <h4>新公告</h4>
      </div>
      <div class="clearfix" v-if="watching">
        <h3>公告信息</h3>
        <el-button
          type="primary"
          class="selectButton"
          size="medium"
          icon="el-icon-plus"
          @click="toPublish"
        >发布公告</el-button>
      </div>
      <el-divider></el-divider>
      <el-form
        :label-position="right"
        label-width="80px"
        :model="notice"
        :rules="rules"
        ref="addNoticeForm"
        v-if="publishing"
      >
        <el-form-item :label-width="label_width" label="公告标题" prop="title">
          <el-input class="add-notice-input" v-model="notice.title" placeholder="必填，请填写公告标题"></el-input>
        </el-form-item>
        <el-form-item :label-width="label_width" label="公告类型" prop="type">
          <el-select
            class="add-notice-input"
            clearable
            v-model="notice.type"
            filterable
            placeholder="请选择公告类型"
            size="medium"
          >
            <el-option v-for="item in noticeTypeList" :key="item.id" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="label_width" label="公告内容" prop="content">
          <el-input class="add-notice-input" type="textarea" :rows="8" placeholder="请输入内容" v-model="notice.content"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-button @click="toList" >取 消</el-button>
        <el-button type="primary" @click="submitAddForm('addNoticeForm')">提 交</el-button>
      </el-form>
      <el-table
        v-if="watching"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="NoticeList"
        :header-row-style="{'font-size':'13px','color':'black'}"
        :cell-style="{'padding':'5px'}"
        :row-style="{'padding':'0'}"
      >
        <el-table-column align="center" type="index" prop="index" label="#" min-width="100"></el-table-column>
        <el-table-column prop="title" align="center" label="标题" min-width="100"></el-table-column>
        <el-table-column prop="type" align="center" label="公告类型" min-width="200"></el-table-column>
        <el-table-column prop="publish_time" align="center" label="发布时间" min-width="200"></el-table-column>
        <el-table-column align="center" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button size="mini" class="edit-button" @click="toDetail(scope.row.id)">详情</el-button>
            <el-button size="mini" class="edit-button" @click="toEdit(scope.row.id)">修改</el-button>
            <el-button size="mini" class="edit-button" @click="deleteNoticeById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float:right;margin:20px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
	data() {
		return {
			// 公告列表
			NoticeList: [],
			// 查询参数
			queryInfo: {
				notice_title: '',
                notice_type: '',
                // 页数
                pagenum: 1,
				// 每页显示几条
				pagesize: 10
            },
            total: 0,
			// 查询选项
			noticeTypeList: ['业主通知', '员工通知', '小区通知'],
			// 公告列表的页面的控制变量
			watching: true,
			// 正在发布的页面的控制变量
            publishing: false,
            // 详情页
            detail: false,
			// 发布的公告实体
			notice: {},
			// label 宽度
            label_width: '30%',
            rules: {
				title: [{ required: true, message: '请输入公告标题' }],
				type: [{ required: true, message: '请选择公告类型' }],
				content: [{ required: true, message: '请输入公告内容' }],
			}
		};
    },
    created() {
        this.getNoticeList();
    },
	methods: {
        // 去发布页
		toPublish() {
			this.watching = false;
			this.publishing = true;
        },
        // 去列表页
        toList() {
            this.watching = true;
            this.publishing = false;
        },
        // 提交添加公告表单
        submitAddForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					// this.$message.success('chenggongle');
					this.addNotice();
				} else {
					return false;
				}
			});
        },
        // 添加公告
		async addNotice() {
			const { data: res } = await this.$http.post('addNotice', this.notice);
			if (res.code === 200) {
                this.watching = true;
                this.publishing = false;
                this.getNoticeList();
				return this.$message.success(res.msg);
			}
        },
        // 获取公告列表
        async getNoticeList() {
			const { data: res } = await this.$http.get('getNoticeList', {
				params: {
                    notice_title: this.queryInfo.notice_title,
                    notice_type: this.queryInfo.notice_type,
					pageNum: this.queryInfo.pagenum,
					pageSize: this.queryInfo.pagesize
				}
            });
            console.log(res);
			this.NoticeList = res.data.list;
			this.total = res.data.total;
		},
        // 监听pagesize改变
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize;
			this.getHouseHoldList();
		},
		// 监听页码值
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getHouseHoldList();
        },
        toDetail(id) {
            this.$router.push({ path: 'noticeDetail', query: { NoticeId: id } });
        },
        toEdit(id) {
            this.$router.push({ path: 'editNotice', query: { NoticeId: id } });
        },
        deleteNoticeById(id) {
			this.$confirm(
				'此操作将永久删除该公告，不可恢复，是否继续?',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(() => {
					this.delete(id);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
		},
		async delete(id) {
			const { data: res } = await this.$http.delete(
				'deleteNoticeById/' + id
			);
			if (res.code === 200) {
				this.getNoticeList();
				return this.$message.success(res.msg);
			}
			return this.$message.error(res.msg);
		},
    },
};
</script>

<style scoped>
.add-notice-button {
	float: right;
}
h4 {
	text-align: left;
}
.add-notice-input {
	width: 70%;
	float: left;
}
</style>
