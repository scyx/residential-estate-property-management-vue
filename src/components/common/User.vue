<template>
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <strong>用户列表</strong>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card>
      <div class="clearfix">
        <h3>用户信息</h3>
        <el-button
          type="primary"
          class="selectButton"
          size="medium"
          icon="el-icon-plus"
          @click="openAddDialog"
        >添加用户</el-button>
      </div>
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        :width="dialog_width"
        @close="closeDialog('addForm','dialogFormVisible')"
      >
        <el-form :model="form" size="small" ref="addForm" :rules="addrules">
          <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
            <el-input class="add-input" show-password v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
            <el-select
              v-model="form.gender"
              prop="gender"
              placeholder="请选择性别"
              style="width:120px;float:left;"
            >
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="telephone" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="form.telephone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog('addForm','addDialogVisible')">取 消</el-button>
          <el-button type="success" @click="clearForm('addForm')">清 空</el-button>
          <el-button type="primary" @click="submitForm('addForm')">
            <i class="fa fa-check"></i>保 存
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        :width="dialog_width"
        @close="closeDialog('addForm','editDialogVisible')"
      >
        <el-form :model="editForm" size="small" ref="editForm" :rules="editrules">
          <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
            <el-input disabled class="add-input" v-model="editForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="editForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
            <el-select
              v-model="editForm.gender"
              prop="gender"
              placeholder="请选择性别"
              style="width:120px;float:left;"
            >
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="telephone" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="editForm.telephone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog('editForm','editDialogVisible')">取 消</el-button>
          <el-button type="success" @click="clearForm('editForm')">清 空</el-button>
          <el-button type="primary" @click="submitEditForm()">
            <i class="fa fa-check"></i>保 存
          </el-button>
        </div>
      </el-dialog>
      <el-divider></el-divider>
      <el-table
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="UserList"
        :header-row-style="{'font-size':'13px','color':'black'}"
        :cell-style="{'padding':'5px'}"
        :row-style="{'padding':'0'}"
      >
        <el-table-column align="center" type="index" prop="index" label="#" width="100"></el-table-column>
        <el-table-column prop="username" align="center" label="用户名" min-width="150"></el-table-column>
        <el-table-column prop="password" type="password" align="center" label="密码" width="150">
          <template slot-scope>******</template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="姓名" width="200"></el-table-column>
        <el-table-column prop="gender" align="center" label="性别" width="100"></el-table-column>
        <el-table-column prop="telephone" align="center" label="手机" width="200"></el-table-column>
        <el-table-column align="center" label="操作" min-width="300">
          <template slot-scope="scope">
            <el-button size="mini" class="edit-button" @click="reset(scope.row.id)">重置密码</el-button>
            <el-button size="mini" class="edit-button" @click="showEditDialog(scope.row.id)">修改信息</el-button>
            <el-button size="mini" class="edit-button" @click="deleteById(scope.row.id)">删除用户</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
	data() {
		const validUserName = (rule, value, callback) => {
			this.checkUserNameisExist(value);
			if (this.userNameisExist === true) {
				callback(new Error('用户名已经存在'));
			} else {
				callback();
			}
		};
		return {
			addDialogVisible: false,
			editDialogVisible: false,
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 10
			},
			UserList: [],
			total: 0,
			dialog_width: '350px',
			formLabelWidth: '80px',
			form: {},
			editForm: {},
			userNameisExist: false,
			editrules: {
				username: [
					{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}
				],
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				],
				gender: [
					{ required: true, message: '请选择性别', trigger: 'change' }
				],
				telephone: [
					{ required: true, message: '请输入电话号码' },
					{ validator: this.checkTelephone, trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
			},
			addrules: {
				username: [
					{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					},
					{ validator: validUserName }
				],
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				],
				gender: [
					{ required: true, message: '请选择性别', trigger: 'change' }
				],
				telephone: [
					{ required: true, message: '请输入电话号码' },
					{ validator: this.checkTelephone, trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
			}
		};
	},
	created() {
		this.getUserList();
	},
	methods: {
		async checkUserNameisExist(username) {
			const { data: res } = await this.$http.get('checkUserNameisExist', {
				params: {
					userName: this.form.username
				}
			});
			if (res.code === 200) {
				this.userNameisExist = false;
			} else {
				this.userNameisExist = true;
			}
		},
		// 打开编辑对话框
		showEditDialog(id) {
			this.editDialogVisible = true;
			this.selectByUserId(id);
		},
		// 表单验证 通过提交
		submitEditForm() {
			this.$refs.editForm.validate(valid => {
				if (valid) {
					this.editUser();
				} else {
					return false;
				}
			});
		},
		// 编辑用户提交
		async editUser() {
			const { data: res } = await this.$http.put(
				'editUser',
				this.editForm
			);
			console.log(res);
			if (res.code === 200) {
				this.$message.success('修改成功');
				this.editDialogVisible = false;
				this.getUserList();
			}
		},
		async selectByUserId(id) {
			const { data: res } = await this.$http.get('getUserById/' + id);
			console.log(res);
			if (res.code === 200) {
				this.editForm = res.data;
			}
		},

		// 删除用户
		deleteById(id) {
			this.$confirm(
				'此操作将永久删除该用户，不可恢复， 是否继续?',
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
				'deleteUserById/' + id
			);
			if (res.code === 200) {
				this.getUserList();
				return this.$message.success(res.msg);
			}
			return this.$message.error(res.msg);
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.addUser();
				} else {
					return false;
				}
			});
		},
		// 添加业主
		async addUser() {
			const { data: res } = await this.$http.post('addUser', this.form);
			if (res.code === 200) {
				this.closeDialog('addForm', 'addDialogVisible');
				this.getUserList();
				return this.$message.success(res.msg);
			}
		},
		openAddDialog() {
			this.addDialogVisible = true;
		},
		async getUserList() {
			const { data: res } = await this.$http.get('getUserList', {
				params: {
					query: this.queryInfo.query,
					pageNum: this.queryInfo.pagenum,
					pageSize: this.queryInfo.pagesize
				}
			});
			this.UserList = res.data.list;
			this.total = res.data.total;
		},
		reset(id) {
			this.$confirm('此操作将重置该用户的密码，是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.resetPasswordByUserId(id);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
		},
		async resetPasswordByUserId(id) {
			const { data: res } = await this.$http.put(
				'resetPasswordByUserId/' + id
			);
			if (res.code === 200) {
				this.$message.success('重置成功!');
				this.getUserList();
			}
		}
	}
};
</script>

<style>
</style>
