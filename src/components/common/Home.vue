<template>
  <div class="main">
    <!-- 页面主体区域 -->
    <el-container class="home-container">
      <!-- 头部 -->
      <el-header height="70px">
        <a class="quit" style="font-size:30px;" @click="towelcome">物业管理系统</a>
        <div>
          <span class="welcome">欢迎访问物业管理系统，{{username}}!</span>
          <el-badge :value="0" class="item">
            <i class="el-icon-message-solid"></i>
          </el-badge>
          <el-button   type="danger" size="mini" @click="quit" class="quitbutton">
            <a>
              <i class="el-icon-switch-button" style="display:inline;"></i>
              退出
            </a>
          </el-button>
        </div>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width=" iscollapse ? '64px' : '200px' ">
          <div class="toggle-button" @click="changecollapse" :title="iscollapse?'展开':'收起'">
            <i :class="iscollapse?'el-icon-caret-right':'el-icon-caret-left'"></i>
          </div>
          <!-- 菜单栏区域 -->
          <el-menu
            :router="true"
            background-color="#333744"
            active-text-color="#409EFF"
            text-color="white"
            unique-opened
            :collapse="iscollapse"
            :collapse-transition="false"
            :default-active="activepath"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="'/'+item.path" v-for="item in menulist" :key="item.psid">
              <template slot="title">
                <i :class="iconobj[item.psid]"></i>
                <span style="padding-right:60px; user-select: none;">{{item.name}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+subitem.path"
                v-for="subitem in item.children"
                :key="subitem.psid"
                @click="savepath('/'+subitem.path)"
              >
                <i class="el-icon-menu"></i>
                <span slot="title" style="user-select: none;">{{subitem.name}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
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
    return {
      // 左侧菜单数据
      menulist: [],
      iconobj: {
        '125': 'el-icon-s-home',
        '103': 'el-icon-chat-dot-round',
        '101': 'el-icon-info',
        '102': 'el-icon-s-custom',
        '145': 'el-icon-money',
        '160': 'el-icon-s-tools'
      },
      // 是否折叠
      iscollapse: false,
      // 当前菜单
      activepath: '',
      username: ''
    };
  },
  created() {
    this.getMenuList();
    this.activepath = window.sessionStorage.getItem('activepath');
    this.username = window.sessionStorage.getItem('username');
  },
  methods: {
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
      const { data: res } = await this.$http.get('getMenuList');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.menulist = res.data;
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
.el-icon-s-custom,
.el-icon-s-tools {
  padding-right: 5px;
}
.home-container {
  height: 100%;
}
/* .el-submenu {
  width: 200px;
  padding: 0 -80px;
} */
.active {
  background: #d3dce6;
}
.el-header {
  background-color: burlywood;
  font-size: 30px;
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
  font-size: 20px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.welcome {
  padding-right: 20px;
  font-size: 17px;
  color: seashell;
  line-height: 17px;
  user-select: none;
}
.quit {
  font-size: 17px;
  cursor: pointer;
  line-height: 17px;
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
</style>
