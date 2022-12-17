<template>
  <div class="app-container">
    <!-- 输入框 -->
    <el-input
      size="medium"
      placeholder="输入电影名称进行查询"
      suffix-icon="el-icon-edit"
      v-model="searchingTitle"
      style="width: 40vh; margin-bottom: 10px"
    >
    </el-input>
    <!-- 搜索按钮 -->
    <el-button
      icon="el-icon-search"
      circle
      style="margin-left: 10px"
      @click="searchMovieByTitle"
    ></el-button>
    <el-empty v-if="!visible" description="无数据"></el-empty>
    <!-- 表格主体 -->
    <el-table
      v-if="visible"
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="tableDataPage"
      style="width: 100%"
      border
      :stripe="true"
    >
      <el-table-column
        label="电影ID"
        prop="movieId"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        label="电影名称"
        prop="movieTitle"
        align="center"
        width="350"
      ></el-table-column>
      <el-table-column
        label="电影分数"
        prop="score"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        label="上映时间"
        prop="time"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        label="导演"
        prop="director"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column
        label="演员"
        prop="actor"
        align="center"
        width="370"
      ></el-table-column>
      <el-table-column
        label="评论数量"
        prop="commentNum"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        label="电影对应版本数"
        prop="productNum"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="showResource(scope.row)" type="text" size="small"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <el-pagination
      v-if="visible"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="tableData.length"
    >
    </el-pagination>
    <!-- 点击查看详情后的对话框，显示溯源信息 -->
    <el-dialog
      title="电影溯源信息"
      :visible.sync="dialogFlag"
      v-if="dialogFlag"
    >
      <div style="text-align: center; font-size: xx-large; margin-bottom: 8px">
        {{ selectData.movieTitle }}
      </div>
      <div style="text-align: center; margin-bottom: 8px">
        共合并
        <span style="font-size: x-large">{{ selectData.productNum }}</span>
        个版本数量的电影,点击url可访问源网址
      </div>
      <div style="text-align: center">
        该电影版本信息来源评论数量共
        <span style="font-size: x-large">0</span> 条
      </div>
      <div style="text-align: left">以下为未合并前的电影数据信息:</div>
      <el-table
        v-if="visible"
        :data="resourceData"
        style="width: 100%"
        border
        :stripe="true"
      >
        <el-table-column
          label="产品ID"
          prop="productId"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          label="来源"
          prop="source"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          label="url"
          align="center">
          <template slot-scope="scope">
            <el-button @click="openUrl(scope.row)" type="text" size="small">{{scope.row.url}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DwfrontendIndex",

  data() {
    return {
      searchingTitle: null,
      loading: true,
      visible: false,
      tableData: [],
      tableDataPage: [],
      currentPage: 1,
      pageSize: 10,
      dialogFlag: false,
      selectData: null,
      resourceData: null
    };
  },

  mounted() {},

  methods: {
    async showResource(row) {
      console.log(row);
      this.selectData = row;
      var axios = require("axios");
      var config = {
        method: "get",
        url: "http://localhost:8083/api/mysql/getSource",
        params: { movieId: this.selectData.movieId },
        headers: {},
      };
      await axios(config)
        .then((response) => {
          console.log(response);
          this.resourceData = response.data.data;
          console.log(this.resourceData);
        })
        .catch(function (error) {
          console.log(error);
        });

      this.dialogFlag = true;
    },
    openUrl(row){
        console.log(row);
        window.open(row.url,'_blank') 
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
      this.generatePage();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.generatePage();
    },
    async searchMovieByTitle() {
      if (this.searchingTitle == "") {
        //不为空
        return;
      } else {
        console.log(this.searchingTitle);
        this.visible = true;

        var axios = require("axios");
        var config = {
          method: "get",
          url: "http://localhost:8083/api/mysql/getMovieProduct",
          params: { movieTitle: this.searchingTitle },
          headers: {},
        };
        await axios(config)
          .then((response) => {
            console.log(response);
            this.tableData = response.data.data;
            this.tableData.forEach((element) => {
              element.productNum = element.productList.length;
              element.actor = element.actor.join(",");
              element.director = element.director.join(",");
            });
            console.log(this.tableData);
          })
          .catch(function (error) {
            console.log(error);
          });

        this.generatePage();
        this.loading = false;
      }
    },
    generatePage() {
      this.tableDataPage = this.tableData.slice(
        this.pageSize * (this.currentPage - 1),
        this.pageSize * this.currentPage
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.line {
  text-align: center;
}
</style>