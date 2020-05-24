<template>
  <!-- 登录页面 -->
  <div class="login_wrapper">
    <!-- 头像区域 -->
    <div class="login_box">
      <!-- <img src="../assets/logo.png" alt class="avatar_box" /> -->
      <h1 style="color:white;">小区物业管理系统</h1>
      <h3 style="color:white;">请登录</h3>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginformRef"
        label-width="0px"
        :model="formLogin"
        :rules="loginFormRules"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="formLogin.username"
            placeholder="请输入用户名"
          >用户名</el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="formLogin.password"
            type="password"
            placeholder="请输入密码"
          >密码</el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-button type="primary" class="selectButton" @click="login">登录</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
	name: 'login',
	data() {
		return {
			formLogin: {
				// 表单对象
				username: '',
				password: ''
			},
			loginFormRules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
					// { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
            },
            dataList: [],
		};
	},
	methods: {
		login() {
			this.$refs.loginformRef.validate(async valid => {
				if (!valid) return;
				const { data: res } = await this.$http.post(
					'login',
					this.formLogin
				);
				if (res.code !== 200) {
					return this.$message.error(res.msg);
				}
                this.$message.success('登陆成功');
                this.dataList = res.data;
                console.log(this.dataList);
				console.log(res.data);
				// 将token保存到sessionStorage中
				window.sessionStorage.setItem('token', this.dataList.token);
				// 将用户名保存到sessionStorage中
				window.sessionStorage.setItem(
					'username',
					this.dataList.user.name
                );
                window.sessionStorage.setItem('authorityGroupId', this.dataList.user.authority_group_id);
				// 编程式导航 到home中
				this.$router.push('/home');
			});
		},
		reset() {
			this.$refs.loginformRef.resetFields();
		}
	}
};
</script>

<style lang="less" scoped>
.login_wrapper {
	height: 100%;
    background-color: #f3f3f4;
    background-image: url('../assets/login-bg.png')
}
.login_box {
	height: 310px;
	width: 350px;
    border-radius: 5%;
    background-color: rgba(0,0,0,0.5);
	//   background-color: #FFFFFF;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.avatar_box {
	width: 150px;
	height: 150px;
	border: 1px solid #ddd;
	padding: 10px;
	border-radius: 50%;
	box-shadow: 0 0 20px #ddd;
	position: absolute;
	transform: translate(-50%, -50%);
	img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #eee;
	}
}
.login_form {
	position: absolute;
	bottom: 10px;
	width: 100%;
	padding: 0 20px;
	box-sizing: border-box;
}
</style>
