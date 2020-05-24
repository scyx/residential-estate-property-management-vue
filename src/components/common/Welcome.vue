<template>
  <div>
    <el-card class="f-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-row :gutter="30">
      <el-col :span="6">
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
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="card">
            <h3>住户</h3>
            <el-tag effect="dark" class="sta" type="danger">统计</el-tag>
          </div>
          <div class="contain">
            <el-tag effect="dark" type="success" size="small" class="zonggong">总共</el-tag>
            <span class="sum">{{numGroup.livePeopleNum}}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="card">
            <h3>房屋</h3>
            <el-tag effect="dark" type="success" class="sta">统计</el-tag>
          </div>
          <div class="contain">
            <el-tag effect="dark" type="success" size="small" class="zonggong">总共</el-tag>
            <span class="sum">{{numGroup.roomNum}}</span>
            <el-tag effect="dark" type="info" size="small" class="zonggong">空闲</el-tag>
            <span class="sum">{{numGroup.roomNum_notSale}}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="card">
            <h3>停车位</h3>
            <el-tag effect="dark" type="warning" class="sta">统计</el-tag>
          </div>
          <div class="contain">
            <el-tag effect="dark" type="success" size="small" class="zonggong">总共</el-tag>
            <span class="sum">{{numGroup.parkingNum}}</span>
            <el-tag effect="dark" type="info" size="small" class="zonggong">空闲</el-tag>
            <span class="sum">{{numGroup.parkingNum_notSale}}</span>
          </div>
        </el-card>
      </el-col>
      <el-card class="announcement">
        <div slot="header" class="card">
          <h2>公告</h2>
        </div>
        <el-collapse  accordion>
          <el-collapse-item v-for=" item in numGroup.noticeList" :title="item.title" :name="item.id" :key="item.id">
            <span>
                {{item.content}}
            </span>
            <div>
                {{item.publish_time}}
            </div>
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
    width: 100%;
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
    width: fit-content;
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
    width: 100%;
  margin-right: 15%;
}
</style>
