<template>
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>资产管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <strong>车位管理</strong>
        </el-breadcrumb-item>
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
            v-model="queryInfo.parking_number"
            placeholder="请输入车位编号"
          ></el-input>
          <el-select
            clearable
            v-model="queryInfo.status"
            filterable
            placeholder="请选择车位状态"
            size="medium"
            class="type-select"
          >
            <el-option v-for="item in statusList" :key="item.id" :value="item"></el-option>
          </el-select>
          <el-button size="medium" class="search-button" type="primary" @click="getParkingList">查询</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="member-container">
      <div class="clearfix">
        <h3>车位信息</h3>
        <el-button
          type="primary"
          class="selectButton"
          size="medium"
          icon="el-icon-plus"
          @click="addDialogVisible = true"
        >添加</el-button>
      </div>
      <el-divider></el-divider>
      <el-table
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="ParkingList"
        :header-row-style="{'font-size':'13px','color':'black'}"
        :cell-style="{'padding':'5px'}"
        :row-style="{'padding':'0'}"
      >
      <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column prop="parking_number" align="center" label="车位编号" min-width="100"></el-table-column>
        <el-table-column prop="area" align="center" label="面积" min-width="100"></el-table-column>
        <el-table-column prop="status" align="center" label="状态" min-width="150"></el-table-column>
        <el-table-column prop="owner" align="center" label="车位主人" min-width="150"></el-table-column>
        <el-table-column prop="owner_telephone" align="center" label="车位主人电话" min-width="150"></el-table-column>
        <el-table-column align="center" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button size="mini" class="edit-button" @click="showEditDialog(scope.row.id)">修改</el-button>
            <el-button size="mini" class="edit-button" @click="deleteParkingById(scope.row.id)">删除</el-button>
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
      <el-dialog
        title="添加车位"
        :visible.sync="addDialogVisible"
        :width="dialog_width"
        @close="closeDialog('addForm','dialogFormVisible')"
      >
        <el-form :model="addForm" size="small" ref="addForm" :rules="rules">
          <el-form-item label="车位编号" prop="parking_number" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="addForm.parking_number" autocomplete="off" placeholder="请输入车位编号"></el-input>
          </el-form-item>
          <el-form-item label="面积" prop="area" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="addForm.area" autocomplete="off" placeholder="请输入面积"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
            <el-select
              v-model="addForm.status"
              prop="status"
              placeholder="请选择车位状态"
              style="width:200px;float:left;"
            >
              <el-option v-for="item in statusList" :key="item.id" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车位主人" prop="owner" :label-width="formLabelWidth" v-if="addForm.status !== '空闲'">
            <el-input class="add-input" v-model="addForm.owner" autocomplete="off" placeholder="请输入车位主人"></el-input>
          </el-form-item>
          <el-form-item label="主人电话" prop="owner_telephone" :label-width="formLabelWidth" v-if="addForm.status !== '空闲'" >
            <el-input class="add-input" v-model="addForm.owner_telephone" autocomplete="off" placeholder="请输入主人电话"></el-input>
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
        title="编辑车位"
        :visible.sync="editDialogVisible"
        :width="dialog_width"
        @close="closeDialog('editForm','dialogFormVisible')"
      >
        <el-form :model="editForm" size="small" ref="editForm" :rules="rules">
          <el-form-item label="车位编号" prop="parking_number" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="editForm.parking_number" autocomplete="off" placeholder="请输入车位编号"></el-input>
          </el-form-item>
          <el-form-item label="面积" prop="area" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="editForm.area" autocomplete="off" placeholder="请输入面积"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
            <el-select
              v-model="editForm.status"
              prop="status"
              placeholder="请选择车位状态"
              style="width:200px;float:left;"
            >
              <el-option v-for="item in statusList" :key="item.id" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车位主人" prop="owner" :label-width="formLabelWidth"  v-if="editForm.status !== '空闲'">
            <el-input class="add-input" v-model="editForm.owner" autocomplete="off" placeholder="请输入车位主人"></el-input>
          </el-form-item>
           <el-form-item label="主人电话" prop="owner_telephone" :label-width="formLabelWidth"  v-if="editForm.status !== '空闲'">
            <el-input class="add-input" v-model="editForm.owner_telephone" autocomplete="off" placeholder="请输入车位主人电话" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog('editForm','addDialogVisible')">取 消</el-button>
          <el-button type="success" @click="clearForm('editForm')">清 空</el-button>
          <el-button type="primary" @click="submitEditForm('editForm')">
            <i class="fa fa-check"></i>保 存
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
	data() {
		return {
			queryInfo: {
				parking_number: '',
                status: '',
                pagenum: 1,
				pagesize: 10
            },
            total: 0,
            statusList: ['出租', '出售', '空闲'],
            addForm: {},
			formLabelWidth: '80px',
            dialog_width: '350px',
            addDialogVisible: false,
            editDialogVisible: false,
            ParkingList: [],
            editForm: {},
            rules: {
				parking_number: [
					{
						required: true,
						message: '请输入车位编号',
						trigger: 'blur'
					}
				],
				status: [
					{
						required: true,
						message: '请选择车位状态',
						trigger: 'blur'
					}
				],
				area: [
					{
						required: true,
						message: '请输入车位面积',
						trigger: 'blur'
					}
                ],
                owner: [
					{
						required: true,
						message: '请输入车位主人',
						trigger: 'blur'
					}
                ],
                owner_telephone: [
					{
						required: true,
						message: '请输入车位主人电话',
						trigger: 'blur'
                    },
                    { validator: this.checkTelephone, trigger: 'blur' }
				],
			}
		};
	},
	created() {
        this.getParkingList();
    },
	methods: {
        showEditDialog(id) {
			this.editDialogVisible = true;
			this.getParkingById(id);
        },
        handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize;
			this.getParkingList();
		},
		// 监听页码值
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getParkingList();
		},
        async getParkingById(id) {
			const { data: res } = await this.$http.get('getParkingById/' + id);
			console.log(res);
			if (res.code === 200) {
				this.editForm = res.data;
			}
        },
        submitEditForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.editParking();
				} else {
					return false;
				}
			});
        },
        async editParking() {
			const { data: res } = await this.$http.put(
				'editParking',
				this.editForm
			);
			console.log(res);
			if (res.code === 200) {
				this.$message.success('修改成功');
				this.editDialogVisible = false;
				this.getParkingList();
			}
		},
        submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.addParking();
				} else {
					return false;
				}
			});
        },
        async addParking() {
			const { data: res } = await this.$http.post('addParking', this.addForm);
			if (res.code === 200) {
				this.closeDialog('addForm', 'addDialogVisible');
				this.getParkingList();
				return this.$message.success(res.msg);
			}
        },
        async getParkingList() {
			const { data: res } = await this.$http.get('getParkingList', {
				params: {
                    parking_number: this.queryInfo.parking_number,
                    status: this.queryInfo.status,
					pageNum: this.queryInfo.pagenum,
					pageSize: this.queryInfo.pagesize
				}
			});
			this.ParkingList = res.data.list;
			this.total = res.data.total;
        },
        deleteParkingById(id) {
			this.$confirm('此操作将永久删除该车位，不可恢复， 是否继续?', '提示', {
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
				'deleteParkingById/' + id
			);
			if (res.code === 200) {
				this.getParkingList();
				return this.$message.success(res.msg);
			}
			return this.$message.error(res.msg);
		},
    }
};
</script>

<style scoped>
h4 {
    text-align: left;
}
</style>
