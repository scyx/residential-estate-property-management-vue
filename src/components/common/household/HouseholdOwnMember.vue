<template>
<!-- 业主管理页面 -->
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>业主管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <strong>业主成员</strong>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <h3>业主信息</h3>
        <div>
          <el-button
            type="primary"
            class="selectButton"
            size="medium"
            @click="openSelectDialog"
            icon="el-icon-search"
          >选择业主</el-button>
          <el-button
            v-if="is_select"
            type="primary"
            class="selectButton"
            size="medium"
            @click="addDialogFormVisible = true"
            icon="el-icon-plus"
          >添加成员</el-button>
        </div>
        <!-- 选择业主对话框 -->
        <el-dialog
          title="选择业主"
          :visible.sync="dialogVisible"
          width="60%"
          @close="dialogVisible=false"
        >
        <el-divider></el-divider>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="search-input">
            <el-button slot="append" @click="search">查询</el-button>
          </el-input>
          <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="houseHoldList"
            :header-row-style="{'font-size':'13px','color':'black'}"
            :cell-style="{'padding':'5px'}"
            :row-style="{'padding':'0'}"
          >
            <el-table-column align="center" type="index" prop="index" label="#"></el-table-column>
            <!-- <el-table-column prop="user_id" align="center" label="#" width="50"></el-table-column> -->
            <el-table-column prop="household_name" align="center" label="姓名" width="100"></el-table-column>
            <el-table-column prop="gender" align="center" label="性别" width="80"></el-table-column>
            <el-table-column prop="age" align="center" label="年龄" width="50"></el-table-column>
            <el-table-column prop="telephone" align="center" label="电话" width="150"></el-table-column>
            <el-table-column prop="address" align="center" label="地址" min-width="200"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  class="selectButton"
                  @click="chooseHouseHold(scope.row.household_id)"
                >选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            small
            layout="total,prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
            :current-page.sync="queryInfo.pagenum"
            :page-size="10"
          ></el-pagination>
          <span slot="footer" class="dialog-footer"></span>
        </el-dialog>
        <!-- 添加成员对话框 -->
        <el-dialog
          title="添加成员"
          :visible.sync="addDialogFormVisible"
          width="20%"
          @close="closeDialog('addForm','addDialogFormVisible')"
        >
          <el-form :model="addForm" size="small" ref="addForm" :rules="rules">
            <el-form-item label="姓名" prop="household_name" :label-width="formLabelWidth">
              <el-input class="add-input" v-model="addForm.household_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday" :label-width="formLabelWidth">
              <el-date-picker
                :picker-options="pickerOptions0"
                class="add-input"
                type="date"
                placeholder="选择日期"
                v-model="addForm.birthday"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
              <el-select
                v-model="addForm.gender"
                prop="gender"
                placeholder="请选择性别"
                style="width:120px;float:left;"
              >
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号" prop="telephone" :label-width="formLabelWidth">
              <el-input class="add-input" v-model="addForm.telephone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address" :label-width="formLabelWidth">
              <el-input class="add-input" v-model="addForm.address" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog('addForm','addDialogFormVisible')">取 消</el-button>
            <el-button type="warning" @click="clearForm('addForm')">清 空</el-button>
            <el-button
              type="primary"
              class="selectButton"
              @click="submitForm('addForm',CurrentHouseHold.household_id)"
            >
              <i class="fa fa-check"></i>保 存
            </el-button>
          </div>
        </el-dialog>
      </div>
      <el-row type="flex" class="row-bg">
        <el-col :span="2">
          <label>姓名:{{CurrentHouseHold.household_name}}</label>
        </el-col>
        <el-col :span="2">
          <label>性别:{{CurrentHouseHold.gender}}</label>
        </el-col>
        <el-col :span="2">
          <label>年龄:{{CurrentHouseHold.age}}</label>
        </el-col>
        <el-col :span="4">
          <label>出生日期:{{CurrentHouseHold.birthday}}</label>
        </el-col>
        <el-col :span="4">
          <label>电话:{{CurrentHouseHold.telephone}}</label>
        </el-col>
        <el-col :span="4">
          <label>地址:{{CurrentHouseHold.address}}</label>
        </el-col>
        <el-col :span="4">
          <label>创建人:{{CurrentHouseHold.create_user}}</label>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="member-container">
      <h3>成员信息</h3>
      <el-divider></el-divider>
      <!-- 成员列表区域 -->
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="MemberList"
        :header-row-style="{'font-size':'13px','color':'black'}"
        :cell-style="{'padding':'5px'}"
        :row-style="{'padding':'0'}"
      >
        <el-table-column align="center" type="index" prop="index" label="#"></el-table-column>
        <!-- <el-table-column prop="user_id" align="center" label="#" width="50"></el-table-column> -->
        <el-table-column prop="household_name" align="center" label="姓名" width="100"></el-table-column>
        <el-table-column prop="gender" align="center" label="性别" width="80"></el-table-column>
        <el-table-column prop="age" align="center" label="年龄" width="50"></el-table-column>
        <el-table-column prop="birthday" align="center" label="出生日期" width="120"></el-table-column>
        <el-table-column prop="telephone" align="center" label="电话" width="200"></el-table-column>
        <el-table-column prop="address" align="center" label="地址"></el-table-column>
        <el-table-column prop="create_user" align="center" label="创建员工" width="100"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="selectButton"
              type="primary"
              @click="showEditDialog(scope.row.household_id)"
            >修改</el-button>
            <!-- 修改对话框 -->
            <el-dialog
              title="编辑用户"
              :visible.sync="editDialogVisible"
              :width="dialog_width"
              @close="closeDialog('editform','editDialogVisible')"
            >
              <el-form :model="editform" size="small" ref="editform" :rules="rules">
                <el-form-item label="姓名" prop="household_name" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editform.household_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday" :label-width="formLabelWidth">
                  <el-date-picker
                    :picker-options="pickerOptions0"
                    class="add-input"
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
                <el-form-item label="电话" prop="telephone" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editform.telephone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editform.address" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog('editform','editDialogVisible')">取 消</el-button>
                <el-button type="primary" @click="submitEditForm">提 交</el-button>
              </div>
            </el-dialog>
            <el-button
              size="mini"
              class="deleteButton"
              type="danger"
              @click="deleteById(scope.row.household_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
	data() {
		return {
            dialog_width: '350px',
			// 选择业主的对话框
			dialogVisible: false,
			// 添加成员的对话框
			addDialogFormVisible: false,
			// 修改成员信息的对话框显示
			editDialogVisible: false,
			// 是否已经选中 默认为false 用来控制按钮是否显示
			is_select: false,
			//   dialog宽度
			formLabelWidth: '80px',
			// 当前选中的业主
			CurrentHouseHold: {
				household_id: '',
				household_name: '',
				telephone: '',
				address: '',
				gender: '',
				age: '',
				birthday: '',
				create_user: ''
			},
			// 添加成员的表单
			addForm: {
				household_name: '',
				telephone: '',
				address: '',
				gender: '',
				birthday: '',
				create_user: window.sessionStorage.getItem('username')
			},
			// 修改成员信息对象
			editform: {},
			// 出生日期日期规定：不允许选择当前日期之后的日期
			pickerOptions0: {
				disabledDate(time) {
					return time.getTime() > Date.now() - 8.64e6; // 如果没有后面的-8.64e6就是不可以选择今天的
				}
			},
			// 查询参数
			queryInfo: {
				query: '',
				// 页数
				pagenum: 1,
				// 每页显示几条
				pagesize: 10
            },
            // 业主列表
            houseHoldList: [],
			// 成员列表
			MemberList: [],
			// 总数
            total: 0,
            // 加载变量
            loading: false,
            // 表单校验规则
			rules: {
				household_name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' },
					{
						min: 2,
						max: 6,
						message: '长度在 2 到 6 个字符',
						trigger: 'blur'
					}
				],
				gender: [
					{ required: true, message: '请选择性别', trigger: 'blur' }
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
				]
			}
		};
	},
	methods: {
		// 打开对话框
		openSelectDialog() {
			this.dialogVisible = true;
			this.getHouseHoldList();
		},
		// 获取业主列表
		async getHouseHoldList() {
			const { data: res } = await this.$http.get('getHouseHoldsIsFList', {
				params: {
					query: this.queryInfo.query,
					pageNum: this.queryInfo.pagenum,
					pageSize: this.queryInfo.pagesize
				}
			});
			this.houseHoldList = res.data.list;
			this.total = res.data.total;
			console.log(res);
		},
		// 监听页码值
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getHouseHoldList();
		},
		// 选择具体业主
		async chooseHouseHold(id) {
			const { data: res } = await this.$http.get(
				'getHouseHoldById/' + id
			);
			if (res.code === 200) {
				this.CurrentHouseHold = res.data;
				this.dialogVisible = false;
				this.is_select = true;
				this.getMemberByHouseHoldId(id);
			} else {
				return this.$message.error('获取用户信息失败！');
			}
		},
		// 查询
		search() {
			this.getHouseHoldList();
		},
		// 打开添加成员dialog
		openAddDialog() {
			this.addDialogFormVisible = true;
		},
		// 根据业主id获取成员列表
		async getMemberByHouseHoldId(id) {
			const { data: res } = await this.$http.get(
				'getMembersByHouseHoldId/' + id
			);
			if (res.code === 200) {
				this.MemberList = res.data;
			}
		},
		// 给业主添加成员
		async addMember(id) {
			const { data: res } = await this.$http.post(
				'addMemberByHouseHoldId/' + id,
				this.addForm
			);
			if (res.code === 200) {
				this.$message.success(res.msg);
				this.closeDialog('addForm', 'addDialogFormVisible');
				this.getMemberByHouseHoldId(id);
			}
		},
		// 校验表单，通过就执行addMember,未通过就返回失败
		submitForm(formName, id) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.addMember(id);
				} else {
					return false;
				}
			});
		},
		// 打开修改对话框
		showEditDialog(id) {
			console.log(id);
			this.editDialogVisible = true;
			this.selectByHouseHoldId(id);
		},
		// 提交修改验证表单
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
				this.getMemberByHouseHoldId(this.CurrentHouseHold.household_id);
			}
		},
		// 删除业主
		deleteById(id) {
			this.$confirm('此操作将永久删除该成员, 是否继续?', '提示', {
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
				this.getMemberByHouseHoldId(this.CurrentHouseHold.household_id);
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

<style>
.clearfix h3 {
	margin-left: 47.5%;
}
.clearfix {
	height: 25px;
	align-items: center;
	display: flex;
	justify-content: space-between;
}
.selectButton {
    background-color: #1ab394 !important;
    margin: auto 10px;
	border: none;
}
.deleteButton {
	background-color: #f56c6c !important;
	border: none;
}
.household-message span {
	text-align: left;
}
.member-container {
	margin-top: 20px;
}
.search-input {
	width: 300px;
	float: right;
}
.add-input {
	width: 200px !important;
	float: left;
}
.edit-button {
    color: inherit;
    margin-left: 5px;
    border: 1px solid #e7eaec;
    background: White;
}
</style>
