<template>
  <!-- 添加投诉建议页 -->
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>智慧服务</el-breadcrumb-item>
        <el-breadcrumb-item>
          <strong>登记投诉</strong>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="member-container">
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="选择楼栋"></el-step>
        <el-step title="选择单元"></el-step>
        <el-step title="选择房屋"></el-step>
        <el-step title="登记投诉或建议"></el-step>
      </el-steps>
      <el-button style="margin-top: 12px;" @click="backUp" v-show="this.active > 0">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="next" v-show="this.active !== 3">下一步</el-button>
      <el-button
        style="margin-top: 12px;"
        v-show="this.active === 3"
        @click="submitAddForm('addForm')"
      >完成</el-button>
    </el-card>
    <el-card class="member-container">
      <div class="main">
        <h3 v-show="this.active === 0">楼栋信息</h3>
        <h3 v-show="this.active === 1">单元信息</h3>
        <h3 v-show="this.active === 2">房屋信息</h3>
        <h3 v-show="this.active === 3">登记投诉或建议</h3>
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
          <el-button
            type="primary"
            class="selectButton"
            size="medium"
            icon="el-icon-search"
            v-show="this.active === 2"
            @click="openSelectRoomDialog"
          >选择房屋</el-button>
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
            @current-change="handleCurrentChange_house"
            :current-page.sync="queryInfo.pagenum"
            :page-size="10"
          ></el-pagination>
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
        </el-dialog>
        <!-- 选择房屋区域 -->
        <el-dialog
          title="选择房屋"
          :visible.sync="selectRoomDialogVisible"
          width="70%"
          @close="selectRoomDialogVisible=false"
        >
          <el-divider></el-divider>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="search-input">
            <el-button slot="append" @click="searchRoom">查询</el-button>
          </el-input>
          <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="RoomList"
            :header-row-style="{'font-size':'13px','color':'black'}"
            :cell-style="{'padding':'5px'}"
            :row-style="{'padding':'0'}"
          >
            <el-table-column align="center" type="index" prop="index" label="#" width="100"></el-table-column>
            <el-table-column prop="house_id" align="center" label="楼栋编号" width="100"></el-table-column>
            <el-table-column prop="unit_id" align="center" label="单元" width="100"></el-table-column>
            <el-table-column prop="room_id" align="center" label="房屋编号" width="160"></el-table-column>
            <el-table-column prop="floor_num" align="center" label="楼层" width="100"></el-table-column>
            <el-table-column prop="area" align="center" label="建筑面积" width="150"></el-table-column>
            <el-table-column prop="status" align="center" label="房屋状态" width="150"></el-table-column>
            <el-table-column align="center" label="操作" min-width="150">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  class="selectButton"
                  @click="chooseRoom(scope.row.id,scope.row.room_id)"
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
        </el-dialog>
      </div>
      <el-divider></el-divider>
      <div v-show="this.active === 0">
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>楼名称：</label>
              {{this.currentHouse.house_name}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>备注：</label>
              {{this.currentHouse.remark}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>创建时间：</label>
              {{this.currentHouse.create_date}}
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-show="this.active === 1">
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>单元编号：</label>
              {{this.currentUnit.unit_id}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>总层数：</label>
              {{this.currentUnit.level}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>是否有电梯：</label>
              {{this.currentUnit.has_lift}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>备注：</label>
              {{this.currentUnit.remark}}
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-show="this.active === 2">
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>楼栋：</label>
              {{this.currentHouse.house_name}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>单元：</label>
              {{this.currentUnit.unit_id}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>房屋：</label>
              {{this.currentRoom.room_id}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>楼层：</label>
              {{this.currentRoom.floor_num}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>面积：</label>
              {{this.currentRoom.area}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>备注：</label>
              {{this.currentRoom.remark}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="50">
            <div class="in-col">
              <label>户型：</label>
              {{this.currentRoom.room_num}}{{this.currentRoom.hall_num}}
            </div>
          </el-col>
        </el-row>
      </div>
      <el-form
        label-position="right"
        label-width="80px"
        :model="complaint"
        :rules="rules"
        ref="addForm"
        v-show="this.active === 3"
      >
        <el-form-item :label-width="label_width" label="投诉人" prop="person">
          <el-input class="add-room-input" v-model="complaint.person" placeholder="必填，请填写投诉人"></el-input>
        </el-form-item>
        <el-form-item :label-width="label_width" label="投诉人电话" prop="telephone">
          <el-input class="add-room-input" v-model="complaint.telephone" placeholder="必填，请填写投诉人电话"></el-input>
        </el-form-item>
        <el-form-item :label-width="label_width" label="类型" prop="type">
          <el-select class="add-room-select" v-model="complaint.type" placeholder="必填，请选择类型">
            <el-option label="投诉" value="投诉"></el-option>
            <el-option label="建议" value="建议"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="label_width" label="投诉内容" prop="content">
          <el-input
            class="add-room-input"
            type="textarea"
            v-model="complaint.content"
            placeholder="必填，请填写投诉内容"
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
			span: 50,
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
			// 控制选择楼栋的Dialog的可见的变量
			selectHouseDialogVisible: false,
			// 控制选择单元的Dialog的可见的变量
			selectUnitDialogVisible: false,
			// 控制选择房屋的Dialog的可见的变量
			selectRoomDialogVisible: false,
			// 当前楼
			currentHouse: {},
			// 当前楼id
			currentHouseId: '',
			// 当前单元
			currentUnit: {},
			// 当前单元id
			currentUnitId: '',
			// 当前房屋
			currentRoom: {},
			// 当前房屋id
			currentRoomId: '',
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
			isSelect_room: false,
			RoomList: [],
			total: '',
			complaint: {
				house_id: '',
				house_name: '',
				unit_id: '',
				room_id: ''
			},
			ComplaintAndAdviceList: [],
			rules: {
				person: [
					{ required: true, trigger: 'blur', message: '请输入投诉人' }
				],
				telephone: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入投诉电话'
					}
				],
				type: [
					{
						required: true,
						trigger: 'blur',
						message: '请选择投诉类型'
					}
				],
				content: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入投诉内容'
					}
				]
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
			} else if (this.active === 2) {
				if (this.isSelect_room === true) {
					this.active++;
				} else {
					return this.$message.warning('请先选择房屋');
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
			this.getHouseList();
		},
		// 打开选择单元列表的dialog，加载单元列表
		openSelectUnitDialog() {
			this.selectUnitDialogVisible = true;
			this.queryInfo.pagenum = 1;
			this.queryInfo.query = '';
			this.getUnitList();
		},
		// 选择楼栋
		chooseHouse(id, name) {
			this.currentHouse = this.HouseList.find(h => h.house_id === id);
			this.complaint.house_name = name;
			this.complaint.house_id = id;
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
		handleCurrentChange_room(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getRoomList();
		},
		// 选择单元
		chooseUnit(id) {
			this.room.unit_id = id;
			this.complaint.unit_id = id;
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
					this.addComplaintOrAdvice();
				} else {
					return false;
				}
			});
		},
		async addComplaintOrAdvice() {
			const { data: res } = await this.$http.post(
				'addComplaintOrAdvice',
				this.complaint
			);
			if (res.code === 200) {
				this.$router.push('/complaintsAndAdvice');
				return this.$message.success(res.msg);
			}
		},
		// 添加房屋
		async addRoom() {
			const { data: res } = await this.$http.post('addRoom', this.room);
			if (res.code === 200) {
				this.$router.push('/room');
				return this.$message.success(res.msg);
			}
		},
		openSelectRoomDialog() {
			this.selectRoomDialogVisible = true;
			this.getRoomList();
		},
		// 获取房屋列表
		async getRoomList() {
			const { data: res } = await this.$http.get('getRoomList', {
				params: {
					houseId: this.currentHouseId,
					unitId: this.currentUnitId,
					roomId: '',
					pageNum: this.queryInfo.pagenum,
					pageSize: this.queryInfo.pagesize
				}
			});
			if (res.code === 200) {
				this.RoomList = res.data.list;
				console.log(res.data.list);
				this.total = res.data.total;
			}
		},
		// 查找楼栋
		searchHouse() {
			this.getHouseList();
		},
		// 查找单元
		searchUnit() {
			this.getUnitList();
		},
		// 选择房屋
		chooseRoom(id, roomId) {
			this.currentRoomId = id;
			this.complaint.room_id = roomId;
			this.currentRoom = this.RoomList.find(u => u.id === id);
			this.selectRoomDialogVisible = false;
			this.isSelect_room = true;
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
