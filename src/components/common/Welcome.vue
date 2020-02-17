<template>
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-row :gutter="30">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="card">
            <h3>业主</h3>
            <el-tag effect="dark" class="sta">统计</el-tag>
          </div>
          <div class="contain">
            <el-tag effect="dark" type="success" size="small" class="zonggong">总共</el-tag>
            <span class="sum">{{numGroup.householdNum}}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="card">
            <h3>房屋</h3>
            <el-tag effect="dark" type="success" class="sta">统计</el-tag>
          </div>
          <div class="contain">
            <el-tag effect="dark" type="success" size="small" class="zonggong">总共</el-tag>
            <span class="sum">100</span>
            <el-tag effect="dark" type="info" size="small" class="zonggong">空闲</el-tag>
            <span class="sum">100</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="card">
            <h3>停车位</h3>
            <el-tag effect="dark" type="warning" class="sta">统计</el-tag>
          </div>
          <div class="contain">
            <el-tag effect="dark" type="success" size="small" class="zonggong">总共</el-tag>
            <span class="sum">100</span>
            <el-tag effect="dark" type="info" size="small" class="zonggong">空闲</el-tag>
            <span class="sum">100</span>
          </div>
        </el-card>
      </el-col>
      <el-card class="announcement">
        <div slot="header" class="card">
          <h2>公告</h2>
        </div>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="一致性 Consistency" name="1">
            <span>
              与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
              在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
            </span>
          </el-collapse-item>
          <el-collapse-item title="反馈 Feedback" name="2">
            <span>
              控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
              页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。
            </span>
          </el-collapse-item>
          <el-collapse-item title="效率 Efficiency" name="3">
            <span>
              简化流程：设计简洁直观的操作流程；
              清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
              帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
            </span>
          </el-collapse-item>
          <el-collapse-item title="可控 Controllability" name="4">
            <span>
              用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
              结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
            </span>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      numGroup: [],
    };
  },
  created() {
    this.getNum();
  },
  methods: {
    async getNum() {
      const { data: res } = await this.$http.get('getWelComeNum');
      if (res.code === 200) {
        console.log(res);
        this.numGroup = res.data;
      }
    },
    },
};
</script>

<style>
.card {
  height: 50px;
  justify-content: left;
}
.box-card {
  margin-bottom: 15px;
}
.announcement {
  margin: 50px 15px;
}
.card h3,
h2 {
  float: left;
  margin-top: 15px;
}
.sta {
  float: right;
  margin-top: 15px;
}
.sum {
  font-size: 30px;
  font-family: 'Helvetica Neue';
  color: gray;
}
.zonggong {
  user-select: none;
  margin-left: 50px;
  display: inline;
  line-height: 100%;
}
.contain {
  margin-right: 15%;
}
</style>
