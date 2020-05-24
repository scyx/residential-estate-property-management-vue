<template>
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>报修管理</el-breadcrumb-item>
        <el-breadcrumb-item>派单信息</el-breadcrumb-item>
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
            v-model="queryInfo.repairer"
            placeholder="请输入报修人姓名"
          ></el-input>
          <el-input
            clearable
            class="common-input"
            size="medium"
            v-model="queryInfo.telephone"
            placeholder="请输入报修电话"
          ></el-input>
          <el-select
            clearable
            v-model="queryInfo.repairType"
            filterable
            placeholder="请选择报修类型"
            size="medium"
            class="type-select"
          >
            <el-option v-for="item in repairTypeList" :key="item.id" :value="item"></el-option>
          </el-select>
          <el-button size="medium" class="search-button" type="primary" @click="getRepairList">查询</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="member-container">
      <div class="clearfix">
        <h3>报修信息</h3>
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
        :data="RepairList"
        :header-row-style="{'font-size':'13px','color':'black'}"
        :cell-style="{'padding':'5px'}"
        :row-style="{'padding':'0'}"
      >
        <el-table-column prop="type" align="center" label="报修类型" min-width="100"></el-table-column>
        <el-table-column prop="repairer" align="center" label="报修人" min-width="130"></el-table-column>
        <el-table-column prop="telephone" align="center" label="联系方式" min-width="170"></el-table-column>
        <el-table-column prop="room" align="center" label="房屋" width="170"></el-table-column>
        <el-table-column prop="submit_time" align="center" label="提交时间" min-width="200"></el-table-column>
        <el-table-column prop="repairman" align="center" label="维修师傅" width="150"></el-table-column>
        <el-table-column prop="status" align="center" label="状态" min-width="100"></el-table-column>
        <el-table-column align="center" label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button size="mini" class="edit-button" @click="openInfoDialog(scope.row.id)">详情</el-button>
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
        title="添加报修单"
        :visible.sync="addDialogVisible"
        :width="dialog_width"
        @close="closeDialog('addForm','dialogFormVisible')"
      >
        <el-form :model="addForm" size="small" ref="addForm" :rules="rules">
          <el-form-item label="报修人" prop="repairer" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="addForm.repairer" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="telephone" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="addForm.telephone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="房屋" prop="room" :label-width="formLabelWidth">
            <el-input class="add-input" v-model="addForm.room" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="报修类型" prop="type" :label-width="formLabelWidth">
            <el-select
              v-model="addForm.type"
              prop="gender"
              placeholder="请选择报修类型"
              style="width:200px;float:left;"
            >
              <el-option v-for="item in repairTypeList" :key="item.id" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报修内容" prop="repair_content" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              autosize
              class="add-input"
              v-model="addForm.repair_content"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog('addForm','AddialogVisible')">取 消</el-button>
          <el-button type="success" @click="clearForm('addForm')">清 空</el-button>
          <el-button type="primary" @click="submitForm('addForm')">
            <i class="fa fa-check"></i>保 存
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="报修详情"
        :visible.sync="InfoDialogVisible"
        :width="dialog_width"
        @close="closeDialog('addForm','dialogFormVisible')"
      >
        <el-form :model="addForm" size="small" ref="addForm" :rules="rules">
          <el-form-item label="报修人" prop="repairer" :label-width="formLabelWidth">
            <el-input disabled class="add-input" v-model="addForm.repairer" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="telephone" :label-width="formLabelWidth">
            <el-input disabled class="add-input" v-model="addForm.telephone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="房屋" prop="room" :label-width="formLabelWidth">
            <el-input disabled class="add-input" v-model="addForm.room" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="报修类型" prop="type" :label-width="formLabelWidth">
            <el-select
              disabled
              v-model="addForm.type"
              prop="gender"
              placeholder="请选择报修类型"
              style="width:200px;float:left;"
            >
              <el-option v-for="item in repairTypeList" :key="item.id" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报修内容" prop="repair_content" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              autosize
              disabled
              class="add-input"
              v-model="addForm.repair_content"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog('addForm','InfoDialogVisible')">关 闭</el-button>
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
				repairer: '',
				telephone: '',
				repairType: '',
				pagenum: 1,
				pagesize: 10
			},
			total: 0,
			repairTypeList: [
				'卧室报修',
				'管道保修',
				'客厅报修',
				'厨房报修',
				'卫生间报修'
			],
			RepairList: [],
			addForm: {},
			formLabelWidth: '80px',
			pickerOptions0: {
				disabledDate(time) {
					return time.getTime() > Date.now() - 8.64e6; // 如果没有后面的-8.64e6就是不可以选择今天的
				}
			},
			dialog_width: '350px',
			addDialogVisible: false,
			InfoDialogVisible: false,
			rules: {
				repairer: [
					{
						required: true,
						message: '请输入报修人',
						trigger: 'blur'
					}
				],
				telephone: [
					{
						required: true,
						message: '请输入报修电话',
						trigger: 'blur'
                    },
                    { validator: this.checkTelephone, trigger: 'blur' }
				],
				type: [
					{
						required: true,
						message: '请选择报修类型',
						trigger: 'change'
					}
				],
				repair_content: [{ required: true, message: '请输入报修内容' }],
				room: [{ required: true, message: '请输入房屋' }]
			}
		};
	},
	created() {
		if (this.$route.query.HouseHoldName > '') {
            this.queryInfo.repairer = this.$route.query.HouseHoldName;
            this.getRepairList();
        } else {
            this.getRepairList();
        }
	},
	methods: {
		// 监听pagesize改变
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize;
			this.getRepairList();
		},
		// 监听页码值
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getRepairList();
		},

		openInfoDialog(id) {
			this.InfoDialogVisible = true;
			this.getRepairById(id);
		},
		async getRepairById(id) {
			const { data: res } = await this.$http.get('getRepairById/' + id);
			console.log(res);
			if (res.code === 200) {
				this.addForm = res.data;
			}
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.addRepair();
				} else {
					return false;
				}
			});
		},
		async addRepair() {
			const { data: res } = await this.$http.post(
				'addRepair',
				this.addForm
			);
			if (res.code === 200) {
				this.closeDialog('addForm', 'addDialogVisible');
				this.getRepairList();
				return this.$message.success(res.msg);
			}
		},
		async getRepairList() {
			const { data: res } = await this.$http.get('getRepairList', {
				params: {
					repairer: this.queryInfo.repairer,
					telephone: this.queryInfo.telephone,
					type: this.queryInfo.repairType,
					pageNum: this.queryInfo.pagenum,
					pageSize: this.queryInfo.pagesize
				}
			});
			this.RepairList = res.data.list;
			this.total = res.data.total;
		}
	}
};
</script>

<style scoped>
h4 {
	text-align: left;
}
</style>
