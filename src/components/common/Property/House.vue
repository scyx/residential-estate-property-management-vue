<template>
<!-- 楼栋管理页面 -->
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>资产管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <strong>楼栋管理</strong>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="member-container">
      <div class="head">
          <div class="search">
            <el-input
              clearable
              placeholder="请输入内容"
              v-model="queryInfo.query"
              size="medium"
              class="input-with-search"
            >
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
          <div class="search">
              <h3>楼栋信息</h3>
          </div>
        <div class="search">
        <el-button
          type="primary"
          class="selectButton"
          size="medium"
          @click="addDialogFormVisible = true"
          icon="el-icon-plus"
        >添加楼栋</el-button>
        </div>
      </div>
      <el-dialog
        title="添加楼栋"
        :visible.sync="addDialogFormVisible"
        :width="dialog_width"
        @close="closeDialog('addForm','addDialogFormVisible')"
      >
        <el-form :model="addForm" size="small" ref="addForm" :rules="rules">
          <!-- <el-form-item label="编号" prop="house_id" :label-width="formLabelWidth">
            <el-input class="search-input" v-model="addForm.house_id" autocomplete="off" disabled></el-input>
          </el-form-item> -->
          <el-form-item label="名称" prop="house_name" :label-width="formLabelWidth">
            <el-input class="search-input" v-model="addForm.house_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
            <el-input class="search-input" v-model="addForm.remark" autocomplete="off" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="创建员工" prop="create_user" :label-width="formLabelWidth">
            <el-input
              class="search-input"
              v-model="addForm.create_user"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog('addForm','addDialogFormVisible')">取 消</el-button>
          <el-button type="success" @click="clearForm('addForm')">清 空</el-button>
          <el-button type="primary" @click="submitForm('addForm')">
            <i class="fa fa-check"></i>提 交
          </el-button>
        </div>
      </el-dialog>
      <el-divider></el-divider>
      <!-- 楼栋信息区域 -->
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="HouseList"
       :header-row-style="{'font-size':'13px','color':'black'}"
        :cell-style="{'padding':'5px'}"
        :row-style="{'padding':'0'}"
      >
        <el-table-column align="center" type="index" prop="index" label="#" width="80"></el-table-column>
        <!-- <el-table-column prop="user_id" align="center" label="#" width="50"></el-table-column> -->
        <!-- <el-table-column prop="house_id" align="center" label="编号" width="200"></el-table-column> -->
        <el-table-column prop="house_name" align="center" label="楼栋名称" width="200"></el-table-column>
        <el-table-column prop="remark" align="center" label="备注" width="300"></el-table-column>
        <el-table-column prop="create_date" align="center" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="create_user" align="center" label="创建员工" width="200"></el-table-column>

        <el-table-column align="center" label="操作" min-width="250">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="house-button"
              @click="showEditDialog(scope.row.house_id)"
            >修改</el-button>
            <!-- 修改对话框 -->
            <el-dialog
              title="修改信息"
              :visible.sync="editDialogVisible"
              width="20%"
              @close="closeDialog('editform','editDialogVisible')"
            >
              <el-form :model="editform" size="small" ref="editform" :rules="rules">
                <el-form-item label="编号" prop="house_id" :label-width="formLabelWidth">
                  <el-input disabled class="add-input" v-model="editform.house_id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="楼栋名称" prop="house_name" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editform.house_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editform.remark" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="create_date" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editform.create_date" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="创建员工" prop="create_user" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editform.create_user" autocomplete="off" disabled></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog('editform','editDialogVisible')">取 消</el-button>
                <el-button type="primary" @click="submitEditForm">提 交</el-button>
              </div>
            </el-dialog>
            <el-button
              size="mini"
              class="house-button"
              @click="deleteById(scope.row.house_id)"
            >删除</el-button>
            <el-button
              size="mini"
              class="house-button"
              @click="addUnit(scope.row.house_id,scope.row.house_name)"
            >添加单元</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    inject: ['reload'],
	data() {
		return {
			queryInfo: {
                // 查询参数
				query: '',
				// 页数
				pagenum: 1,
				// 每页显示几条
				pagesize: 10
			},
			// 添加楼栋的表单
			addForm: {
				house_name: '',
                remark: '',
                create_date: '',
				create_user: window.sessionStorage.getItem('username')
            },
            // 修改页表单对象
            editform: {},
            // 分页总数
            total: 0,
            // 楼栋列表
            HouseList: [],
            formLabelWidth: '80px',
            //  添加页可见变量
            addDialogFormVisible: false,
            // 修改页可见变量
            editDialogVisible: false,
			// 添加楼栋的规则
			rules: {
				house_name: [
					{ required: true, message: '请输入名称', trigger: 'blur' }
				],
				remark: [
					{ required: true, message: '请输入备注', trigger: 'blur' }
				]
            },
            // 表格加载
            loading: true,
            dialog_width: '350px',
		};
	},
	created() {
        this.getHouseList();
    },
	methods: {
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
            this.loading = false;
		},
		// 添加楼栋
		async addHouse() {
			const { data: res } = await this.$http.post(
				'addHouse',
				this.addForm
			);
			if (res.code === 200) {
				this.closeDialog('addForm', 'addDialogFormVisible');
				this.getHouseList();
				return this.$message.success(res.msg);
			}
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.addHouse();
				} else {
					return false;
				}
			});
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
        // 打开修改对话框
        showEditDialog(id) {
            this.selectByHouseId(id);
			this.editDialogVisible = true;
			// this.editform_copy = this.editform;
        },
        // 删除业主
		deleteById(id) {
			this.$confirm('此操作将永久删除该楼栋，不可恢复，是否继续?', '提示', {
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
				'deleteHouseById/' + id
			);
			if (res.code === 200) {
				this.getHouseList();
				return this.$message.success(res.msg);
			}
			return this.$message.error(res.msg);
        },
        submitEditForm() {
			this.$refs.editform.validate(valid => {
				if (valid) {
					this.editHouse();
				} else {
					return false;
				}
			});
		},
		// 修改楼栋信息提交
		async editHouse() {
			const { data: res } = await this.$http.put(
				'editHouse/' + this.editform.house_id,
				this.editform
			);
			console.log(res);
			if (res.code === 200) {
				this.$message.success('修改成功');
				this.editDialogVisible = false;
				this.getHouseList();
			}
        },
        // 查询
        search() {
			this.getHouseList();
        },
        // 去添加单元页
        addUnit(id, name) {
            this.$router.push({ path: 'unit', query: { HouseId: id, HouseName: name } });
            this.reload();
        }
	}
};
</script>

<style scoped>
.head {
	height:30px;
}
.head h3 {
	margin: 0 auto;
	width: 200px;
}
.input-with-search {
    float: left;
    width: 400px;
    margin-top: -5px;
}
.selectButton {
	float: right;
	box-sizing: border-box;
	margin-top: -30px;
}
.search {
    display: inline;
}
.search-input {
	float: left;
	width: 200px;
}
.house-button {
    color: inherit;
    margin-left: 5px;
    border: 1px solid #e7eaec;
    background: White;
}
</style>
