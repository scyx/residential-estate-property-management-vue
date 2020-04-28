<template>
  <!-- 添加房屋页 -->
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>资产管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <strong>添加房屋</strong>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="member-container">
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="选择楼栋"></el-step>
        <el-step title="选择单元"></el-step>
        <el-step title="添加房屋"></el-step>
      </el-steps>
      <el-button style="margin-top: 12px;" @click="backUp" v-show="this.active > 0">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="next" v-show="this.active !== 2">下一步</el-button>
      <el-button
        style="margin-top: 12px;"
        v-show="this.active === 2"
        @click="submitAddForm('addForm')"
      >完成</el-button>
    </el-card>
    <el-card class="member-container">
      <div class="main">
        <h3 v-show="this.active === 0">楼信息</h3>
        <h3 v-show="this.active === 1">单元信息</h3>
        <h3 v-show="this.active === 2">添加房屋</h3>
        <div class="select-area-head">
          <el-button
            type="primary"
            class="selectButton"
            size="medium"
            icon="el-icon-search"
            v-show="this.active === 0"
            @click="openSelectHouseDialog"
          >选择楼栋</el-button>
          <el-button
            type="primary"
            class="selectButton"
            size="medium"
            icon="el-icon-search"
            v-show="this.active === 1"
            @click="openSelectUnitDialog"
          >选择单元</el-button>
        </div>
        <!-- 选择楼栋区域 -->
        <el-dialog
          title="选择楼栋"
          :visible.sync="selectHouseDialogVisible"
          width="70%"
          @close="selectHouseDialogVisible=false"
        >
          <el-divider></el-divider>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="search-input">
            <el-button slot="append" @click="searchHouse">查询</el-button>
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
                  @click="chooseHouse(scope.row.house_id)"
                >选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            small
            layout="total,prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange_house"
            :current-page.sync="queryInfo.pagenum"
            :page-size="10"
          ></el-pagination>
          <span slot="footer" class="dialog-footer"></span>
        </el-dialog>
        <!-- 选择单元区域 -->
        <el-dialog
          title="选择单元"
          :visible.sync="selectUnitDialogVisible"
          width="70%"
          @close="selectUnitDialogVisible=false"
        >
          <el-divider></el-divider>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="search-input">
            <el-button slot="append" @click="searchUnit">查询</el-button>
          </el-input>
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
            <el-table-column align="center" type="index" prop="index" label="#" min-width="100"></el-table-column>
            <el-table-column prop="unit_id" align="center" label="单元编号" min-width="100"></el-table-column>
            <el-table-column prop="level" align="center" label="总层数" min-width="100"></el-table-column>
            <el-table-column prop="has_lift" align="center" label="是否有电梯" min-width="150"></el-table-column>
            <el-table-column prop="remark" align="center" label="备注" min-width="250"></el-table-column>
            <el-table-column prop="create_user" align="center" label="创建员工" min-width="100"></el-table-column>
            <el-table-column align="center" label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  class="selectButton"
                  @click="chooseUnit(scope.row.id)"
                >选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            small
            layout="total,prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange_unit"
            :current-page.sync="queryInfo.pagenum"
            :page-size="10"
          ></el-pagination>
          <span slot="footer" class="dialog-footer"></span>
        </el-dialog>
      </div>
      <el-divider></el-divider>
      <el-row v-show="this.active === 0">
        <el-col :span="50">
          <div class="in-col">
            <label>楼名称：</label>
            {{this.currentHouse.house_name}}
          </div>
        </el-col>
      </el-row>
      <el-row v-show="this.active === 0">
        <el-col :span="50">
          <div class="in-col">
            <label>备注：</label>
            {{this.currentHouse.remark}}
          </div>
        </el-col>
      </el-row>
      <el-row v-show="this.active === 0">
        <el-col :span="50">
          <div class="in-col">
            <label>创建时间：</label>
            {{this.currentHouse.create_date}}
          </div>
        </el-col>
      </el-row>
      <el-row v-show="this.active === 1">
        <el-col :span="50">
          <div class="in-col">
            <label>单元编号：</label>
            {{this.currentUnit.unit_id}}
          </div>
        </el-col>
      </el-row>
      <el-row v-show="this.active === 1">
        <el-col :span="50">
          <div class="in-col">
            <label>总层数：</label>
            {{this.currentUnit.level}}
          </div>
        </el-col>
      </el-row>
      <el-row v-show="this.active === 1">
        <el-col :span="50">
          <div class="in-col">
            <label>是否有电梯：</label>
            {{this.currentUnit.has_lift}}
          </div>
        </el-col>
      </el-row>
      <el-row v-show="this.active === 1">
        <el-col :span="50">
          <div class="in-col">
            <label>备注：</label>
            {{this.currentUnit.remark}}
          </div>
        </el-col>
      </el-row>
      <el-form
        :label-position="right"
        label-width="80px"
        :model="room"
        :rules="rules"
        ref="addForm"
        v-show="this.active === 2"
      >
        <el-form-item :label-width="label_width" label="房屋编号" prop="room_id">
          <el-input class="add-room-input" v-model="room.room_id" placeholder="必填，请填写房屋编号"></el-input>
        </el-form-item>
        <el-form-item :label-width="label_width" label="房屋楼层" prop="floor_num">
          <el-input class="add-room-input" v-model="room.floor_num" placeholder="必填，请填写房屋楼层"></el-input>
        </el-form-item>
        <el-form-item :label-width="label_width" label="房屋户型" required>
          <el-col span="5.5">
            <el-form-item prop="room_num">
              <el-select class="add-room-select" v-model="room.room_num" placeholder="必填，请选择房屋户型">
                <el-option label="一室" value="一室"></el-option>
                <el-option label="二室" value="二室"></el-option>
                <el-option label="三室" value="三室"></el-option>
                <el-option label="四室" value="四室"></el-option>
                <el-option label="五室" value="五室"></el-option>
                <el-option label="六室" value="六室"></el-option>
                <el-option label="七室" value="七室"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="5">
            <el-form-item prop="hall_num">
              <el-select class="add-room-select" v-model="room.hall_num" placeholder="必填，请选择房屋户型">
                <el-option label="一厅" value="一厅"></el-option>
                <el-option label="二厅" value="二厅"></el-option>
                <el-option label="三厅" value="三厅"></el-option>
                <el-option label="四厅" value="四厅"></el-option>
                <el-option label="五厅" value="五厅"></el-option>
                <el-option label="六厅" value="六厅"></el-option>
                <el-option label="七厅" value="七厅"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label-width="label_width" label="建筑面积" prop="area">
          <el-input class="add-room-input" v-model="room.area" placeholder="必填，请填写建筑面积"></el-input>
        </el-form-item>
        <el-form-item :label-width="label_width" label="状态" prop="status">
          <el-switch
            style="float:left;margin-top:10px"
            v-model="room.status"
            active-value="未售"
            inactive-value="已售"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="未售"
            inactive-text="已售"
          ></el-switch>
        </el-form-item>
        <el-form-item :label-width="label_width" label="备注" prop="remark">
          <el-input
            class="add-room-input"
            type="textarea"
            v-model="room.remark"
            placeholder="选填，请填写备注"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
	data() {
		return {
			// 步骤索引 0->1->2
			active: 0,
			// 查询参数
			queryInfo: {
				query: '',
				// 页数
				pagenum: 1,
				// 每页显示几条
				pagesize: 10
			},
			label_width: '37.5%',
			// 楼栋列表
			HouseList: [],
			// 单元列表
			UnitList: [],
			// 控制选择楼栋的table的可见的变量
			selectHouseDialogVisible: false,
			// 控制选择单元的table的可见的变量
			selectUnitDialogVisible: false,
			// 当前楼
			currentHouse: {},
			// 当前楼id
			currentHouseId: '',
			// 当前单元
			currentUnit: {},
			// 当前单元id
			currentUnitId: '',
			// 是否选中楼栋
			isSelect_house: false,
			// 是否选中单元
			isSelect_unit: false,
			// 房屋
			room: {
				house_id: '',
				unit_id: '',
				room_id: '',
				floor_num: '',
				room_num: '',
				hall_num: '',
				area: '',
				remark: '',
				status: ''
			},
			rules: {
				room_id: [
					{
						required: true,
						message: '请输入房屋编号',
						trigger: 'blur'
					}
				],
				floor_num: [
					{
						required: true,
						message: '请输入房屋楼层',
						trigger: 'blur'
					}
				],
				area: [{ required: true, message: '请输入建筑面积' }],
				hall_num: [{ required: true, message: '请选择房屋户型（厅）' }],
				room_num: [{ required: true, message: '请选择房屋户型（室）' }],
				remark: [{ required: true, message: '请输入备注' }],
				status: [{ required: true, message: '请选择状态' }]
			}
		};
	},
	methods: {
		next() {
			if (this.active === 0) {
				if (this.isSelect_house === true) {
					this.active++;
				} else {
					return this.$message.warning('请先选择楼栋');
				}
			} else if (this.active === 1) {
				if (this.isSelect_unit === true) {
					this.active++;
				} else {
					return this.$message.warning('请先选择单元');
				}
			}
		},
		backUp() {
			if (this.active-- < 1) {
				this.active = 0;
			}
		},
		// 打开选择楼栋列表的dialog,加载楼栋列表
		openSelectHouseDialog() {
            this.selectHouseDialogVisible = true;
            this.queryInfo.query = '';
			this.getHouseList();
		},
		// 打开选择楼栋列表的dialog，加载单元列表
		openSelectUnitDialog() {
            this.selectUnitDialogVisible = true;
            this.queryInfo.query = '';
			this.getUnitList();
		},
		// 选择楼栋
		chooseHouse(id) {
			this.currentHouse = this.HouseList.find(h => h.house_id === id);
			this.currentHouseId = id;
			this.room.house_id = id;
			this.selectHouseDialogVisible = false;
			this.isSelect_house = true;
		},
		// 监听页码值
		handleCurrentChange_house(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getHouseList();
		},
		// 监听页码值
		handleCurrentChange_unit(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getUnitList();
		},
		// 选择单元
		chooseUnit(id) {
			this.room.unit_id = id;
			this.currentUnitId = id;
			this.currentUnit = this.UnitList.find(u => u.id === id);
			this.selectUnitDialogVisible = false;
			this.isSelect_unit = true;
		},
		// 提交添加单元表单
		submitAddForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					// this.$message.success('chenggongle');
					this.addRoom();
				} else {
					return false;
				}
			});
		},
		// 添加房屋
		async addRoom() {
			const { data: res } = await this.$http.post('addRoom', this.room);
			if (res.code === 200) {
				this.$router.push('/room');
				return this.$message.success(res.msg);
			}
        },
        searchHouse() {
            this.getHouseList();
        },
        searchUnit() {
            this.getUnitList();
        }

	}
};
</script>

<style scoped>
.main {
	width: 100%;
	height: 20px;
	position: relative;
}
h3 {
	position: absolute;
	text-align: center;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	margin: 0 auto;
	display: inline-flex;
}
.el-row {
	margin-top: 20px !important;
	left: 38.5%;
}
.in-col {
	width: 100%;
	text-align: center;
}
label {
	display: inline-block;
	text-align: right;
	width: 200px;
}
.add-room-input {
	width: 500px;
	float: left;
}
.add-room-select {
	width: 245px;
	float: left;
	margin-right: 10px;
}
.select-area-head {
	position: absolute;
	top: 50%;
	left: 95%;
	transform: translate(-50%, -50%);
	height: 34px;
	width: 120px;
}
</style>
