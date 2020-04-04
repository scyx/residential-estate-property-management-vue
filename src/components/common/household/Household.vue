<template>
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>业主管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <strong>住户列表</strong>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <div class="search">
            <el-input
              clearable
              placeholder="请输入内容"
              v-model="queryInfo.query"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
        </el-col>
        <!-- 添加业主区域 -->
        <el-col :span="1">
          <el-button type="primary" @click="dialogFormVisible = true">添加住户</el-button>
          <el-dialog
            title="添加业主"
            :visible.sync="dialogFormVisible"
            width="20%"
            @close="closeDialog('addForm','dialogFormVisible')"
          >
            <el-form :model="form" size="small" ref="addForm" :rules="rules">
              <el-form-item label="姓名" prop="household_name" :label-width="formLabelWidth">
                <el-input class="search-input" v-model="form.household_name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="出生日期" prop="birthday" :label-width="formLabelWidth">
                <el-date-picker
                  class="search-input"
                  type="date"
                  placeholder="选择日期"
                  v-model="form.birthday"
                ></el-date-picker>
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
              <el-form-item label="是否业主" prop="is_f" :label-width="formLabelWidth">
                <el-select
                  v-model="form.is_f"
                  prop="is_f"
                  placeholder="请选择"
                  style="width:120px;float:left;"
                >
                  <el-option label="是" value="是"></el-option>
                  <el-option label="否" value="否"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="电话" prop="telephone" :label-width="formLabelWidth">
                <el-input class="search-input" v-model="form.telephone" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="地址" prop="address" :label-width="formLabelWidth">
                <el-input class="search-input" v-model="form.address" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeDialog('addForm','dialogFormVisible')">取 消</el-button>
              <el-button type="success" @click="clearForm('addForm')">清 空</el-button>
              <el-button type="primary" @click="submitForm('addForm')">
                <i class="fa fa-check"></i>保 存
              </el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
      <!-- 业主列表区域 -->
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="tableData"
        border
        stripe
        :header-row-style="{'font-size':'13px','color':'black'}"
        :cell-style="{'padding':'5px'}"
        :row-style="{'padding':'0'}"
      >
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <!-- <el-table-column prop="user_id" align="center" label="#" width="50"></el-table-column> -->
        <el-table-column prop="household_name" align="center" label="姓名" width="100"></el-table-column>
        <el-table-column prop="gender" align="center" label="性别" width="80"></el-table-column>
        <el-table-column prop="age" align="center" label="年龄" width="50"></el-table-column>
        <el-table-column prop="birthday" align="center" label="出生日期" width="150"></el-table-column>
        <el-table-column prop="is_f" align="center" label="是否是业主" width="100"></el-table-column>
        <el-table-column prop="telephone" align="center" label="电话" width="200"></el-table-column>
        <el-table-column prop="address" align="center" label="地址"></el-table-column>
        <el-table-column prop="create_user" align="center" label="创建人"></el-table-column>
        <!-- 操作区 -->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.household_id)"
              ></el-button>
            </el-tooltip>
            <!-- 编辑用户区 -->
            <el-dialog
              title="编辑用户"
              :visible.sync="editDialogVisible"
              width="20%"
              @close="closeDialog('editform','editDialogVisible')"
            >
              <el-form :model="editform" size="small" ref="editform" :rules="rules">
                <el-form-item label="姓名" prop="household_name" :label-width="formLabelWidth">
                  <el-input
                    class="search-input"
                    v-model="editform.household_name"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday" :label-width="formLabelWidth">
                  <el-date-picker
                    :picker-options="pickerOptions0"
                    class="search-input"
                    type="date"
                    placeholder="选择日期"
                    v-model="editform.birthday"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
                  <el-select
                    v-model="editform.gender"
                    prop="gender"
                    placeholder="请选择性别"
                    style="width:120px;float:left;"
                  >
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否业主" prop="is_f" :label-width="formLabelWidth">
                  <el-select
                    v-model="editform.is_f"
                    prop="is_f"
                    placeholder="请选择"
                    style="width:120px;float:left;"
                  >
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="电话" prop="telephone" :label-width="formLabelWidth">
                  <el-input class="search-input" v-model="editform.telephone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address" :label-width="formLabelWidth">
                  <el-input class="search-input" v-model="editform.address" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog('editform','editDialogVisible')">取 消</el-button>
                <el-button type="primary" @click="submitEditForm">提 交</el-button>
              </div>
            </el-dialog>
            <el-tooltip effect="light" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteById(scope.row.household_id)"
              ></el-button>
            </el-tooltip>
            <el-dropdown>
              <el-button>
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>物业费用</el-dropdown-item>
                <el-dropdown-item>停车费用</el-dropdown-item>
                <el-dropdown-item>业主报修</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        style="float:left;margin:20px;"
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
			queryInfo: {
				query: '',
				// 页数
				pagenum: 1,
				// 每页显示几条
				pagesize: 10
			},
			tableData: [],
			// 总数
			total: 0,
			dialogTableVisible: false,
			dialogFormVisible: false,
			editDialogVisible: false,
			form: {
				household_name: '',
				telephone: '',
				address: '',
				gender: '',
				birthday: '',
				is_f: '',
				create_user: this.currentUser
			},
			editform: {},
			editform_copy: {},
			formLabelWidth: '80px',
			pickerOptions0: {
				disabledDate(time) {
					return time.getTime() > Date.now() - 8.64e6; // 如果没有后面的-8.64e6就是不可以选择今天的
				}
			},
			// 添加表单的规则
			rules: {
				household_name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' },
					{
						min: 2,
						max: 8,
						message: '长度在 2 到 6 个字符',
						trigger: 'blur'
					}
				],
				gender: [
					{ required: true, message: '请选择性别', trigger: 'change' }
				],
				telephone: [
					{ required: true, message: '请输入电话号码' },
					{ validator: this.checkTelephone, trigger: 'blur' }
				],
				address: [
					{ required: true, message: '请输入地址', trigger: 'blur' }
				],
				birthday: [
					{
						required: true,
						message: '请选择出生日期',
						trigger: 'blur'
					}
				],
				is_f: [
					{
						required: true,
						message: '请选择是否是业主',
						trigger: 'blur'
					}
				]
            },
            loading: false,
		};
	},
	// 页面加载调用
	created() {
		this.getHouseHoldList();
	},
	methods: {
		// 获取业主列表
		async getHouseHoldList() {
			const { data: res } = await this.$http.get('households', {
				params: {
					query: this.queryInfo.query,
					pageNum: this.queryInfo.pagenum,
					pageSize: this.queryInfo.pagesize
				}
			});
			this.tableData = res.data.list;
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
		// 清空表单
		clearForm(formName) {
			this.$refs[formName].resetFields();
		},
		// 查询
		search() {
			this.getHouseHoldList();
		},
		// 关闭dialog对话框
		closeDialog(formName, visible) {
			this[visible] = false;
			this.clearForm(formName);
		},
		// 提交添加操作
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.addHouseHold();
				} else {
					return false;
				}
			});
		},
		// 添加业主
		async addHouseHold() {
			const { data: res } = await this.$http.post(
				'addHouseHold',
				this.form
			);
			if (res.code === 200) {
				this.closeDialog('addForm', 'dialogFormVisible');
				this.getHouseHoldList();
				return this.$message.success(res.msg);
			}
		},
		// 筛选性别
		filterHandler(value, row, column) {
			const property = column.property;
			return row[property] === value;
		},
		// 打开编辑对话框
		showEditDialog(id) {
			this.editDialogVisible = true;
			this.selectByHouseHoldId(id);
			this.editform_copy = this.editform;
		},
		// 表单验证 通过提交
		submitEditForm() {
			this.$refs.editform.validate(valid => {
				if (valid) {
					this.editHouseHold();
				} else {
					return false;
				}
			});
		},
		// 编辑用户提交
		async editHouseHold() {
			const { data: res } = await this.$http.put(
				'editHouseHold/' + this.editform.household_id,
				this.editform
			);
			console.log(res);
			if (res.code === 200) {
				this.$message.success('修改成功');
				this.editDialogVisible = false;
				this.getHouseHoldList();
			}
		},
		// 删除业主
		deleteById(id) {
			this.$confirm('此操作将永久删除该业主，此操作不可恢复， 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
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
				'deleteHouseHold/' + id
			);
			if (res.code === 200) {
				this.getHouseHoldList();
				return this.$message.success(res.msg);
			}
			return this.$message.error(res.msg);
		},
		to() {
			this.towelcome();
		}
	}
};
</script>

<style scoped>
.search {
	margin-bottom: 20px;
}
.search-input {
	float: left;
	width: 200px;
}
</style>
