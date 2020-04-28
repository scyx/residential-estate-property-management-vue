<template>
  <!-- 单元管理页面 -->
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>资产管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <strong>单元信息</strong>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="member-container">
      <div class="main">
        <h3>单元信息</h3>
        <div class="select-area-head">
          <el-input
            class="select-input"
            placeholder="当前楼栋：尚未选择"
            size="medium"
            disabled
            v-model="currentHouseName"
          ></el-input>
          <el-button
            type="primary"
            class="selectButton"
            size="medium"
            icon="el-icon-search"
            @click="openSelectDialog"
          >选择楼栋</el-button>
          <el-button
            v-if="isSelect"
            type="primary"
            class="selectButton"
            size="medium"
            icon="el-icon-plus"
            @click="addUnitDialogVisible = true"
          >添加单元</el-button>
        </div>
      </div>
      <!-- 添加单元对话框 -->
      <el-dialog
        title="添加单元"
        :visible.sync="addUnitDialogVisible"
        :width="dialog_width"
        @close="closeDialog('addForm','editDialogVisible')"
      >
        <el-form :model="addForm" size="small" ref="addForm" :rules="rules">
          <el-form-item label="单元编号" prop="unit_id" :label-width="formLabelWidth">
            <el-input-number
              class="add-input"
              prop="unit_id"
              controls-position="right"
              :min="1"
              v-model="addForm.unit_id"
              autocomplete="off"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="总层数" prop="level" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="addForm.level"></el-input>
          </el-form-item>
          <el-form-item label="是否有电梯" prop="has_lift" :label-width="formLabelWidth">
            <el-select v-model="addForm.has_lift" placeholder="请选择" style="width:120px;float:left;">
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="addForm.remark" autocomplete="off" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="创建员工" prop="create_user" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="addForm.create_user" autocomplete="off" disabled></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog('addForm','addUnitDialogVisible')">取 消</el-button>
          <el-button type="success" @click="clearForm('addForm')">清 空</el-button>
          <el-button type="primary" @click="submitAddForm('addForm')">提 交</el-button>
        </div>
      </el-dialog>
      <el-divider></el-divider>
      <!-- 单元信息区域 -->
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="UnitList"
        :header-row-style="{'font-size':'13px','color':'black'}"
        :cell-style="{'padding':'5px'}"
        :row-style="{'padding':'0'}"
      >
        <el-table-column align="center" type="index" prop="index" label="#" min-width="80"></el-table-column>
        <!-- <el-table-column prop="user_id" align="center" label="#" width="50"></el-table-column> -->
        <!-- <el-table-column prop="house_id" align="center" label="编号" width="200"></el-table-column> -->
        <el-table-column prop="unit_id" align="center" label="单元编号" min-width="150"></el-table-column>
        <el-table-column prop="level" align="center" label="总层数" min-width="200"></el-table-column>
        <el-table-column prop="has_lift" align="center" label="是否有电梯" min-width="100"></el-table-column>
        <el-table-column prop="remark" align="center" label="备注" min-width="350"></el-table-column>
        <el-table-column prop="create_user" align="center" label="创建员工" min-width="150"></el-table-column>

        <el-table-column align="center" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="general-edit-button"
              @click="showEditDialog(scope.row.id)"
            >修改</el-button>
            <!-- 修改对话框 -->
            <el-dialog
              title="修改信息"
              :visible.sync="editDialogVisible"
              :width="dialog_width"
              @close="closeDialog('editForm','editDialogVisible')"
            >
              <el-form :model="editForm" size="small" ref="editForm" :rules="rules">
                <el-form-item label="单元编号" prop="unit_id" :label-width="formLabelWidth">
                  <el-input-number
                    class="add-input"
                    prop="unit_id"
                    controls-position="right"
                    :min="1"
                    v-model="editForm.unit_id"
                    autocomplete="off"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="总层数" prop="level" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editForm.level" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否有电梯" prop="has_lift" :label-width="formLabelWidth">
                  <el-select
                    v-model="editForm.has_lift"
                    placeholder="请选择"
                    style="width:120px;float:left;"
                  >
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
                  <el-input
                    class="add-input"
                    v-model="editForm.remark"
                    autocomplete="off"
                    type="textarea"
                  ></el-input>
                </el-form-item>
                <el-form-item label="创建员工" prop="create_user" :label-width="formLabelWidth">
                  <el-input
                    class="add-input"
                    v-model="editForm.create_user"
                    autocomplete="off"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog('editForm','editDialogVisible')">取 消</el-button>
                <el-button type="primary" @click="submitEditForm">提 交</el-button>
              </div>
            </el-dialog>

            <el-button size="mini" class="general-edit-button" @click="deleteById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
          <!-- 选择楼栋对话框 -->
      <el-dialog
        title="选择楼栋"
        :visible.sync="selectDialogVisible"
        width="70%"
        @close="selectDialogVisible=false"
      >
        <el-divider></el-divider>
        <el-input placeholder="请输入内容" v-model="queryInfo.query" class="search-input">
          <el-button slot="append" @click="getHouseList">查询</el-button>
        </el-input>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="HouseList"
          :header-row-style="{'font-size':'13px','color':'black'}"
          :cell-style="{'padding':'5px'}"
          :row-style="{'padding':'0'}"
        >
          <el-table-column align="center" type="index" prop="index" label="#" min-width="100"></el-table-column>
          <el-table-column prop="house_name" align="center" label="楼栋名称" min-width="150"></el-table-column>
          <el-table-column prop="remark" align="center" label="备注" min-width="200"></el-table-column>
          <el-table-column prop="create_date" align="center" label="创建时间" min-width="180"></el-table-column>
          <el-table-column prop="create_user" align="center" label="创建员工" min-width="100"></el-table-column>
          <el-table-column align="center" label="操作" min-width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                class="selectButton"
                @click="chooseHouse(scope.row.house_id,scope.row.house_name)"
              >选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            class="pagination"
          small
          layout="total,prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
          :current-page.sync="queryInfo.pagenum"
          :page-size="10"
        ></el-pagination>
      </el-dialog>
  </div>
</template>

<script>
export default {
	data() {
		return {
			dialog_width: '350px',
			// 单元列表
			UnitList: [],
			// 楼栋列表
			HouseList: [],
			// 当前楼栋Id
			currentHouseId: '',
			// 当前楼栋名称
			currentHouseName: '',
			// 是否已经选中楼栋
			isSelect: false,
			// 选择楼栋的table可见变量
			selectDialogVisible: false,
			// 单元修改table可见变量
			editDialogVisible: false,
			// 查询相关
			queryInfo: {
				query: '',
				// 页数
				pagenum: 1,
				// 每页显示几条
				pagesize: 10
			},
			// 分页总数
			total: 0,
			// 修改单元信息的 表单对象
			editForm: {},
			// 添加单元的表单对象
			addForm: {
				create_user: window.sessionStorage.getItem('username')
			},
			// 控制加载的变量
			loading: false,
			// 控制添加单元的dialog可见变量
			addUnitDialogVisible: false,
			formLabelWidth: '100px',
			rules: {
				unit_id: [
					{ required: true, message: '请输入编号', trigger: 'change' }
				],
				level: [
					{ required: true, message: '请输入总层数', trigger: 'blur' }
				],
				has_lift: [{ required: true, message: '请选择是否有电梯' }],
				remark: [{ required: true, message: '请输入备注' }]
			}
		};
	},
	created() {
		// 从楼栋信息跳转过来的时候 初始化当前楼栋的信息
		if (this.$route.query.HouseId > 0) {
			this.currentHouseId = this.$route.query.HouseId;
			this.currentHouseName = '当前楼栋:' + this.$route.query.HouseName;
			this.getUnitList();
			this.isSelect = true;
		}
	},
	methods: {
		openSelectDialog() {
            this.selectDialogVisible = true;
            this.queryInfo.query = '';
			this.getHouseList();
		},
		// 获取楼栋列表
		async getHouseList() {
			const { data: res } = await this.$http.get('getHouseList', {
				params: {
					query: this.queryInfo.query,
					pageNum: this.queryInfo.pagenum,
					pageSize: this.queryInfo.pagesize
				}
			});
			console.log(res);
			this.HouseList = res.data.list;
			this.total = res.data.total;
		},
		// 选择楼栋
		chooseHouse(id, name) {
			this.currentHouseId = id;
			this.currentHouseName = '当前楼栋:' + name;
			this.selectDialogVisible = false;
			this.isSelect = true;
			this.getUnitList();
		},
		// 监听pagesize改变
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize;
			this.getHouseList();
		},
		// 监听页码值
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getHouseList();
		},
		// 提交添加单元表单
		submitAddForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.addUnit();
				} else {
					return false;
				}
			});
		},
		// 添加单元
		async addUnit() {
			const { data: res } = await this.$http.post(
				'addUnit/' + this.currentHouseId,
				this.addForm
			);
			if (res.code === 200) {
				this.closeDialog('addForm', 'addUnitDialogVisible');
				this.getUnitList();
				return this.$message.success(res.msg);
			}
		},
		// 打开修改对话框
		showEditDialog(id) {
			console.log(id);
			this.editDialogVisible = true;
			this.selectByUnitId(id);
		},
		// 根据id查找楼栋信息
		async selectByUnitId(id) {
			const { data: res } = await this.$http.get('getUnitById/' + id);
			console.log(res);
			this.editForm = res.data;
		},
		// 提交编辑
		submitEditForm() {
			this.$refs.editForm.validate(valid => {
				if (valid) {
					this.editUnit();
				} else {
					return false;
				}
			});
		},
		async editUnit() {
			const { data: res } = await this.$http.put(
				'editUnit',
				this.editForm
			);
			if (res.code === 200) {
				this.$message.success('修改成功');
				this.editDialogVisible = false;
				this.getUnitList();
			}
		},
		// 删除单元
		deleteById(id) {
			this.$confirm('此操作将永久删除该单元, 是否继续?', '提示', {
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
				'deleteUnitById/' + id
			);
			if (res.code === 200) {
				this.getUnitList();
				return this.$message.success(res.msg);
			}
			return this.$message.error(res.msg);
		}
	}
};
</script>

<style scoped>
.select-input {
	width: 300px;
}
.main {
	width: 100%;
	height: 34px;
	justify-content: space-between;
	align-items: center;
	display: flex;
}
.main h3 {
	margin-left: 47.5%;
}
.select-area-head {
	text-align: right;
	height: fit-content;
	width: fit-content;
}
.general-edit-button {
	color: inherit;
	margin-left: 5px;
	border: 1px solid #e7eaec;
	background: White;
}
</style>
