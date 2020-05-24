<template>
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>费用管理</el-breadcrumb-item>
        <el-breadcrumb-item>缴费清单</el-breadcrumb-item>
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
            v-model="queryInfo.pay_person"
            placeholder="请输入缴费人"
          ></el-input>
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            change="changeTime"
            class="common-input"
            v-model="queryInfo.start_time"
            size="medium"
            type="datetime"
            placeholder="请选择开始时间"
          ></el-date-picker>
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            class="common-input"
            change="changeTime"
            v-model="queryInfo.end_time"
            size="medium"
            type="datetime"
            placeholder="请选择结束时间"
          ></el-date-picker>
          <el-button size="medium" class="search-button" type="primary" @click="getPayItemList">查询</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="member-container">
      <div class="clearfix">
        <h3>缴费清单</h3>
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
        :data="payList"
        :header-row-style="{'font-size':'13px','color':'black'}"
        :cell-style="{'padding':'5px'}"
        :row-style="{'padding':'0'}"
      >
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column prop="fee_type" align="center" label="费用类型" width="150"></el-table-column>
        <el-table-column prop="fee_project" align="center" label="收费项目" width="100"></el-table-column>
        <el-table-column prop="pay_person" align="center" label="缴费人" width="150"></el-table-column>
        <el-table-column prop="pay_cycle" align="center" label="缴费周期" min-width="100"></el-table-column>
        <el-table-column prop="should_pay" align="center" label="应付金额" width="100"></el-table-column>
        <el-table-column prop="actually_pay" align="center" label="实付金额" width="100"></el-table-column>
        <el-table-column prop="status" align="center" label="状态" width="140"></el-table-column>
        <el-table-column prop="pay_time" align="center" label="缴费时间" min-width="180"></el-table-column>
        <el-table-column align="center" label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="edit-button"
              @click="toPay(scope.row.id,scope.row.fee_project +'-'+scope.row.pay_person,scope.row.should_pay)"
              :disabled="scope.row.status === '已付款'"
            >去支付</el-button>
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
    <el-dialog
      title="添加缴费项"
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
        <el-form-item label="缴费人" prop="pay_person" :label-width="formLabelWidth">
          <el-input
            class="add-input"
            v-model="addForm.pay_person"
            autocomplete="off"
            placeholder="请输入缴费人"
          ></el-input>
        </el-form-item>
        <el-form-item label="缴费周期" prop="pay_cycle" :label-width="formLabelWidth">
          <el-input
            class="add-input"
            v-model="addForm.pay_cycle"
            autocomplete="off"
            placeholder="请输入缴费周期"
          ></el-input>
        </el-form-item>
        <el-form-item label="应付金额" prop="should_pay" :label-width="formLabelWidth">
          <el-input
            class="add-input"
            v-model="addForm.should_pay"
            autocomplete="off"
            placeholder="请输入应付金额"
          ></el-input>
        </el-form-item>
        <el-form-item label="实付金额" prop="actually_pay" :label-width="formLabelWidth">
          <el-input
            class="add-input"
            v-model="addForm.actually_pay"
            autocomplete="off"
            placeholder="请输入应付金额"
          ></el-input>
        </el-form-item>
        <el-form-item label="缴费时间" prop="pay_time" :label-width="formLabelWidth">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            class="add-input"
            v-model="addForm.pay_time"
            :default-time="this.getTime()"
            type="datetime"
            placeholder="选择日期"
          ></el-date-picker>
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
  </div>
</template>

<script>
export default {
	data() {
		return {
			payInfo: {
				tradeNo: '',
				subject: '',
				totalAmount: ''
			},
			queryInfo: {
				pay_person: '',
				start_time: '',
				end_time: '',
				pagenum: 1,
				pagesize: 10
			},
			formLabelWidth: '150px',
			dialog_width: '460px',
			addForm: {
				start_time: ''
			},
			editForm: {},
			addDialogVisible: false,
			payList: [],
			total: 0,
			feeTypeList: [
				'物业费',
				'临时车费用',
				'地上出租停车费',
				'地上出售停车费',
				'地下出租停车费',
				'地下出售停车费'
			],
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
				pay_person: [
					{
						required: true,
						message: '请输入缴费人',
						trigger: 'change'
					}
				],
				pay_cycle: [
					{
						required: true,
						message: '请输入付款周期',
						trigger: 'change'
					}
				],
				should_pay: [
					{
						required: true,
						message: '请输入应付金额',
						trigger: 'blur'
					}
				],
				actually_pay: [
					{
						required: true,
						message: '请输入实付金额',
						trigger: 'blur'
					}
				],
				pay_time: [
					{
						required: true,
						message: '请选择缴费时间',
						trigger: 'blur'
					}
				]
			}
		};
	},
	created() {
		if (this.$route.query.HouseHoldName > '') {
			this.queryInfo.pay_person = this.$route.query.HouseHoldName;
		}
		this.getPayItemList();
	},
	methods: {
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
			this.addForm.pay_time =
				yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
			return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
		},
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize;
			this.getPayItemList();
		},
		// 监听页码值
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getPayItemList();
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.addPayListItem();
				} else {
					return false;
				}
			});
		},
		async addPayListItem() {
			const { data: res } = await this.$http.post(
				'addPayListItem',
				this.addForm
			);
			if (res.code === 200) {
				this.getPayItemList();
				this.closeDialog('addForm', 'addDialogVisible');
				return this.$message.success(res.msg);
			}
		},
		async getPayItemList() {
			const { data: res } = await this.$http.get('getPayItemList', {
				params: {
					pay_person: this.queryInfo.pay_person,
					start_time:
						this.queryInfo.start_time == null
							? ''
							: this.queryInfo.start_time,
					end_time:
						this.queryInfo.end_time == null
							? ''
							: this.queryInfo.end_time,
					pageNum: this.queryInfo.pagenum,
					pageSize: this.queryInfo.pagesize
				}
			});
			this.payList = res.data.list;
			this.total = res.data.total;
		},
		changeTime(value) {
			if (value == null) value = '';
		},
		async toPay(_tradeNom, _subject, _totalAmount) {
			this.payInfo.tradeNo = '' + _tradeNom + '';
			this.payInfo.subject = _subject;
			this.payInfo.totalAmount = _totalAmount;
			console.log(
				this.payInfo.tradeNo,
				this.payInfo.subject,
				this.payInfo.totalAmount
			);
			const { data: res } = await this.$http.post(
				'order',
				this.QS.stringify({
					tradeNo: this.payInfo.tradeNo,
					subject: this.payInfo.subject,
					totalAmount: this.payInfo.totalAmount
				})
			);
			console.log(res);
			const newwindow = window.open('#', '_blank');
			newwindow.document.write(res);
		}
	}
};
</script>

<style scoped>
h4 {
	text-align: left;
}
</style>
