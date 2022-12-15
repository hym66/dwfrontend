<template>
  <div>
    <div style="display: flex; justify-content: center">
      <span style="font-size: 16px">留言板</span>
    </div>
    <div class="form-item">
      <el-timeline style="margin-right: 80px">
        <el-timeline-item
          v-for="item in all_message_boards"
          :timestamp="item.createTime"
          placement="top"
          :key="item.messageBoardId"
        >
          <el-card>
            <h4>{{ item.content }}</h4>
            <p>{{ item.userName }} 提交于 {{ item.createTime }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div class="el-card-messages">
      <el-input
        type="textarea"
        :rows="3"
        placeholder="输入留言"
        maxlength="200"
        v-model="message"
      ></el-input>
      <div style="text-align: right; padding: 10px">
        <el-button size="medium" class="submit-message" @click="send"
          >留言</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { getActivityAllMessageBoard, sendMessageBoard } from "@/api/chat";

export default {
  name: "Forum",
  components: {},
  data() {
    return {
      // 活动Id
      activityId: null,
      // 留言板中消息
      all_message_boards: [],
      // 留言板输入框中的内容
      message: "",
    };
  },
  mounted() {
    // 获取当前活动ID
    this.activityId = this.$route.query.id;
    getActivityAllMessageBoard(this.activityId)
      .then((res) => {
        this.all_message_boards = res.data;
        console.log("留言板中的所有信息为:", this.all_message_boards);
        this.all_message_boards.forEach((element) => {
          // 将Date格式化
          element.createTime = this.formatDate(element.createTime);
          console.log(element.createTime);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    // 格式化Date方法
    formatDate(time, format = "YY-MM-DD hh:mm:ss") {
      var date = new Date(time);

      var year = date.getFullYear(),
        month = date.getMonth() + 1, //月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
      var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
        return "0" + index;
      });
      var newTime = format
        .replace(/YY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
        .replace(/hh/g, preArr[hour] || hour)
        .replace(/mm/g, preArr[min] || min)
        .replace(/ss/g, preArr[sec] || sec);

      return newTime;
    },
    // 发送留言
    send() {
      sendMessageBoard(
        this.activityId,
        this.userId,
        this.message,
        this.formatDate(new Date())
      )
        .then((res) => {
          console.log(res);
          // 重新获取数据
          getActivityAllMessageBoard(this.activityId)
          .then((res) => {
            this.all_message_boards = res.data;
            console.log("留言板中的所有信息为:", this.all_message_boards);
            this.all_message_boards.forEach((element) => {
              element.createTime = this.formatDate(element.createTime);
              console.log(element.createTime);
            });
          })
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    userId: {
      get: function () {
        return this.$store.getters.id;
      },
    },
  },
};
</script>

<style>
.form-item {
  height: 420px;
  max-height: 420px;
  overflow: auto;
  overflow-x: hidden;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column-reverse;
}
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: grey;
}

</style>
