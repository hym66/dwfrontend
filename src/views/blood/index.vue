<template>
  <div class="app-container">
    <el-input
    size="medium" placeholder="输入电影名称进行查询" suffix-icon="el-icon-edit" v-model="searchingTitle"
    style="width:40vh; margin-bottom:10px">
    </el-input>
    <el-button icon="el-icon-search" circle style="margin-left:10px" @click="searchMovieByTitle"></el-button>
    <el-table
      v-loading="loading"
      @row-click="clickRowForConflictMovie"
      element-loading-text="拼命加载中"
      :data="tableData"
      style="width: 100%"
      border
      :stripe="true">
      <el-table-column v-for="(item,index) in tableHeader" 
      :label="item.label" :property="item.property" :key="index" align="center" ></el-table-column>
    </el-table>
    <div class="block">
      <el-pagination style="text-align: center"
        @current-change="handleCurrentChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-count="totalPage - 1"
        layout="prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-dialog title="电影溯源信息" :visible.sync="dialogFlag">
      <div style="text-align: center; font-size: xx-large; margin-bottom: 8px">{{dialogData.movieTitle}}</div>
      <div style="text-align: center; margin-bottom: 8px;">共合并 <span style="font-size: x-large">{{dialogData.versionCount}}</span> 个版本数量的电影,点击表格每一行可访问源网址</div>
      <div style="text-align: center">该电影版本信息来源评论数量共 <span style="font-size: x-large">{{dialogData.commentCount}}</span> 条</div>
      <div style="text-align: left">以下为未合并前的电影数据信息:</div>
      <el-table :data="dialogMovieData" element-loading-text="拼命加载中" @row-click="clickForWebsite" >
        <el-table-column v-for="(item,index) in movieHeader" 
        :label="item.label" :property="item.property" :key="index" align="center" ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { title } from '@/settings';

export default {
  data() {
    return {
      commentHeader:[{label:"评论编号",property:"commentId"},{label:"电影编号",property:"asin"},{label:"评论时间",property:"reviewTime"},
      {label:"评论内容",property:"reviewText"},{label:"评论总结",property:"summary"}],
      
      consolidationHeader:[{label:"电影编号",property:"asin"},{label:"电影名称",property:"movieTitle"},{label:"电影分数",property:"movieScore"},
      {label:"导演",property:"director"},{label:"演员",property:"actor"},{label:"主演",property:"mainActor"},{label:"电影类别",property:"movieCategory"},
      {label:"电影发布时间",property:"movieReleaseDate"},{label:"评论数量",property:"commentNum"},{label:"电影版本数量",property:"asinCount"}],
      
      asinHeader:[{label:"电影编号",property:"asin"}],

      movieHeader:[{label:"电影编号",property:"asin"},{label:"电影名称",property:"movieTitle"},{label:"电影分数",property:"movieScore"},
      {label:"导演",property:"director"},{label:"演员",property:"actor"},{label:"主演",property:"mainActor"},{label:"电影类别",property:"movieCategory"},
      {label:"电影发布时间",property:"movieReleaseDate"},{label:"评论数量",property:"commentNum"}],

      tableHeader:[],

      tableData: [

      ],

      loading : false,
      initialLoading:true,

      totalPage: 0,
      pageSize: 6,
      currentPage: 1,
      currentName:"",

      dataCount: {},

      //dialog
      dialogFlag: false,
      dialogData:[],
      dialogMovieData: [],

      //searching
      searchingTitle: "",

    }
  },
  methods: {
    getComment(currentPage,pageSize){
     var axios = require('axios');
     var config = {
      method: 'get',
      url: 'http://121.5.140.125:8080/traceability/comment',
      params:{'currentPage':currentPage, 'pageSize':pageSize},
      headers: { }
     };
     axios(config).then(response=>{
        console.log(response)
        this.totalPage = response.data.totalPage
        this.tableData = response.data.commentList
        this.loading = false
      }).catch(function (error) {
        console.log(error);
      });
    },
    getMovieTvAsin(currentPage,pageSize){
      var axios = require('axios');
      var config = {
        method: 'get',
        url: 'http://121.5.140.125:8080/traceability/movieTvAsin',
        params:{'currentPage':currentPage, 'pageSize':pageSize},
        headers: { }
      };
      axios(config).then(response=>{
        console.log(response)
        this.totalPage = response.data.totalPage
        this.tableData = response.data.asinList
        this.loading = false
      }).catch(function (error) {
        console.log(error);
      });
    },
    getMissingAsin(currentPage,pageSize){
      var axios = require('axios');
      var config = {
        method: 'get',
        url: 'http://121.5.140.125:8080/traceability/missingAsin',
        params:{'currentPage':currentPage, 'pageSize':pageSize},
        headers: { }
      };
      axios(config).then(response=>{
        console.log(response)
        this.totalPage = response.data.totalPage
        this.tableData = response.data.missingMovieAsin
        this.loading = false
      }).catch(function (error) {
        console.log(error);
      });
    },
    getMovie(currentPage,pageSize){
      var axios = require('axios');
      var config = {
        method: 'get',
        url: 'http://121.5.140.125:8080/traceability/movie',
        params:{'currentPage':currentPage, 'pageSize':pageSize},
        headers: { }
      };
      axios(config).then(response=>{
        console.log(response)
        this.totalPage = response.data.totalPage
        this.tableData = response.data.movieList
        this.loading = false
        console.log(this.tableData)
      }).catch(function (error) {
        console.log(error);
      });
    },
    getConflictConsolidationMovie(currentPage, pageSize){
      var axios = require('axios');
      var config = {
        method: 'get',
        url: 'http://121.5.140.125:8080/traceability/consolidationMovie/conflict',
        params:{'currentPage':currentPage, 'pageSize':pageSize},
        headers: { }
      };
      axios(config).then(response=>{
        console.log(response)
        this.totalPage = response.data.totalPage
        this.tableData = response.data.consolidationMovieList
        this.loading = false
      }).catch(function (error) {
        console.log(error);
      });
    },
    getNoConflictConsolidationMovie(currentPage, pageSize){
      var axios = require('axios');
      var config = {
        method: 'get',
        url: 'http://121.5.140.125:8080/traceability/consolidationMovie/no-conflict',
        params:{'currentPage':currentPage, 'pageSize':pageSize},
        headers: { }
      };
      axios(config).then(response=>{
        console.log(response)
        this.totalPage = response.data.totalPage
        this.tableData = response.data.consolidationMovieList
        this.loading = false
      }).catch(function (error) {
        console.log(error);
      });
    },
    getTvAsin(currentPage,pageSize){
      var axios = require('axios');
      var config = {
        method: 'get',
        url: 'http://121.5.140.125:8080/traceability/tvAsin',
        params:{'currentPage':currentPage, 'pageSize':pageSize},
        headers: { }
      };
      axios(config).then(response=>{
        console.log(response)
        this.totalPage = response.data.totalPage
        this.tableData = response.data.tvAsinList
        this.loading = false
      }).catch(function (error) {
        console.log(error);
      });
    },
    getTotalCount(){
      var axios = require('axios');
      var config = {
        method: 'get',
        url: 'http://121.5.140.125:8080/traceability/totalCount',
        headers: { }
      };
      axios(config).then(response=>{
        
        this.dataCount = response.data 
        this.createChart()
        this.initialLoading=false;
      }).catch(function (error) {
        console.log(error);
      });
    },
    getMovieByTitle(currentPage,pageSize,title){
      var axios = require('axios');
      var config = {
      method: 'get',
      url: 'http://121.5.140.125:8080/traceability/searchingMovie',
      params:{'title':title, 'currentPage':currentPage, 'pageSize':pageSize},
      headers: { }
      };
      axios(config).then(response=>{
        console.log(response)
        this.totalPage = response.data.totalPage
        this.tableData = response.data.consolidationMovieList
        this.loading = false
      }).catch(function (error) {
        console.log(error);
      });
    },
    createChart(){
      let myChart = this.$echarts.init(document.getElementById('myChart'))

      let option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        
      series: {
        type: 'sankey',
        layout: 'none',
        emphasis: {
          focus: 'adjacency'
        },
        selectedMode:"single",
        select:{
          show:true,
          position:'top',
        },
        lineStyle: {
          color: 'source',
          curveness: 0.5
        },
        data: [
          {
            name: '评论数据'
          },
          {
            name: 'Amazon数据'
          },
          {
            name: '404数据'
          },
          {
            name: '电影数据'
          },
          {
            name: '非电影数据'
          },
          {
            name:"合并后不存在冲突数据"
          },
          {
            name:"合并后存在冲突数据"
          }
        ],
        links: [
          {
            source: '评论数据',
            target: 'Amazon数据',
            value: this.dataCount["movieTvAsinCount"]
          },
          {
            source: '评论数据',
            target: '404数据',
            value: this.dataCount["missingAsinCount"]
          },
          {
            source: 'Amazon数据',
            target: '电影数据',
            value: this.dataCount["movieCount"]
          },
          {
            source: 'Amazon数据',
            target: '非电影数据',
            value: this.dataCount["tvAsinCount"]
          },
          {
            source: '电影数据',
            target: '合并后存在冲突数据',
            value: this.dataCount["conflictConsolidationMovieCount"]
          },
          {
            source: '电影数据',
            target: '合并后不存在冲突数据',
            value: this.dataCount["noConflictConsolidationMovieCount"]
          },
        ]
      }
    }
      // 绘制图表
      myChart.setOption(option);
      console.log("初始化点击事件")

      myChart.on('click',param=>{
        console.log(param)
        this.currentName = param.data["name"]
        this.searchingTitle = "" 
        if(this.currentPage == 1){
          this.getData(this.currentPage - 1,this.pageSize)
        }
        else{
          this.currentPage = 1
        }
      })
    },
    getData(currentPage,pageSize,title){
      
      if(this.currentName==="评论数据"){
        this.loading = true;
        this.tableHeader = this.commentHeader;
        this.getComment(currentPage,pageSize)
      }else if(this.currentName === "Amazon数据"){
        this.loading = true;
        this.tableHeader = this.asinHeader;
        this.getMovieTvAsin(currentPage,pageSize)
      }else if(this.currentName === "404数据"){
        this.loading = true;
        this.tableHeader = this.asinHeader;
        this.getMissingAsin(currentPage,pageSize)
      }else if(this.currentName === "电影数据"){
        this.loading = true;
        this.tableHeader = this.movieHeader;
        this.getMovie(currentPage,pageSize)
      }else if(this.currentName === "非电影数据"){
        this.loading = true;
        this.tableHeader = this.asinHeader;
        this.getTvAsin(currentPage,pageSize)
      }else if(this.currentName === "合并后存在冲突数据"){
        this.loading = true;
        this.tableHeader = this.consolidationHeader;
        this.getConflictConsolidationMovie(currentPage,pageSize);
      }else if(this.currentName === "合并后不存在冲突数据"){
        this.loading = true;
        this.tableHeader = this.consolidationHeader;
        this.getNoConflictConsolidationMovie(currentPage,pageSize);
      }else if(this.currentName === "模糊搜索"){
        this.loading = true;
        this.tableHeader = this.consolidationHeader;
        this.getMovieByTitle(currentPage,pageSize,title);
      }
    },
    handleCurrentChange(val){
      this.currentPage = val
    },
    handlePrevClick(val){
      this.currentPage = val
    },
    handleNextClick(val){
      this.currentPage = val
    },
    clickRowForConflictMovie(row, event, column){

      if (this.tableHeader === this.consolidationHeader && row["asinCount"] !== 1){
        console.log(row["asin"]);
        //首先调用获得冲突信息 
        //展示dialog
        var axios = require('axios');
        var config = {
          method: 'get',
          url: 'http://121.5.140.125:8080/traceability/conflictInfo',
          params:{"asin":row["asin"]},
          headers: { }
        };
        axios(config).then(response=>{
        
          this.dialogData = response.data;
          this.dialogMovieData = this.dialogData.movieList; 
          this.dialogData["movieTitle"] = row["movieTitle"];
          this.dialogData["movieInfo"] = row
          this.dialogFlag = true
        }).catch(function (error) {
          console.log(error);
        });
      }
      else{
        let curAsin = row["asin"]
        window.open("https:www.amazon.com/dp/"+curAsin);
      }
    },
    clickForWebsite(row, event, column){
      let curAsin = row["asin"]
      window.open("https:www.amazon.com/dp/"+curAsin);
    },
    searchMovieByTitle(){

      if(this.searchingTitle == ""){
        //不为空
        return;
      }
      this.currentName = "模糊搜索"      
      if(this.currentPage == 1){
        this.getData(this.currentPage - 1,this.pageSize, this.searchingTitle)
      }else{
        this.currentPage = 1;
      }
    }
  },
  created(){
    //获得图表中数据的值
    this.getTotalCount()
  },
  watch:{
    currentPage(val,oldVal){
      if(this.currentName === "模糊搜索"){
        this.getData(val-1,this.pageSize,this.searchingTitle)
      }else{
        this.getData(val-1,this.pageSize)
      }
      

    }
    
  },
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

