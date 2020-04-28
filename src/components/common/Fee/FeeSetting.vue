<template>
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>费用管理</el-breadcrumb-item>
        <el-breadcrumb-item>费用项设置</el-breadcrumb-item>
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
            v-model="queryInfo.feeProject"
            placeholder="请输入费用项目"
          ></el-input>
          <el-select
            clearable
            v-model="queryInfo.feeType"
            filterable
            placeholder="请选择费用类型"
            size="medium"
            class="type-select"
          >
            <el-option v-for="item in feeTypeList" :key="item.id" :value="item"></el-option>
          </el-select>
          <el-button size="medium" class="search-button" type="primary" @click="getFeeSettingItemList">查询</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="member-container">
      <div class="clearfix">
        <h3>费用项信息</h3>
        <el-button
          type="primary"
          class="selectButton"
          size="medium"
          icon="el-icon-plus"
          @click="addDialogVisible = true"
        >添加</el-button>
      </div>
      <!-- 添加费用项区域 -->
      <el-dialog
        title="添加费用项"
        :visible.sync="addDialogVisible"
        :width="dialog_width"
        @close="closeDialog('addForm','addDialogVisible')"
      >
        <el-form :model="addForm" size="small" ref="addForm" :rules="rules">
          <el-form-item label="费用类型" prop="fee_type" :label-width="formLabelWidth">
            <el-select
              clearable
              v-model="addForm.fee_type"
              placeholder="请选择费用类型"
              size="medium"
              class="add-input"
            >
              <el-option v-for="item in feeTypeList" :key="item.id" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收费项目" prop="fee_project" :label-width="formLabelWidth">
            <el-input
              class="add-input"
              v-model="addForm.fee_project"
              autocomplete="off"
              placeholder="请输入收费项目"
            ></el-input>
          </el-form-item>
          <el-form-item label="费用标识" prop="fee_sign" :label-width="formLabelWidth">
            <el-select
              v-model="addForm.fee_sign"
              prop="fee_sign"
              placeholder="请选择费用标识"
              style="width:200px;float:left;"
            >
              <el-option label="周期性费用" value="周期性费用"></el-option>
              <el-option label="一次性费用" value="一次性费用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计费起始时间" prop="start_time" :label-width="formLabelWidth">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              class="add-input"
              v-model="addForm.start_time"
              :default-time="this.getTime()"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="计费终止时间" prop="end_time" :label-width="formLabelWidth">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions0"
              class="add-input"
              v-model="addForm.end_time"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="计算公式" prop="calculation_formula" :label-width="formLabelWidth">
            <el-select
              v-model="addForm.calculation_formula"
              prop="status"
              placeholder="请选择计算公式"
              style="width:200px;float:left;"
            >
              <el-option v-for="item in calculationList" :key="item.id" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="计费单价"
            v-if="addForm.calculation_formula !== '固定费用'"
            prop="unit_price"
            :label-width="formLabelWidth"
          >
            <el-input
              v-if="addForm.calculation_formula !== '固定费用'"
              class="add-input"
              v-model="addForm.unit_price"
              autocomplete="off"
              placeholder="请输入计费单价"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="addForm.calculation_formula === '固定费用' ? '固定费用' : '附加费用'"
            prop="add_cost"
            :label-width="formLabelWidth"
          >
            <el-input
              class="add-input"
              v-model="addForm.add_cost"
              autocomplete="off"
              placeholder="请输入固定/附加费用"
            ></el-input>
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
      <!-- 修改费用项区域 -->
      <el-dialog
        title="修改费用项"
        :visible.sync="editDialogVisible"
        :width="dialog_width"
        @close="closeDialog('editForm','editDialogVisible')"
      >
        <el-form :model="editForm" size="small" ref="editForm" :rules="rules">
          <el-form-item label="费用类型" prop="fee_type" :label-width="formLabelWidth">
            <el-select
              clearable
              v-model="editForm.fee_type"
              placeholder="请选择费用类型"
              size="medium"
              class="add-input"
            >
              <el-option v-for="item in feeTypeList" :key="item.id" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收费项目" prop="fee_project" :label-width="formLabelWidth">
            <el-input
              class="add-input"
              v-model="editForm.fee_project"
              autocomplete="off"
              placeholder="请输入收费项目"
            ></el-input>
          </el-form-item>
          <el-form-item label="费用标识" prop="fee_sign" :label-width="formLabelWidth">
            <el-select
              v-model="editForm.fee_sign"
              prop="fee_sign"
              placeholder="请选择费用标识"
              style="width:200px;float:left;"
            >
              <el-option label="周期性费用" value="周期性费用"></el-option>
              <el-option label="一次性费用" value="一次性费用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计费起始时间" prop="start_time" :label-width="formLabelWidth">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              class="add-input"
              v-model="editForm.start_time"
              :default-time="this.getTime()"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="计费终止时间" prop="end_time" :label-width="formLabelWidth">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions0"
              class="add-input"
              v-model="editForm.end_time"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="计算公式" prop="calculation_formula" :label-width="formLabelWidth">
            <el-select
              v-model="editForm.calculation_formula"
              prop="status"
              placeholder="请选择计算公式"
              style="width:200px;float:left;"
            >
              <el-option v-for="item in calculationList" :key="item.id" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="计费单价"
            v-if="editForm.calculation_formula !== '固定费用'"
            prop="unit_price"
            :label-width="formLabelWidth"
          >
            <el-input
              v-if="editForm.calculation_formula !== '固定费用'"
              class="add-input"
              v-model="editForm.unit_price"
              autocomplete="off"
              placeholder="请输入计费单价"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="editForm.calculation_formula === '固定费用' ? '固定费用' : '附加费用'"
            prop="add_cost"
            :label-width="formLabelWidth"
          >
            <el-input
              class="add-input"
              v-model="editForm.add_cost"
              autocomplete="off"
              placeholder="请输入固定/附加费用"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog('editForm','editDialogVisible')">取 消</el-button>
          <el-button type="success" @click="clearForm('editForm')">清 空</el-button>
          <el-button type="primary" @click="submitEditForm('editForm')">
            <i class="fa fa-check"></i>保 存
          </el-button>
        </div>
      </el-dialog>
      <el-divider></el-divider>
      <el-table
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="FeeSettingItemList"
        :header-row-style="{'font-size':'13px','color':'black'}"
        :cell-style="{'padding':'5px'}"
        :row-style="{'padding':'0'}"
      >
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column prop="fee_type" align="center" label="费用类型" width="150"></el-table-column>
        <el-table-column prop="fee_project" align="center" label="收费项目" width="100"></el-table-column>
        <el-table-column prop="fee_sign" align="center" label="费用标识" width="150"></el-table-column>
        <el-table-column prop="start_time" align="center" label="计费起始时间" min-width="160"></el-table-column>
        <el-table-column prop="end_time" align="center" label="计费终止时间" min-width="160"></el-table-column>
        <el-table-column prop="unit_price" align="center" label="计费单价" width="140"></el-table-column>
        <el-table-column prop="add_cost" align="center" label="附加/固定费用" width="140"></el-table-column>
        <el-table-column align="center" label="操作" min-width="180">
          <template slot-scope="scope">
            <el-button size="mini" class="edit-button" @click="showEditDialog(scope.row.id)">修改</el-button>
            <el-button
              size="mini"
              class="edit-button"
              @click="deleteFeeSettingItemById(scope.row.id)"
            >删除</el-button>
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
			queryInfo: {
				feeProject: '',
				feeType: '',
				pagenum: 1,
				pagesize: 10
			},
			formLabelWidth: '150px',
			dialog_width: '460px',
			feeTypeList: [
				'物业费',
				'临时车费用',
				'地上出租停车费',
				'地上出售停车费',
				'地下出租停车费',
				'地下出售停车费'
			],
			FeeSettingItemList: [],
			addForm: {
				start_time: ''
			},
			editForm: {},
			total: 0,
			addDialogVisible: false,
			editDialogVisible: false,
			calculationList: [
				'面积*单价+附加费',
				'固定费用',
				'固定费用(前两个小时)+每小时*单价'
			],
			pickerOptions0: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e6; // 如果没有后面的-8.64e6就是不可以选择今天的
				}
			},
			rules: {
				fee_type: [
					{
						required: true,
						message: '请输入费用类型',
						trigger: 'blur'
					}
				],
				fee_project: [
					{
						required: true,
						message: '请选择收费项目',
						trigger: 'blur'
					}
				],
				fee_sign: [
					{
						required: true,
						message: '请选择费用标识',
						trigger: 'change'
					}
				],
				start_time: [
					{
						required: true,
						message: '请选择开始时间',
						trigger: 'change'
					}
				],
				end_time: [
					{
						required: true,
						message: '请选择终止时间',
						trigger: 'blur'
					}
				],
				add_cost: [
					{
						required: true,
						message: '请输入费用',
						trigger: 'blur'
					}
				],
				calculation_formula: [
					{
						required: true,
						message: '请选择计算公式',
						trigger: 'blur'
					}
				],
				unit_price: [
					{
						required: true,
						message: '请输入计费单价',
						trigger: 'blur'
					}
				]
			}
		};
	},
	created() {
		this.getFeeSettingItemList();
	},
	methods: {
		showEditDialog(id) {
			this.editDialogVisible = true;
			this.getFeeSettingItemById(id);
		},
		async getFeeSettingItemById(id) {
			const { data: res } = await this.$http.get(
				'getFeeSettingItemById/' + id
			);
			console.log(res);
			if (res.code === 200) {
				this.editForm = res.data;
			}
		},
		submitEditForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.editFeeSettingItem();
				} else {
					return false;
				}
			});
		},
		async editFeeSettingItem() {
			const { data: res } = await this.$http.put(
				'editFeeSettingItem',
				this.editForm
			);
			console.log(res);
			if (res.code === 200) {
				this.$message.success('修改成功');
				this.editDialogVisible = false;
				this.getFeeSettingItemList();
			}
		},
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize;
			this.getFeeSettingItemList();
		},
		// 监听页码值
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getFeeSettingItemList();
		},
		getTime() {
			var yy = new Date().getFullYear();
			var mm = new Date().getMonth() + 1;
			var dd = new Date().getDate();
			var hh = new Date().getHours();
			var mf =
				new Date().getMinutes() < 10
					? '0' + new Date().getMinutes()
					: new Date().getMinutes();
			var ss =
				new Date().getSeconds() < 10
					? '0' + new Date().getSeconds()
					: new Date().getSeconds();
			this.addForm.start_time =
				yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
			return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.addFeeSettingItem();
				} else {
					return false;
				}
			});
		},
		async addFeeSettingItem() {
			const { data: res } = await this.$http.post(
				'addFeeSettingItem',
				this.addForm
			);
			if (res.code === 200) {
				this.getFeeSettingItemList();
				this.closeDialog('addForm', 'addDialogVisible');
				return this.$message.success(res.msg);
			}
		},
		async getFeeSettingItemList() {
			const { data: res } = await this.$http.get(
				'getFeeSettingItemList',
				{
					params: {
						feeProject: this.queryInfo.feeProject,
						feeType: this.queryInfo.feeType,
						pageNum: this.queryInfo.pagenum,
						pageSize: this.queryInfo.pagesize
					}
				}
			);
			this.FeeSettingItemList = res.data.list;
			this.total = res.data.total;
		},
		deleteFeeSettingItemById(id) {
			this.$confirm(
				'此操作将永久删除该费用项，不可恢复， 是否继续?',
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
				'deleteFeeSettingItemById/' + id
			);
			if (res.code === 200) {
				this.getFeeSettingItemList();
				return this.$message.success(res.msg);
			}
			return this.$message.error(res.msg);
		}
	}
};
</script>

<style scoped>
h4 {
	text-align: left;
}
</style>
