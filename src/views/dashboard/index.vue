<template>
  <div class="dashboard-container">
    <el-card style="width: 100%">
      <div class="dashboard-text">{{ date }}</div>
      <div class="dashboard-box" style="width: 100%" direction="vertical">
        <div style="font-size: 20px">
          {{ welcome }}!{{ name }}! 欢迎使用济时系统!
        </div>
        <div style="font-size: 15px">下面一些内容将帮助您快速开始:</div>

        <div class="dashboard-boxinsidehor">
          <div class="dashboard-boxinsidever">
            <div>新手上路</div>
            <el-button
              type="primary"
              style="margin-top: 20px"
              @click.native.prevent="userForm"
              >完善个人信息</el-button
            >
          </div>
          <div class="dashboard-boxinsidever">
            <div>日程管理</div>
            <el-link
              type="primary"
              icon="el-icon-date"
              @click="routerPush('calendarView')"
              >查看</el-link
            >
          </div>
          <div class="dashboard-boxinsidever">
            <div>事项管理</div>
            <el-link
              type="primary"
              icon="el-icon-date"
              @click="routerPush('viewList')"
              >编辑</el-link
            >
          </div>
          <div class="dashboard-boxinsidever">
            <div>活动管理</div>
            <el-link
              type="primary"
              icon="el-icon-date"
              @click="routerPush('MineActivity')"
              >编辑</el-link
            >
          </div>
        </div>
      </div>
      <!-- <div class="dashboard-box" style="width:50%">
      <div>个人日程</div>
      <hr width="100%"></hr>
    </div>
    <div class="dashboard-box" style="width:50%">
      <div>数据分析</div>
      <hr width="100%"></hr>
    </div>
    <div class="dashboard-box" style="width:50%">
      <div>信息通知</div>
      <hr></hr>
    </div> -->
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
    welcome: function () {
      var time = new Date().getHours();
      if (time >= 6 && time < 12) return "早上好";
      else if (time >= 12 && time < 17) return "下午好";
      else return "晚上好";
    },
    date: function () {
      return new Date().toLocaleDateString();
    },
  },
  methods: {
    userForm() {
      console.log(1);
      this.$router.push({ path: this.redirect || "/user/index" });
      this.loading = false;
    },
    /* router push  */
    routerPush(name) {
      this.$router.push({ name: name });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  &-box {
    // border-style: groove;
    height: auto;
    margin-top: 20px;
    padding: 20px;
  }
  &-boxinsidehor {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
  }
  &-boxinsidever {
    margin-top: 50px;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>
