<template>
  <!-- 权限组页面 -->
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <strong>权限组</strong>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="container">
      <el-card class="operate">
        <div class="list">
          <el-button type="primary" round class="addButton" @click="openAddForm">添加权限组</el-button>
          <!-- 添加权限组对话框 -->
          <el-dialog title="添加权限组" :visible.sync="addFormVisible" :width="dialog_width">
            <el-divider></el-divider>
            <el-form :model="addForm" ref="addForm" size="medium" :rules="rules">
              <el-form-item label="权限组名称" :label-width="formLabelWidth" prop="name">
                <el-input
                  class="add-input"
                  v-model="addForm.name"
                  autocomplete="off"
                  placeholder="必填，请填写权限组名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="权限组描述" :label-width="formLabelWidth" prop="description">
                <el-input
                  class="add-input"
                  v-model="addForm.description"
                  autocomplete="off"
                  placeholder="必填，请填写权限组描述"
                ></el-input>
              </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <div slot="footer" class="dialog-footer">
              <el-button
                style="color:white;"
                type="warning"
                @click="closeDialog('addForm','addFormVisible')"
              >取 消</el-button>
              <el-button class="save" @click="submitAddForm">
                <i class="fa fa-check"></i>
                保 存
              </el-button>
            </div>
          </el-dialog>
          <div class="title-box">
            <h5>权限组</h5>
          </div>
          <ul class="category-list">
            <li v-for="item in authority_group_list" :key="item.authority_group_id" class="item_li">
              <a @click="changeGroup(item.authority_group_name,item.authority_group_id)">
                <strong>
                  <i class="el-icon-arrow-right"></i>
                </strong>
                {{item.authority_group_name}}
              </a>
              <el-button
                v-if="item.type !== 0"
                type="danger"
                size="mini"
                @click="deleteById(item.authority_group_id, item.authority_group_name)"
              >删除</el-button>
            </li>
          </ul>
        </div>
      </el-card>
      <el-card class="main">
        <div class="main-header">
          <h3>{{title}}</h3>
          <el-button
            type="primary"
            class="selectButton"
            size="medium"
            icon="el-icon-plus"
            @click="openAddAuthorityDialog"
          >添加权限</el-button>
        </div>
        <el-divider></el-divider>
        <el-table
          :data="itemList"
          style="width: 100%"
          :header-row-style="{'font-size':'13px','color':'black'}"
          :cell-style="{'padding':'5px'}"
          :row-style="{'padding':'0'}"
        >
          <el-table-column type="index" label="#" width="100" align="center"></el-table-column>
          <el-table-column prop="label" label="权限名称" width="500" align="center"></el-table-column>
          <el-table-column align="center" label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button size="mini" class="edit-button" @click="deleteItemById(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="提示" :visible.sync="addAuthorityDialogVisible" width="30%">
          <el-tree
            :data="authorityList"
            node-key="psid"
            show-checkbox
            :default-expand-all="true"
            ref="treeRef"
          ></el-tree>
          <div slot="footer" class="dialog-footer">
            <el-button
              style="color:white;"
              type="warning"
              @click="closeDialog('','addAuthorityDialogVisible')"
            >取 消</el-button>
            <el-button class="save" @click="addAuthority()">
              <i class="fa fa-check"></i>
              确 定
            </el-button>
          </div>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			dialog_width: '350px',
			// 权限组列表
			authority_group_list: [],
			// 权限组表单可见变量
			addFormVisible: false,
			addAuthorityDialogVisible: false,
			formLabelWidth: '100px',
			// 添加权限组表单
			addForm: {
				name: '',
				description: ''
			},
			title: '物业管理员权限组',
			currentAuthorityGroupId: '',
			authorityList: [],
			itemList: [],
			rules: {
				name: [
					{
						required: true,
						message: '权限组名不能为空',
						trigger: 'blur'
					}
				],
				description: [
					{
						required: true,
						message: '权限组描述不能为空',
						trigger: 'blur'
					}
				]
			}
		};
	},
	created() {
		this.getAuthorityGroupList();
	},
	methods: {
		async addAuthority() {
			const authorityList = [
				...this.$refs.treeRef.getCheckedNodes(),
				...this.$refs.treeRef.getHalfCheckedNodes()
			];
			if (authorityList.length === 0) {
				return this.$message.error('请先选择权限');
			}
			const { data: res } = await this.$http.post(
				'addAuthorityByGroupId/' + this.currentAuthorityGroupId,
				authorityList
			);
			if (res.code !== 200) {
				return this.$message.error('提交失败！');
            }
            this.$message.success('添加成功');
			this.getAuthorityListByGroupId();
			this.closeDialog('', 'addAuthorityDialogVisible');
		},
		// 获取权限组列表
		async getAuthorityGroupList() {
			const { data: res } = await this.$http.get('getAuthorityGroupList');
			this.authority_group_list = res.data;
			this.currentAuthorityGroupId = this.authority_group_list[0].authority_group_id;
			this.getAuthorityListByGroupId();
			console.log(res);
		},
		// 打开表单
		openAddForm() {
			this.addFormVisible = true;
		},
		openAddAuthorityDialog() {
			this.addAuthorityDialogVisible = true;
			this.getPermissionList();
		},
		// 修改组
		changeGroup(name, id) {
			this.title = name;
			this.currentAuthorityGroupId = id;
			this.getAuthorityListByGroupId();
		},
		// 验证表单，通过后添加
		submitAddForm() {
			this.$refs.addForm.validate(valid => {
				if (valid) {
					this.addGroup();
				} else {
					return false;
				}
			});
		},
		// 添加权限组
		async addGroup() {
			const { data: res } = await this.$http.post(
				'addAuthorityGroupList',
				this.QS.stringify({
					name: this.addForm.name,
					description: this.addForm.description
				})
			);
			if (res.code !== 200) {
				return this.$message.error('提交失败！');
			}
			this.closeDialog('addForm', 'addFormVisible');
			this.$message.success('添加成功');
			this.getAuthorityGroupList();
		},
		// 删除权限组操作
		deleteById(id, name) {
			this.$confirm(
				'此操作将永久删除' + name + '权限组, 是否继续?',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(() => {
                    this.deleteGroup(id);
                    this.currentAuthorityGroupId = this.authority_group_list[0].authority_group_id;
                    this.title = this.authority_group_list[0].authority_group_name;
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
                });
		},
		// 删除
		async deleteGroup(gid) {
			console.log(gid);
			const { data: res } = await this.$http.delete(
				'deleteAuthorityGroupById/' + gid
			);
			if (res.code !== 200) {
				return this.$message.error('删除失败！');
			}
			this.$message.success('删除成功');
			this.getAuthorityGroupList();
		},
		async getPermissionList() {
			const { data: res } = await this.$http.get('getPermissionList/' + this.currentAuthorityGroupId);
			if (res.code !== 200) return this.$message.error(res.msg);
            this.authorityList = res.data;
            // if (this.itemList.length !== 0) {
            //     for (var )
            // }
			console.log(this.authorityList);
		},
		async getAuthorityListByGroupId() {
			const { data: res } = await this.$http.get(
				'getAuthorityListByGroupId/' + this.currentAuthorityGroupId
			);
			if (res.code !== 200) return this.$message.error(res.msg);
			this.itemList = res.data;
			console.log(this.itemList);
        },
        // 删除权限组操作
		deleteItemById(id) {
			this.$confirm(
				'此操作将从该组中删除该权限, 是否继续?',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(() => {
                    this.deleteItem(id);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
                });
		},
		async deleteItem(groupId) {
			const { data: res } = await this.$http.delete(
				'deleteItemById/' + groupId
			);
			if (res.code !== 200) {
				return this.$message.error('删除失败！');
			}
			this.$message.success('删除成功');
			this.getAuthorityListByGroupId();
		},
	}
};
</script>

<style scoped>
.main-header {
	display: inline;
}
.selectButton {
	background-color: #1ab394;
	float: right;
	margin-top: -50px;
}
.container {
	width: 100%;
	display: inline-flex;
}
.operate {
    height:fit-content;
    width: 30%;
	float: left;
}
h5 {
	display: block;
	padding-left: 30px;
	font-weight: 600;
}
.addButton {
	min-width: 300px;
	box-sizing: border-box;
	background-color: #1ab394;
	border: 0ch;
}
.category-list {
	list-style: none;
	display: block;
}
.category-list a {
	padding: 0 0;
	font-size: 13px;
	cursor: pointer;
}
.category-list li {
	text-align: left;
	padding: 8px 0;
	display: block;
}
.category-list button {
	line-height: 0px;
	float: right;
	z-index: 200;
}
.list {
	display: inline;
}
.title-box {
	display: block;
	text-align: left;
	font-size: 20px;
	margin-bottom: -20px;
}
.el-icon-arrow-right {
	color: green;
	font-weight: bold;
}
.group_item {
	font-size: 13px;
	margin: 10px 0;
}
.save {
	background-color: #1ab394;
	color: white;
}
.main {
	float: left;
    width: 70%;
	margin-left: 10px;
}
.main h3 {
	width: 500px;
	text-align: left;
}
</style>
