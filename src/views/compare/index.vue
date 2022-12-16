
<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-form>
          <el-form-item label="简单查询">
            <el-main
              v-loading="loading1"
              element-loading-text="正在向后端进行查询"
            >
              <el-button @click="simpleQuery()">查询所有评分在4.5以上的电影信息</el-button>
            </el-main>
          </el-form-item>
          <el-form-item label="总量查询">
            <el-main
              v-loading="loading2"
              element-loading-text="正在向后端进行查询"
            >
              <el-button @click="sumQuery()">查询分类为Action的电影数目</el-button>
            </el-main>
          </el-form-item>
          <el-form-item label="关系查询">
            <el-main
              v-loading="loading3"
              element-loading-text="正在向后端进行查询"
            >
              <el-button @click="relationQuery()">查询经常合作的导演和演员</el-button>
            </el-main>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="1">
        <el-divider direction="vertical" />
      </el-col>

      <el-col :span="10">
        <div>
          <ve-histogram
            class="myve"
            :data="chartData"
            :settings="vchartsConfig.setting"
            :extend="vchartsConfig.extend"
            width="25vw"
          />
        </div>

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
      isSubmit: false,
      loading1: false,
      loading2: false,
      loading3: false,
      form: {
        name: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        category: '',
        movieDirectors: [],
        movieMainActors: [],
        movieActors: [],
        actorName: '',
        movieMinScore: 0,
        movieMaxScore: 5.0,
        movieDate: [],
        positive: 0,
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
            text: '性能比较查询',
            // textAlign:'center',
          },
          // 图标顶部的标题及按钮
          legend: {
            show: false,
          },
          // backgroundColor:'red',//整个组件的背景颜色
          //X轴线
          xAxis: {
            // name: "地区",
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
    mysqlSimpleRequest () {
      return Axios({
        url: '/mysql/getGreaterMovie',
        method: 'get',
        params: {
          minScore: 4.5
        }
      })
    },

    sparkSimpleRequest () {
      return Axios({
        url: '/spark/getGreaterMovie',
        method: 'get',
        params: {
          minScore: 4.5
        }
      })
    },

    neo4jSimpleRequest () {
      return Axios({
        url: '/neo4j/findGreaterMovie',
        method: 'get',
        params: {
          minScore: 4.5
        }
      })
    },

    mysqlSumRequest () {
      return Axios({
        url: '/mysql/getGenreMovieNum',
        method: 'get',
        params: {
          genreTitle: 'Action'
        }
      })
    },
    simpleSumRequest () {

    },
    neo4jSumRequest () {
      return Axios({
        url: '/neo4j/findGenreMovieSum',
        method: 'get',
        params: {
          genreTitle: 'Action'
        }
      })
    },

    mysqlRelationRequest () {
      return Axios({
        url: '/mysql/getOftenActorDirector',
        method: 'get',
      })
    },
    sparkRelationRequest () {

    },
    neo4jRelationRequest () {
      return Axios({
        url: '/neo4j/findOftenActorDirector',
        method: 'get',
      })
    },

    //向三个数据库发起简单查询
    simpleQuery () {
      this.loading1 = true;
      Axios.all([this.mysqlSimpleRequest(), this.neo4jSimpleRequest()])
        .then(Axios.spread((res0, res1) => {
          console.log(res0, res1)
          this.chartData.rows[0].speed = res0.data.time;
          this.chartData.rows[1].speed = res1.data.time;
          // this.chartData.rows[2].speed = res2.time;
          this.loading1 = false;
        }))
        .catch((err) => {
          console.log(err);
          this.loading1 = false;
        })
    },
    sumQuery () {
      this.loading2 = true;
      Axios.all([this.mysqlSumRequest(), this.neo4jSumRequest()])
        .then(Axios.spread((res0, res1) => {
          console.log(res0, res1)
          this.chartData.rows[0].speed = res0.data.time;
          this.chartData.rows[1].speed = res1.data.time;
          // this.chartData.rows[2].speed = res2.time;
          this.loading2 = false;
        }))
        .catch((err) => {
          console.log(err);
          this.loading2 = false;
        })
    },
    relationQuery () {
      this.loading3 = true;
      Axios.all([this.mysqlRelationRequest(), this.neo4jRelationRequest()])
        .then(Axios.spread((res0, res1) => {
          console.log(res0, res1)
          this.chartData.rows[0].speed = res0.data.time;
          this.chartData.rows[1].speed = res1.data.time;
          // this.chartData.rows[2].speed = res2.time;
          this.loading3 = false;
        }))
        .catch((err) => {
          console.log(err);
          this.loading3 = false;
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
