<template>
  <div class="main">
    <!-- 页面主体区域 -->
    <el-container class="home-container">
      <!-- 头部 -->
      <!-- 侧边栏 -->
      <el-aside :width=" iscollapse ? '66px' : '220px' ">
        <div class="aside-title">
          <a
            class="quit"
            @click="towelcome"
          >{{iscollapse?aside_text_iscollapse:aside_text_isnotcollapse}}</a>
        </div>
        <!-- 菜单栏区域 -->
        <el-menu
          :router="true"
          background-color="#333744"
          active-text-color="#409EFF"
          text-color="white"
          unique-opened
          :collapse="iscollapse"
          :default-active="activepath"
          :collapse-transition="true"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="'/'+item.path" v-for="item in menulist" :key="item.psid">
            <template slot="title">
              <i :class="iconobj[item.psid]"></i>
              <span style="padding-right:40px; user-select: none;">{{item.label}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subitem.path"
              v-for="subitem in item.children"
              :key="subitem.psid"
              @click="savepath('/'+subitem.path)"
            >
              <div class="menuitem-content">
                <i class="el-icon-menu"></i>
                <span slot="title" style="user-select: none;">{{subitem.label}}</span>
              </div>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header height="70px">
          <!-- <div class="toggle-button" @click="changecollapse" :title="iscollapse?'展开':'收起'">
            <i :class="iscollapse?'el-icon-caret-right':'el-icon-caret-left'"></i>
          </div>-->
          <el-button class="edit-button" @click="changecollapse" :title="iscollapse?'展开':'收起'">
            <a>
              <i :class="iscollapse?'el-icon-caret-right':'el-icon-caret-left'"></i>
            </a>
          </el-button>
          <div>
            <span class="welcome">欢迎访问物业管理系统，{{username}}!</span>
            <el-badge :value="0" class="item">
              <i class="el-icon-message-solid"></i>
            </el-badge>
            <el-button
              type="success"
              size="mini"
              @click="openChangePasswordDialog"
              class="quitbutton"
            >
              <a>
                <i class="el-icon-key" style="display:inline;"></i>
                修改密码
              </a>
            </el-button>
            <el-button type="danger" size="mini" @click="quit" class="quitbutton">
              <a>
                <i class="el-icon-switch-button" style="display:inline;"></i>
                退出
              </a>
            </el-button>
          </div>
          <el-dialog
            title="修改密码"
            :visible.sync="dialogFormVisible"
            :width="dialog_width"
            @close="closeDialog('Form','dialogFormVisible')"
          >
            <el-form :model="form" size="small" ref="Form" :rules="rules">
              <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input disabled class="add-input" v-model="form.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="旧密码" prop="oldPassword" :label-width="formLabelWidth">
                <el-input class="add-input" type="password" v-model="form.oldPassword" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword" :label-width="formLabelWidth">
                <el-input class="add-input" type="password" v-model="form.newPassword" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeDialog('Form','dialogFormVisible')">取 消</el-button>
              <el-button type="primary" @click="submitEditForm()">
                <i class="fa fa-check"></i>保 存
              </el-button>
            </div>
          </el-dialog>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
	data() {
		const validOldPassword = (rule, value, callback) => {
			this.validOldPassword(value);
			if (this.oldPassIsRight === true) {
				callback(new Error('旧密码输入错误'));
			} else {
				callback();
			}
		};
		return {
			dialog_width: '350px',
			// 左侧菜单数据
			menulist: [],
			formLabelWidth: '80px',
			oldPassIsRight: false,
			form: {
                username: window.sessionStorage.getItem('user_name'),
			},
			dialogFormVisible: false,
			iconobj: {
				'125': 'el-icon-s-home',
				'103': 'el-icon-chat-dot-round',
				'101': 'el-icon-info',
				'104': 'el-icon-coin',
				'102': 'el-icon-s-custom',
				'145': 'el-icon-money',
				'160': 'el-icon-s-tools'
			},
			// 是否折叠
			iscollapse: false,
			// 当前菜单
			activepath: '',
			username: '',
			authorityGroupId: '',
			aside_text_iscollapse: '物',
			aside_text_isnotcollapse: '物业管理系统',
			rules: {
				oldPassword: [
					{
						required: true,
						message: '请输入旧密码',
						trigger: 'blur'
					},
					{ validator: validOldPassword }
				],
				newPassword: [
					{
						required: true,
						message: '请输入新密码',
						trigger: 'blur'
					},
					{
						min: 6,
						max: 16,
						message: '长度在 6 到 16 个字符',
						trigger: 'blur'
					}
				]
			}
		};
	},
	created() {
		this.getMenuList();
		this.getPathList();
		this.activepath = window.sessionStorage.getItem('activepath');
		this.username = window.sessionStorage.getItem('username');
		this.authorityGroupId = window.sessionStorage.getItem(
			'authorityGroupId'
		);
	},
	methods: {
        submitEditForm() {
			this.$refs.Form.validate(valid => {
				if (valid) {
					this.changePassword();
				} else {
					return false;
				}
			});
		},
        async changePassword() {
            const { data: res } = await this.$http.put('changePassword',
				this.QS.stringify({
					userName: this.form.username,
                    newPassword: this.form.newPassword,
				}));
            console.log(this.form.username);
			if (res.code === 200) {
                this.$message.success('修改成功！');
                this.dialogFormVisible = false;
			}
        },
		async validOldPassword(value) {
			const { data: res } = await this.$http.get('validOldPassword', {
				params: {
					userName: this.form.username,
					oldPassword: value
				}
			});
			if (res.code === 200) {
				this.oldPassIsRight = false;
			} else {
				this.oldPassIsRight = true;
			}
		},
		openChangePasswordDialog() {
			this.dialogFormVisible = true;
		},
		// 登出
		quit() {
			this.$confirm('确定退出吗？', '提示', {
				cancelButtonText: '取消',
				confirmButtonText: '确定',
				type: 'warning'
			}).then(() => {
				window.sessionStorage.clear();
				this.$router.push('/login');
			});
		},
		// 获取菜单列表
		async getMenuList() {
			const { data: res } = await this.$http.get(
				'getMenuList/' +
					window.sessionStorage.getItem('authorityGroupId')
			);
			if (res.code !== 200) return this.$message.error(res.msg);
			this.menulist = res.data;
			console.log(this.menulist);
		},
		async getPathList() {
			const { data: res } = await this.$http.get(
				'getPathList/' +
					window.sessionStorage.getItem('authorityGroupId')
			);
			if (res.code !== 200) return this.$message.error(res.msg);
			window.sessionStorage.setItem('pathList', res.data);
		},
		// 收起&&展开侧边栏
		changecollapse() {
			this.iscollapse = !this.iscollapse;
		},
		// 保存侧边状态栏激活状态
		savepath(activepath) {
			window.sessionStorage.setItem('activepath', activepath);
			this.activepath = activepath;
		},
		// 去首页
		towelcome() {
			this.$router.push('/welcome');
			this.savepath('/welcome');
		}
	}
};
</script>

<style>
.el-icon-chat-dot-round,
.el-icon-s-home,
.el-icon-money,
.el-icon-info,
.el-icon-coin,
.el-icon-s-custom,
.el-icon-s-tools {
	padding-right: 15px;
}
.home-container {
	height: 100%;
}
/* .el-submenu {
  width: 150px;
} */
.active {
	background: #d3dce6;
}
.el-header {
	background-color: #ffffff;
	font-size: 30px;
	height: 68px !important;
	line-height: 70px;
	align-items: center;
	display: flex;
	justify-content: space-between;
}
.el-aside {
	background-color: #333744;
	overflow: hidden;
}
.el-menu {
	border-right: none;
}
.el-menu-item i {
	text-align: left;
}
.menuitem-content {
	float: left;
	margin-left: 30px;
}
/* .el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
} */
.main {
	width: 100%;
	height: 100%;
	margin: 0;
}
.el-main {
	background-color: #eaedf1;
}
.toggle-button {
	background-color: skyblue;
	letter-spacing: 0.2em;
	cursor: pointer;
}
.welcome {
	padding-right: 20px;
	font-size: 17px;
	color: #888888;
	line-height: 17px;
	user-select: none;
}
.quit {
	font-size: 15px;
	color: azure;
	cursor: pointer;
	line-height: 100%;
	user-select: none;
}
.quit a:hover {
	color: aqua;
}
.item {
	margin-right: 30px;
	display: inline;
	font-size: 17px;
}
.el-icon-message-solid {
	margin-top: 33px;
}
.quitbutton {
	padding-top: 8px;
	height: 30px;
	line-height: 0px;
}
.aside-title {
	width: 100%;
	margin: 20px 50px 20px 0;
}
.edit-button {
	color: inherit !important;
	margin-left: 5px !important;
	border: 1px solid #e7eaec !important;
	background: White !important;
}
</style>
