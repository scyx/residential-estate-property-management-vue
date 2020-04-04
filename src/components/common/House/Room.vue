<template>
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>资产管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <strong>房屋管理</strong>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="member-container">
      <div class="search-area">
        <h4>查询条件</h4>
        <el-divider></el-divider>
        <div class="search-area-main">
          <el-input
            class="select-input"
            size="medium"
            placeholder="当前楼栋：尚未选择"
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
          <el-select
            clearable
            v-model="queryInfo.unitId"
            filterable
            placeholder="请选择单元"
            size="medium"
            class="unit-select"
          >
            <el-option v-for="item in UnitList" :key="item.id" :value="item.unit_id"></el-option>
          </el-select>
          <el-input
            placeholder="请输入房屋编号"
            v-model="queryInfo.roomId"
            class="select-input"
            size="medium"
          ></el-input>
          <el-button size="medium" class="search-button" type="primary" @click="getRoomList">查询</el-button>
          <!-- 选择楼栋区域 -->
          <el-dialog
            title="选择楼栋"
            :visible.sync="selectDialogVisible"
            width="50%"
            @close="selectDialogVisible=false"
          >
            <el-divider></el-divider>
            <el-input placeholder="请输入内容" v-model="queryInfo.query" class="search-input">
              <el-button slot="append" @click="getHouseList">查询</el-button>
            </el-input>
            <el-table
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :data="HouseList"
              :header-row-style="{'font-size':'13px','color':'black'}"
              :cell-style="{'padding':'5px'}"
              :row-style="{'padding':'0'}"
            >
              <el-table-column align="center" type="index" prop="index" label="#" width="100"></el-table-column>
              <el-table-column prop="house_name" align="center" label="楼栋名称" width="200"></el-table-column>
              <el-table-column prop="remark" align="center" label="备注" width="200"></el-table-column>
              <el-table-column prop="create_date" align="center" label="创建时间" width="200"></el-table-column>
              <el-table-column prop="create_user" align="center" label="创建员工" width="100"></el-table-column>
              <el-table-column align="center" label="操作">
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
              @current-change="handleCurrentChange_House"
              :current-page.sync="queryInfo.pagenum"
              :page-size="10"
            ></el-pagination>
            <span slot="footer" class="dialog-footer"></span>
          </el-dialog>
        </div>
      </div>
    </el-card>
    <el-card class="member-container">
      <div class="main-head">
        <h3>房屋信息</h3>
        <div class="add-room-button">
          <el-button
            type="primary"
            class="selectButton"
            size="medium"
            icon="el-icon-plus"
            @click="toAddRoom"
          >添加房屋</el-button>
        </div>
        <el-divider></el-divider>
      </div>
      <el-table
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="RoomList"
        :header-row-style="{'font-size':'13px','color':'black'}"
        :cell-style="{'padding':'5px'}"
        :row-style="{'padding':'0'}"
      >
        <el-table-column align="center" type="index" prop="index" label="#" width="100"></el-table-column>
        <el-table-column prop="house_id" align="center" label="楼栋编号" width="200"></el-table-column>
        <el-table-column prop="unit_id" align="center" label="单元" width="200"></el-table-column>
        <el-table-column prop="room_id" align="center" label="房屋编号" width="200"></el-table-column>
        <el-table-column prop="floor_num" align="center" label="楼层" width="200"></el-table-column>
        <el-table-column prop="area" align="center" label="建筑面积" width="200"></el-table-column>
        <el-table-column prop="status" align="center" label="房屋状态" width="200"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" class="edit-button" @click="showEditDialog(scope.row.id)">修改</el-button>
            <!-- 修改对话框 -->
            <el-dialog
              title="修改信息"
              :visible.sync="editDialogVisible"
              width="20%"
              @close="closeDialog('editform','editDialogVisible')"
            >
              <el-form :model="editform" size="small" ref="editform" :rules="rules">
                <el-form-item label="房屋编号" prop="room_id" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editform.room_id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="楼栋编号" prop="house_id" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editform.house_id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="单元编号" prop="unit_id" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editform.unit_id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="楼层" prop="floor_num" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editform.floor_num" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="建筑面积" prop="area" :label-width="formLabelWidth">
                  <el-input class="add-input" v-model="editform.area" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="房屋状态" prop="status" :label-width="formLabelWidth">
                  <el-select v-model="editform.status" class="add-input" placeholder="请选择">
                    <el-option label="已售" value="已售"></el-option>
                    <el-option label="未售" value="未售"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog('editform','editDialogVisible')">取 消</el-button>
                <el-button type="primary" @click="submiteditform">提 交</el-button>
              </div>
            </el-dialog>
            <el-button size="mini" class="edit-button" @click="deleteById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        small
        layout="total,prev, pager, next"
        :total="total_rooms"
        @current-change="handleCurrentChange_Room"
        :current-page.sync="pagenum"
        :page-size="pagesize"
      ></el-pagination>
      <span slot="footer" class="dialog-footer"></span>
    </el-card>
  </div>
</template>

<script>
export default {
	data() {
		return {
			// 楼栋列表
			HouseList: [],
			// 房屋列表
			RoomList: [],
			currentHouseName: '',
			currentHouseId: '',
			currentUnitId: '',
			formLabelWidth: '100px',
			// 查询参数
			queryInfo: {
				HouseId: '',
				unitId: '',
				roomId: '',
				query: '',
				// 页数
				pagenum: 1,
				// 每页显示几条
				pagesize: 10
			},
			// 分页总数
			total: 0,
			// 控制选择楼栋的table的可见变量
			selectDialogVisible: false,
			// 控制添加房屋的form的可见变量
			addRoomDialogVisible: false,
			// 控制修改房屋的form的可见变量
			editDialogVisible: false,
			// 单元列表
			UnitList: [],
			// 当前单元
			currentUnit: '',
			// 修改对象
			editform: {},
			// 控制房屋table的当前页数
			pagenum: 1,
			// 控制每页几个 默认不可更改
			pagesize: 10,
			// 房屋总数
			total_rooms: 0,
			rules: {
				room_id: [{ required: true, message: '请输入房屋编号' }],
				floor_num: [{ required: true, message: '请输入房屋楼层' }],
				house_id: [{ required: true, message: '请输入楼栋编号' }],
				unit_id: [{ required: true, message: '请输入单元编号' }],
				area: [{ required: true, message: '请输入建筑面积' }],
				status: [{ required: true, message: '请选择状态' }]
			}
		};
	},
	created() {
		this.getRoomList();
	},
	methods: {
		// 选择楼栋
		chooseHouse(id, name) {
			this.queryInfo.HouseId = id;
			this.currentHouseId = id;
			this.currentHouseName = '当前楼栋:' + name;
			this.selectDialogVisible = false;
			this.isSelect = true;
			this.getUnitList();
		},
		// 打开选择楼栋列表的dialog
		openSelectDialog() {
			this.selectDialogVisible = true;
			this.getHouseList();
		},
		// 监听页码值
		handleCurrentChange_House(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getHouseList();
		},
		handleCurrentChange_Room(newPage) {
			this.pagenum = newPage;
			this.getRoomList();
		},
		toAddRoom() {
			this.$router.push('/addRoom');
		},
		async getRoomList() {
			const { data: res } = await this.$http.get('getRoomList', {
				params: {
					houseId: this.queryInfo.HouseId,
					unitId: this.queryInfo.unitId,
					roomId: this.queryInfo.roomId,
					pageNum: this.pagenum,
					pageSize: this.pagesize
				}
			});
			if (res.code === 200) {
				this.RoomList = res.data.list;
				console.log(res.data.list);
				this.total_rooms = res.data.total;
			}
		},
		showEditDialog(id) {
			this.editDialogVisible = true;
			this.getByRoomId(id);
		},
		submiteditform() {
			this.$refs.editform.validate(valid => {
				if (valid) {
					this.editRoom();
				} else {
					return false;
				}
			});
		},
		// 修改楼栋信息提交
		async editRoom() {
			const { data: res } = await this.$http.put(
				'editRoom',
				this.editform
			);
			console.log(res);
			if (res.code === 200) {
				this.$message.success('修改成功');
				this.editDialogVisible = false;
				this.getRoomList();
			}
		},
		// 删除房屋
		deleteById(id) {
			this.$confirm(
				'此操作将永久删除该房屋，此操作不可恢复，是否继续?',
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
				'deleteRoomById/' + id
			);
			if (res.code === 200) {
				this.getRoomList();
				return this.$message.success(res.msg);
			}
			return this.$message.error(res.msg);
		},
		async getByRoomId(id) {
			const { data: res } = await this.$http.get('getRoomById/' + id);
			if (res.code === 200) {
				this.editform = res.data;
			} else {
				return this.$message.error(
					'获取住户信息失败！该房屋可能不存在'
				);
			}
		}
	}
};
</script>

<style scoped>
.search-area h4 {
	text-align: left;
}
.search-area-main {
	float: left;
	margin: 0 0 20px 0;
}
.select-input {
	width: 300px;
}
.unit-select {
	margin: auto 10px;
}
.add-room-button {
	float: right;
}
h3 {
	display: inline;
}
.search-button {
	margin-left: 10px;
	border: 1px solid;
}
.edit-button {
	color: inherit;
	margin-left: 5px;
	border: 1px solid #e7eaec;
	background: White;
}
</style>
