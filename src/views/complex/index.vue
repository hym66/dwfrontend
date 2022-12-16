
<template>
  <div class="app-container">
    <el-button @click="complexQuery()">测试按钮</el-button>
    <el-row>
      <el-col :span="12">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          style="padding-top: 10vh;"
        >
          <el-form-item label="电影名称">
            <el-input
              v-model="form.movieTitle"
              :fetch-suggestions="movieSearchSuggest"
              placeholder="请输入内容"
              style="width: 20vw;"
              clearable
              @select="handleSelect"
            />

          </el-form-item>

          <el-row>
            <el-col :span="13">
              <el-form-item label="电影类别">
                <el-input
                  v-model="form.genreTitle"
                  filterable
                  remote
                  clearable
                  placeholder="请输入电影类别"
                  :remote-method="categoryRemoteSearch"
                  :loading="categoryLoading"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="上映时间">
                <el-date-picker
                  v-model="form.dateRange"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="导演">
            <el-tag
              v-for="(tag,index) in form.directorList"
              :key="tag"
              closable
              effect="dark"
              :disable-transitions="false"
              :color="labelColor[index%labelColor.length]"
              style="color: white;"
              :hit="true"
              @close="handleDirectorTagClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="directorInputVisible"
              ref="saveDirectorTagInput"
              v-model="directorInputValue"
              class="input-new-tag"
              size="small"
              :fetch-suggestions="directorSearchSuggest"
              placeholder="请输入内容"
              style="width: 20vw;"
              clearable
              @keyup.enter.native="handleDirectorInputConfirm(true)"
              @select="handleDirectorSelect"
            />

            <el-button
              v-if="!directorInputVisible &&(form.directorList==null || form.directorList.length<5)"
              class="button-new-tag"
              size="small"
              @click="showDirectorInput()"
            >
              添加导演
            </el-button>
          </el-form-item>
          <el-form-item label="主演">
            <el-tag
              v-for="(tag,index) in form.starList"
              :key="tag"
              closable
              effect="dark"
              :disable-transitions="false"
              :color="labelColor[index%labelColor.length]"
              style="color: white;"
              :hit="true"
              @close="handleMainActorTagClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="mainActorInputVisible"
              ref="saveMainActorTagInput"
              v-model="mainActorInputValue"
              class="input-new-tag"
              size="small"
              :fetch-suggestions="actorSearchSuggest"
              placeholder="请输入内容"
              style="width: 20vw;"
              clearable
              @keyup.enter.native="handleMainActorInputConfirm"
              @select="handleMainActorSelect"
            />

            <el-button
              v-if="!mainActorInputVisible && (form.starList == null || form.starList.length<5)"
              class="button-new-tag"
              size="small"
              @click="showMainActorInput()"
            >
              添加主演
            </el-button>
          </el-form-item>

          <el-form-item label="演员">
            <el-tag
              v-for="(tag,index) in form.actorList"
              :key="tag"
              closable
              effect="dark"
              :disable-transitions="false"
              :color="labelColor[index%labelColor.length]"
              style="color: white;"
              :hit="true"
              @close="handleActorTagClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="actorInputVisible"
              ref="saveActorTagInput"
              v-model="actorInputValue"
              class="input-new-tag"
              size="small"
              :fetch-suggestions="actorSearchSuggest"
              placeholder="请输入内容"
              style="width: 20vw;"
              clearable
              @keyup.enter.native="handleActorInputConfirm"
              @select="handleActorSelect"
            />

            <el-button
              v-if="!actorInputVisible && (form.actorList == null || form.actorList.length<5)"
              class="button-new-tag"
              size="small"
              @click="showActorInput()"
            >
              添加演员
            </el-button>
          </el-form-item>

          <el-form-item label="评分">
            <el-input-number
              v-model="form.minScore"
              size="mini"
              :precision="2"
              :step="0.01"
              :max="form.maxScore"
              :min="0"
            />
            至
            <el-input-number
              v-model="form.maxScore"
              size="mini"
              :precision="2"
              :step="0.01"
              :max="5"
              :min="form.minScore"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="complexQuery()"
            >查询</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="1">
        <el-divider direction="vertical" />
      </el-col>
      <el-col :span="10">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="查询结果"
            movieTitle="first"
          >
            <p v-if="hasResult">
              共有{{ movieNumber }}个结果
            </p>
            <el-table
              v-loading="movieLoading"
              height="460"
              border
              stripe
              :data="movieData"
              style="width: 100%"
            >

              <el-table-column
                prop="movieId"
                label="电影ID"
                width="120"
              />
              <el-table-column
                prop="movieTitle"
                label="电影名称"
                width="352"
              />

            </el-table>

          </el-tab-pane>
          <el-tab-pane
            label="速度对比"
            movieTitle="third"
            :disabled="false"
          >

            <ve-histogram
              class="myve"
              :data="chartData"
              :settings="vchartsConfig.setting"
              :extend="vchartsConfig.extend"
              width="38vw"
            />
          </el-tab-pane>
        </el-tabs>

      </el-col>
    </el-row>
    <el-divider />
    <el-row>
      <el-col :span="12">
        <p
          style="margin-left: 3vw;color: #909399;font-size:8rew;font-weight: revert;">
          {{ searchText }}
        </p>
      </el-col>



    </el-row>
  </div>
</template>

<script>
import Axios from 'axios';
import 'echarts/lib/component/title'
/* eslint-disable */
export default {
  filters: {

  },
  data () {
    return {
      hasResult: false,
      form: {
        movieTitle: "Harry Potter",
        genreTitle: null,
        timeRange: [null, null],
        directorList: [],
        starList: [],
        actorList: [],
        minScore: 2.2,
        maxScore: 4.5
      },
      percentageColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      movieLoading: false,
      labelColor: ["#77C9D4", "#57BC90", "#015249"],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近半年',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 182);
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '最近一年',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '最近三年',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 3);
            picker.$emit('pick', [start, end]);
          }
        },
        ]
      },

      // 速度比较图
      vchartsConfig: {
        setting: {
          // 别称
          labelMap: {
            'type': '数据库',
            'software': '软件',
            'speed': '速度',
          },
        },
        extend: {
          title: {
            show: true,
            text: '电影组合查询',
            // textAlign:'center',
          },
          // 图标顶部的标题及按钮
          legend: {
            show: false,
          },
          // backgroundColor:'red',//整个组件的背景颜色
          //X轴线
          xAxis: {
            // movieTitle: "地区",
            type: 'category',
            show: true,
            // 坐标轴轴线
            axisLine: {
              show: false,
            },
            // 坐标轴刻度

            // 坐标轴每项的文字
            axisLabel: {
              showMaxLabel: true,
              showMinLabel: true,
              color: '#3a3a3a',
              rotate: 0, //刻度文字旋转，防止文字过多不显示
              margin: 8,//文字离x轴的距离
              boundaryGap: true,
              // backgroundColor:'#0f0',
              formatter: (v) => {
                // console.log('x--v',v)
                return v
              },
            },
            // X轴下面的刻度小竖线
            axisTick: {
              show: false,
              alignWithLabel: true,//axisLabel.boundaryGap=true时有效
              interval: 0,
              length: 4,//长度
            },
            // x轴对应的竖线
            splitLine: {
              show: false,
              interval: 0,
              lineStyle: {
                color: 'red',
                backgroundColor: 'red',
              }
            }
          },
          yAxis: {
            show: true,
            offset: 0,
            // 坐标轴轴线
            axisLine: {
              show: false,
            },
            // x轴对应的竖线
            splitLine: {
              show: true,
            },
            // 坐标轴刻度
            axisTick: {
              show: false,
            },
            boundaryGap: true,
            axisLabel: {
              color: '#3a3a3a',
              formatter: (v) => {
                if (v == 0) {
                  return v;
                }
                return v + ' ms'
              },
            },

          },

          // 滚动组件参数
          dataZoom: [
            {
              type: 'inside',
              show: true,
              xAxisIndex: [0],
              startValue: 0,
              endValue: 4,
              zoomLock: true,//阻止区域缩放
            }
          ],



          // 每个柱子
          series (v) {
            // console.log("v", v);
            // 设置柱子的样式
            v.forEach(i => {
              console.log("series", i);
              i.barWidth = 30;
              i.itemStyle = {
                barBorderRadius: [15, 15, 0, 0],
                borderWidth: 20,
              };
              i.label = {
                color: '#666',
                show: true,
                position: 'top',
                // backgroundColor:'yellow',
              };

            });
            return v;
          },
        }
      },
      // v-chats列表数据
      chartData: {
        columns: ["type", "speed"],
        rows: [
          { "type": "关系型数据库", "software": "mysql", "speed": 0 },
          { "type": "分布式数据库", "software": "hive", "speed": 0 },
          { "type": "图数据库", "software": "neo4j", "speed": 0 },
        ],
      },

      directorInputVisible: false,
      directorInputValue: '',
      mainActorInputVisible: false,
      mainActorInputValue: '',
      actorInputVisible: false,
      actorInputValue: '',
      activeName: 'first',
      searchText: '暂无查询',
      BASE_URL: 'http://localhost:8101',
      HIVE_BASE_URL: 'http://localhost:8102',
      movieData: [],

      categoryLoading: false,
      movieCategory: [],
      movieNumber: 0,

      relationReady: false,
      distributeReady: false,
      graphReady: false,
    }
  },
  created () {

  },
  methods: {
    onCancel () {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    handleSelect (item) {
      console.log(item);
    },
    handleDirectorSelect (item) {
      this.handleDirectorInputConfirm(false)
    },
    handleMainActorSelect (item) {
      this.handleMainActorInputConfirm()
    },
    handleActorSelect (item) {
      this.handleActorInputConfirm()
    },
    /**
     * 下面是搜索建议的函数
     **/
    movieSearchSuggest (queryString, cb) {
      var axios = require('axios');

      var config = {
        method: 'get',
        url: this.BASE_URL + '/mysql/association/movie',
        params: { "movieName": queryString },
        headers: {}
      };

      // 向mysql 发送请求
      axios(config)
        .then(response => {
          console.log(response.data)
          var result = []
          for (let i = 0; i < response.data.length; ++i) {
            result.push({ "value": response.data[i] })
          }
          cb(result);
        })
        .catch(function (error) {
          this.$message.error('当前网络异常，请稍后再试');
        });
    },
    directorSearchSuggest (queryString, cb) {
      var axios = require('axios');

      var config = {
        method: 'get',
        url: this.BASE_URL + '/mysql/association/director',
        params: { "directorName": queryString },
        headers: {}
      };

      // 向mysql 发送请求
      axios(config)
        .then(response => {
          var result = []
          for (let i = response.data.length - 1; i >= 0; --i) {
            if (result.length >= 25) {
              break
            }
            result.push({ "value": response.data[i] })
          }
          cb(result);
        })
        .catch(function (error) {
          this.$message.error('当前网络异常，请稍后再试');
        });
    },
    actorSearchSuggest (queryString, cb) {
      var axios = require('axios');

      var config = {
        method: 'get',
        url: this.BASE_URL + '/mysql/association/actor',
        params: { "actorName": queryString },
        headers: {}
      };

      // 向mysql 发送请求
      axios(config)
        .then(response => {
          var result = []
          for (let i = response.data.length - 1; i >= 0; --i) {
            if (result.length >= 25) {
              break
            }
            result.push({ "value": response.data[i] })
          }
          cb(result);
        })
        .catch(function (error) {
          this.$message.error('当前网络异常，请稍后再试');
        });
    },

    categoryRemoteSearch (query) {

      this.categoryLoading = true;
      // 发送api请求
      var axios = require('axios');

      var config = {
        method: 'get',
        url: this.BASE_URL + '/mysql/association/genreTitle',
        params: { "genreTitle": query },
        headers: {}
      };

      // 向mysql 发送请求
      axios(config)
        .then(response => {
          var result = []
          for (let i = response.data.length - 1; i >= 0; --i) {
            if (result.length >= 25) {
              break
            }
            result.push({ "value": response.data[i] })
          }

          this.movieCategory = result;
          this.categoryLoading = false;
        })
        .catch(function (error) {
          this.$message.error('当前网络异常，请稍后再试');
        });
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },

    decrease () {
      this.form.positive = this.form.positive > 0 ? this.form.positive - 1 : this.form.positive
    },
    increase () {
      this.form.positive = this.form.positive < 100 ? this.form.positive + 1 : this.form.positive
    },

    movieDataToString (data) {
      if (data.length == 0) {
        return ""
      }
      var temp = "asin,title,edition,format,time,director,mainActor,actor,score,commentNum\n"
      for (let j = 0; j < data.length; j++) {
        let i = data[j]
        temp += i.asin + ','
        temp += i.title + ','
        if (i.hasOwnProperty("edition")) {
          temp += i.edition + ','
        }
        else {
          temp += ','
        }

        if (i.hasOwnProperty("format")) {
          temp += i.format + ','
        }
        else {
          temp += ','
        }
        if (i.hasOwnProperty("time")) {
          temp += i.time + ','
        }
        else {
          temp += ','
        }
        if (i.director.length != 0) {
          temp += String(i.director) + ','
        }
        else {
          temp += ','
        }
        if (i.mainActor.length != 0) {
          temp += String(i.mainActor) + ','
        }
        else {
          temp += ','
        }
        if (i.actor.length != 0) {
          temp += String(i.actor) + ','
        }
        else {
          temp += ','
        }
        if (i.hasOwnProperty("score")) {
          temp += i.score + ','
        }
        else {
          temp += ','
        }
        if (i.hasOwnProperty("commentNum")) {
          temp += i.commentNum + ','
        }
        else {
          temp += ','
        }
        temp += '\n'
      }
      return temp;
    },

    downloadFile () {
      var blob = new Blob([this.movieDataToString(this.movieData)], { type: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' });
      const url3 = window.URL.createObjectURL(blob);
      var filename = this.searchText + '.csv';
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url3;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    },

    searchMovie () {

      // 清空上一轮查询结果
      this.clearResult();

      // 跳转到查询结果界面
      this.activeName = 'first'

      Date.prototype.format = function (format) {
        var o = {
          "M+": this.getMonth() + 1, //month
          "d+": this.getDate(),    //day
          "h+": this.getHours(),   //hour
          "m+": this.getMinutes(), //minute
          "s+": this.getSeconds(), //second
          "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
          "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(format))
          format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
              ("00" + o[k]).substr(("" + o[k]).length));
        return format;
      }
      var searchText = "查找"
      var searchCondition = {

      }
      if (this.form.movieTitle != "") {
        searchText += " 电影名为" + this.form.movieTitle + ""
        searchCondition.movieName = this.form.movieTitle
      }
      console.log(this.form)
      if (this.form.timeRange != null && this.form.timeRange.length != 0) {
        searchCondition.minYear = this.form.timeRange[0].format("yyyy")
        searchCondition.minMonth = this.form.timeRange[0].format("MM")
        searchCondition.minDay = this.form.timeRange[0].format("dd")
        searchCondition.maxYear = this.form.timeRange[1].format("yyyy")
        searchCondition.maxMonth = this.form.timeRange[1].format("MM")
        searchCondition.maxDay = this.form.timeRange[1].format("dd")
        searchText += " 上映时间在" + searchCondition.minYear + "年"
          + searchCondition.minMonth + "月" + searchCondition.minDay + "日"
          + "到" + searchCondition.maxYear + "年"
          + searchCondition.maxMonth + "月" + searchCondition.maxDay + "日之间"
      }
      if (this.form.genreTitle != "") {
        searchText += " 类别为" + this.form.genreTitle + ""
        searchCondition.genreTitle = this.form.genreTitle
      }
      if (this.form.directorList.length != 0) {
        searchText += " 导演有"
        for (let i = 0; i < this.form.directorList.length; ++i) {
          if (i != 0) {
            searchText += ", "
          }
          searchText += this.form.directorList[i]
        }
        searchCondition.directorNames = this.form.directorList
      }
      if (this.form.starList.length != 0) {
        searchText += " 主演有"
        for (let i = 0; i < this.form.starList.length; ++i) {
          if (i != 0) {
            searchText += ", "
          }
          searchText += this.form.starList[i]
        }
        searchCondition.mainActors = this.form.starList
      }
      if (this.form.actorList.length != 0) {
        searchText += " 演员有"
        for (let i = 0; i < this.form.actorList.length; ++i) {
          if (i != 0) {
            searchText += ", "
          }
          searchText += this.form.actorList[i]
        }
        searchCondition.actors = this.form.actorList
      }

      if (this.form.minScore != 0 || this.form.maxScore != 5) {
        searchCondition.minScore = this.form.minScore
        searchCondition.maxScore = this.form.maxScore
        searchText += " 评分在" + searchCondition.minScore + "到" + searchCondition.maxScore + "之间"
      }

      // if (this.form.positive != 0) {
      //   searchCondition.positive = this.form.positive
      //   searchText += " 正面评价在" + searchCondition.positive + "之上"
      // }
      // 设置参数
      console.log("搜索条件为", searchCondition)

      if (Object.keys(searchCondition).length == 0) {
        this.$message({
          message: '请至少给出一个条件！',
          type: 'warning'
        })
        return
      }
      searchText += " 的电影"
      this.searchText = searchText
      this.vchartsConfig.extend.title.subtext = searchText

      this.relationReady = false
      this.distributeReady = false
      this.graphReady = false

      // 发送api
      var axios = require('axios');

      var config = {
        method: 'post',
        url: this.BASE_URL + '/neo4j/movie',
        data: searchCondition,
        headers: {}
      };
      this.movieLoading = true;


      // 向mysql发送请求，填入请求时间即可
      axios({
        method: 'post',
        url: this.BASE_URL + '/mysql/association/movie/result',
        data: searchCondition,
        headers: {}
      }).then(response => {
        this.chartData.rows[0].speed = response.data.time
        this.relationReady = true
      })

      // 向hive发送请求
      axios({
        method: 'post',
        url: this.HIVE_BASE_URL + '/hive/movie/result',
        data: searchCondition,
        headers: {}
      }).then(response => {
        this.chartData.rows[1].speed = response.data.time
        this.distributeReady = true
      })

      // 向neo4j 发送请求
      axios(config)
        .then(response => {
          this.chartData.rows[2].speed = response.data.time
          this.graphReady = true
          console.log(response.data)
          let movieList = response.data.movies
          this.movieNumber = response.data.movieNum
          for (let i = 0; i < movieList.length; ++i) {
            let newMovie = {}
            newMovie.asin = movieList[i].asin
            newMovie.title = movieList[i].title
            if (movieList[i].hasOwnProperty("edition")) {
              newMovie.edition = movieList[i].edition
            }
            if (movieList[i].hasOwnProperty("format")) {
              newMovie.format = movieList[i].format
            }
            if (movieList[i].hasOwnProperty("score")) {
              newMovie.score = movieList[i].score
            }
            if (movieList[i].hasOwnProperty("commentNum")) {
              newMovie.commentNum = movieList[i].commentNum
            }
            if (movieList[i].hasOwnProperty("positive")) {
              newMovie.positive = movieList[i].positive
            }
            if (movieList[i].hasOwnProperty("negative")) {
              newMovie.negative = movieList[i].negative
            }
            var movieTime = ""
            if (movieList[i].hasOwnProperty("year")) {
              movieTime += movieList[i].year + "年"
            }
            if (movieList[i].hasOwnProperty("month")) {
              movieTime += movieList[i].month + "月"
            }
            if (movieList[i].hasOwnProperty("day")) {
              movieTime += movieList[i].day + "日"
            }
            newMovie.time = movieTime

            this.movieData.push(newMovie)
          }

          this.movieLoading = false;

          // 发送api获取导演信息、主演信息、演员信息
          for (let i = 0; i < this.movieData.length; ++i) {
            axios({
              method: 'get',
              url: this.BASE_URL + '/mysql/association/movie/director',
              params: { "movieAsin": this.movieData[i].asin, "index": i },
              headers: {}
            })
              .then(response => {
                this.movieData[response.data.index].director = response.data.director
              })
            axios({
              method: 'get',
              url: this.BASE_URL + '/mysql/association/movie/mainActor',
              params: { "movieAsin": this.movieData[i].asin, "index": i },
              headers: {}
            })
              .then(response => {
                this.movieData[response.data.index].mainActor = response.data.mainActor
              })
            axios({
              method: 'get',
              url: this.BASE_URL + '/mysql/association/movie/actor',
              params: { "movieAsin": this.movieData[i].asin, "index": i },
              headers: {}
            })
              .then(response => {
                this.movieData[response.data.index].actor = response.data.actor
              })
          }



        })
        .catch(error => {
          this.$message.error('当前网络异常，请稍后再试');
        });

      this.hasResult = true;

    },

    clearResult () {
      this.movieData.splice(0, this.movieData.length)
      this.hasResult = false
      this.movieLoading = false
      for (let i = 0; i < 3; ++i) {
        this.chartData.rows[i].speed = 0
      }
      this.searchText = "暂无查询"

    },

    /**
     * 下面是处理标签的函数
     **/
    showDirectorInput () {
      this.directorInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveDirectorTagInput.$refs.input.focus();
      });
    },

    handleDirectorInputConfirm (showMessage) {
      let inputValue = this.directorInputValue
      // 有效性判断
      if (!inputValue || inputValue.replace(/\s*/g, "").length == 0) {
        if (!this.directorInputVisible) {
          return;
        }
        if (showMessage) {
          this.$message({
            message: '请输入有效的导演名称！',
            type: 'warning'
          })
          this.directorInputVisible = false;
        }

        return;
      }
      this.form.directorList.push(inputValue.replace(/^\s*|\s*$/g, ""));
      this.directorInputVisible = false;
      this.directorInputValue = '';
    },
    handleDirectorTagClose (tag) {
      this.form.directorList.splice(this.form.directorList.indexOf(tag), 1);
    },
    showMainActorInput () {
      this.mainActorInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveMainActorTagInput.$refs.input.focus();
      });
    },
    handleMainActorInputConfirm () {
      let inputValue = this.mainActorInputValue
      // 有效性判断
      if (!inputValue || inputValue.replace(/\s*/g, "").length == 0) {
        if (!this.mainActorInputVisible) {
          return;
        }
        this.$message({
          message: '请输入有效的主演名称！',
          type: 'warning'
        })
        this.mainActorInputVisible = false;
        return;
      }
      this.form.starList.push(inputValue.replace(/^\s*|\s*$/g, ""));
      this.mainActorInputVisible = false;
      this.mainActorInputValue = '';
    },
    handleMainActorTagClose (tag) {
      this.form.starList.splice(this.form.starList.indexOf(tag), 1);
    },

    showActorInput () {
      this.actorInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveActorTagInput.$refs.input.focus();
      });
    },
    handleActorInputConfirm () {
      let inputValue = this.actorInputValue
      // 有效性判断
      if (!inputValue || inputValue.replace(/\s*/g, "").length == 0) {
        if (!this.actorInputVisible) {
          return;
        }
        this.$message({
          message: '请输入有效的演员名称！',
          type: 'warning'
        })
        this.actorInputVisible = false;
        return;
      }
      this.form.actorList.push(inputValue.replace(/^\s*|\s*$/g, ""));
      this.actorInputVisible = false;
      this.actorInputValue = '';
    },
    handleActorTagClose (tag) {
      this.form.actorList.splice(this.form.actorList.indexOf(tag), 1);
    },
    exampleTest () {
      this.form.genreTitle = 'Comedy';
      this.form.minScore = 2.5;
      this.searchMovie();
    },

    getBackendParams () {
      let params = {
        movieTitle: this.form.movieTitle,
        genreTitle: this.form.genreTitle,
        startTime: this.form.timeRange[0],
        endTime: this.form.timeRange[1],
        directorList: this.form.directorList,
        starList: this.form.starList,
        actorList: this.form.actorList,
        minScore: this.form.minScore,
        maxScore: this.form.maxScore
      }
      //把空字符串变成null
      for(let i in params){
        if(params[i] == '' || params == [])
          params[i] = null;
      }
      console.group("传给后端的参数")
      console.log(params)
      console.groupEnd("传给后端的参数")

      return params
    },
    mysqlComplexRequest () {
      return Axios({
        url: '/mysql/getMovieByMovieQuery',
        method: 'get',
        params: this.getBackendParams()
      })
    },
    neo4jComplexRequest () {
      return Axios({
        url: '/neo4j/findComplexMovie',
        method: 'get',
        params: this.getBackendParams()
      })
    },
    complexQuery () {
      Axios.all([this.mysqlComplexRequest(), this.neo4jComplexRequest()])
        .then(Axios.spread((res0, res1) => {
          console.log(res0, res1)
          this.movieData = res0.data.data;
          this.chartData.rows[0].speed = res0.data.time;
          this.chartData.rows[1].speed = res1.data.time;
        }))
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-divider--vertical {
  height: 75vh;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
