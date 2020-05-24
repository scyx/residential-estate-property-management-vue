<template>
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>智慧服务</el-breadcrumb-item>
        <el-breadcrumb-item>投诉建议</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="member-container">
      <div>
        <h4>查询条件</h4>
        <el-divider></el-divider>
        <div class="search-area-main">
          <el-input
            clearable
            class="common-input"
            size="medium"
            v-model="queryInfo.complaint_person"
            placeholder="请输入投诉人"
          ></el-input>
          <el-select
            clearable
            v-model="queryInfo.complaint_type"
            filterable
            placeholder="请选择投诉类型"
            size="medium"
            class="type-select"
          >
            <el-option v-for="item in typeList" :key="item.id" :value="item"></el-option>
          </el-select>
          <el-button
            size="medium"
            class="search-button"
            type="primary"
            @click="getComplaintAndAdviceList"
          >查询</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="member-container">
      <div class="clearfix">
        <h3>投诉或建议信息</h3>
        <el-button
          type="primary"
          class="selectButton"
          size="medium"
          icon="el-icon-plus"
          @click="toAdd"
        >添加</el-button>
      </div>
      <el-divider></el-divider>
      <el-table
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="ComplaintAndAdviceList"
        :header-row-style="{'font-size':'13px','color':'black'}"
        :cell-style="{'padding':'5px'}"
        :row-style="{'padding':'0'}"
      >
        <el-table-column align="center" type="index" prop="index" label="#" width="100"></el-table-column>
        <el-table-column prop="type" align="center" label="投诉类型" width="80"></el-table-column>
        <el-table-column prop="house_name,unit_id,room_id" align="center" label="房屋" width="200">
          <template
            slot-scope="scope"
          >{{scope.row.house_name}}{{scope.row.unit_id}}单元{{scope.row.room_id}}</template>
        </el-table-column>
        <el-table-column prop="person" align="center" label="投诉人" width="100"></el-table-column>
        <el-table-column prop="telephone" align="center" label="投诉电话" width="150"></el-table-column>
        <el-table-column prop="create_date" align="center" label="时间" width="180"></el-table-column>
        <el-table-column prop="status" align="center" label="投诉状态" width="150"></el-table-column>
        <el-table-column align="center" label="操作" min-width="250">
          <template slot-scope="scope">
            <el-button size="mini" class="edit-button" @click="showContentDrawer(scope.row.id)">详情内容</el-button>
            <el-button size="mini" class="edit-button" @click="showEditDialog(scope.row.id)">修改</el-button>
            <el-button size="mini" class="edit-button" @click="deleteComplaintById(scope.row.id)">删除</el-button>
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
      <el-drawer :visible.sync="drawerVisiable" :direction="direction" title :with-header="false">
        <div class="drawer-span">{{complaint.content}}</div>
      </el-drawer>
      <el-dialog
        title="修改信息"
        :visible.sync="editDialogVisible"
        width="20%"
        @close="closeDialog('complaint','editDialogVisible')"
      >
        <el-form :model="complaint" :rules="rules" ref="complaint">
          <el-form-item :label-width="label_width" label="投诉人" prop="person">
            <el-input class="add-input" v-model="complaint.person" placeholder="必填，请填写投诉人"></el-input>
          </el-form-item>
          <el-form-item :label-width="label_width" label="投诉人电话" prop="telephone">
            <el-input class="add-input" v-model="complaint.telephone" placeholder="必填，请填写投诉人电话"></el-input>
          </el-form-item>
          <el-form-item :label-width="label_width" label="类型" prop="type">
            <el-select class="add-input" v-model="complaint.type" placeholder="必填，请选择类型">
              <el-option label="投诉" value="投诉"></el-option>
              <el-option label="建议" value="建议"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label-width="label_width" label="投诉内容" prop="content">
            <el-input
            autosize
              class="add-input"
              type="textarea"
              v-model="complaint.content"
              placeholder="必填，请填写投诉内容"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog('editform','editDialogVisible')">取 消</el-button>
          <el-button type="primary" @click="submitEditForm">提 交</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
	data() {
		return {
			// 查询条件的实体
			queryInfo: {
				complaint_person: '',
				complaint_type: '',
				pagenum: 1,
				pagesize: 10
			},
			drawerVisiable: false,
			direction: 'rtl',
			total: 0,
			label_width: '100px',
			// option 的数组
			typeList: ['投诉', '建议'],
			ComplaintAndAdviceList: [],
			complaint: {},
			editDialogVisible: false,
            dialog_width: '350px',
			rules: {
				person: [
					{ required: true, trigger: 'blur', message: '请输入投诉人' }
				],
				telephone: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入投诉电话'
                    },
                     { validator: this.checkTelephone, trigger: 'blur' }
				],
				type: [
					{
						required: true,
						trigger: 'blur',
						message: '请选择投诉类型'
					}
				],
				content: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入投诉内容'
					}
				]
			}
		};
	},
	created() {
		this.getComplaintAndAdviceList();
	},
	methods: {
        submitEditForm() {
			this.$refs.complaint.validate(valid => {
				if (valid) {
					this.saveComplaintAndAdvice();
				} else {
					return false;
				}
			});
        },
        async saveComplaintAndAdvice() {
			const { data: res } = await this.$http.put(
				'saveComplaintAndAdvice',
				this.complaint
			);
			console.log(res);
			if (res.code === 200) {
				this.$message.success('修改成功');
				this.editDialogVisible = false;
				this.getComplaintAndAdviceList();
			}
		},
		showEditDialog(id) {
			this.editDialogVisible = true;
			this.getComplaintById(id);
		},
		async getComplaintAndAdviceList() {
			const { data: res } = await this.$http.get(
				'getComplaintAndAdviceList',
				{
					params: {
						complaint_person: this.queryInfo.complaint_person,
						complaint_type: this.queryInfo.complaint_type,
						pageNum: this.queryInfo.pagenum,
						pageSize: this.queryInfo.pagesize
					}
				}
			);
			this.ComplaintAndAdviceList = res.data.list;
			this.total = res.data.total;
		},
		toAdd() {
			this.$router.push('/AddComplaintAndAdvice');
		},
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize;
			this.getComplaintAndAdviceList();
		},
		// 监听页码值
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getComplaintAndAdviceList();
		},
		deleteComplaintById(id) {
			this.$confirm(
				'此操作将永久删除该投诉或建议，不可恢复，是否继续?',
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
		showContentDrawer(id) {
			this.drawerVisiable = true;
			this.getComplaintById(id);
		},
		async delete(id) {
			const { data: res } = await this.$http.delete(
				'deleteComplaintById/' + id
			);
			if (res.code === 200) {
				this.getComplaintAndAdviceList();
				return this.$message.success(res.msg);
			}
			return this.$message.error(res.msg);
		},
		async getComplaintById(id) {
			const { data: res } = await this.$http.get(
				'getComplaintById/' + id
			);
			if (res.code === 200) {
				this.complaint = res.data;
			}
		}
	}
};
</script>

<style scoped>
h4 {
	text-align: left;
}
.drawer-span {
	word-wrap: break-word;
    word-break: break-all;
    margin: 50% auto;
	width: 350px;
	white-space: pre-wrap;
}
</style>
