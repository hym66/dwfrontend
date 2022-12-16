<template>
  <div>
    
    <el-pagination
      style="text-align: center"
      :page-size="1"
      layout="total, prev, pager, next"
      :total="3"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <el-card v-if="currentPage === 1">
      <h1 style="text-align: center">图数据库查询</h1>

      <DecimalBox url='/neo4j/findDirectorMovieNum' title="图数据库：查询某导演执导过的电影数量"
      inputLabel1="导演名字" param1="directorName"
      outputLabel="执导过的电影数量"/>

      <DecimalBox url='/neo4j/findActorMovieNum' title="图数据库：查询某演员参演过的电影数量"
      inputLabel1="演员名字" param1="actorName"
      outputLabel="执导过的电影数量"/>

      <DecimalBox url='/neo4j/findStarMovieNum' title="图数据库：查询某演员参演过的电影数量"
      inputLabel1="演员名字" param1="starName"
      outputLabel="执导过的电影数量"/>

      <ListBox url='/neo4j/findActorMatchGenre' title="图数据库：查询适合某类型的演员组合" 
      inputLabel1="电影类型名称" inputLabel2="演员组合人数"
      param1="genreTitle" param2="personNum"

      outputLabel1="演员名" outputLabel2="电影类型名称" outputLabel3="该演员参演该类型电影获得的总评论数"
      attr1_0="actor" attr1_1="name"
      attr2_0="genre" attr2_1="name"
      attr3_0="playGenreCommentSum"/>

      <DecimalBox url='/neo4j/findGenreMovieSum' title="图数据库：查询某个种类的电影数"
      inputLabel1="电影种类" param1="genreTitle"
      outputLabel="该种类的电影数量"/>

      <!-- <ListBox url='/neo4j/findOftenActorActor' title="图数据库：查询经常合作的演员" 
      outputLabel1="演员名1" outputLabel2="演员名2" outputLabel3="合作次数"
      attr1_0="startPerson" attr1_1="name"
      attr2_0="endPerson" attr2_1="name"
      attr3_0="cooperateNum"/> -->

      <ListBox url='/neo4j/findOftenActorDirector' title="图数据库：查询经常合作的演员和导演" 
      outputLabel1="演员名" outputLabel2="导演名" outputLabel3="合作次数"
      attr1_0="startPerson" attr1_1="name"
      attr2_0="endPerson" attr2_1="name"
      attr3_0="cooperateNum"/>

 
    </el-card>
    <el-card v-else-if="currentPage === 2">
      <h1 style="text-align: center">关系型数据库查询</h1>
      <DecimalBox url='/mysql/getActorMovieNum' title="关系型数据库：获取某个演员主演过的电影数量" 
      inputLabel1="演员名字"
      param1="actorName"
      outputLabel="主演过的电影数"
      attr1_0="starMovieNum" />

      <DecimalBox url='/mysql/getActorMovieNum' title="关系型数据库：获取某个演员参演过的电影数量" 
      inputLabel1="演员名字"
      param1="actorName"
      outputLabel="参演过的电影数"
      attr1_0="actMovieNum" />

      <DecimalBox url='/mysql/getDirectorMovieNum' title="关系型数据库：获取某个导演执导过的电影数量" 
      inputLabel1="导演名字"
      param1="directorName"
      outputLabel="执导过的电影数" />

      <DecimalBox url='/mysql/getGenreMovieNum' title="关系型数据库：获取某个类型的电影数量"
      inputLabel1="电影类型名称"
      param1="genreTitle"
      outputLabel="该类型的电影数" />

      <ListBox url='/mysql/getGreaterMovie' title="关系型数据库：获取xx评分以上的所有电影"
      inputLabel1="评分下限" param1="minScore"
      outputLabel1="电影ID" attr1_0="movieId"
      outputLabel2="电影名称" attr2_0="movieTitle"
      outputLabel3="电影评分" attr3_0="score"/>

      <DecimalBox url='/mysql/getYearReleaseNum' title="关系型数据库：获取指定年份的电影数量"
      inputLabel1="年份" param1="year"
      outputLabel="该年的电影数量" />

      <DecimalBox url='/mysql/getMonthReleaseNum' title="关系型数据库：获取指定月份的电影数量"
      inputLabel1="年份" param1="year"
      inputLabel2="月份" param2="month"
      outputLabel="该月份的电影数量" />

      <DecimalBox url='/mysql/getSeasonReleaseNum' title="关系型数据库：获取指定季度的电影数量"
      inputLabel1="年份" param1="year"
      inputLabel2="季度" param2="season"
      outputLabel="该季度的电影数量" />

      <!-- 待检查 -->
      <ListBox url='/mysql/getOftenActorDirector' title="关系型数据库：获取经常合作的导演和演员组合"
      outputLabel1="导演名" attr1_0="directorName"
      outputLabel2="演员名" attr2_0="actorName"
      outputLabel3="合作次数" attr3_0="cooperateNum" />

      <!--todo-->
      <!--查找有正面评价的所有电影名-->
      <ListBox url='/mysql/getPositiveMovie' title="关系型数据库：获取有正面评价的所有电影"
      outputLabel1="电影ID" attr1_0="movieId"
      outputLabel2="电影名" attr2_0="movieTitle"/>

      <DecimalBox url='/mysql/getProductNumByMovieId' title="关系型数据库：获取指定电影的版本数量"
      inputLabel1="电影ID" param1="movieId"
      outputLabel="该电影的版本数" />

      <ListBox url='/mysql/getSource' title="关系型数据库：溯源查询"
      inputLabel1="电影ID" param1="movieId"
      outputLabel1="产品ID" attr1_0="productId"
      outputLabel2="来源的平台" attr2_0="source"
      outputLabel3="URL" attr3_0="url" />



    </el-card>
    <el-card v-else-if="currentPage === 3">
      <h1 style="text-align: center">分布式数据库查询</h1>
    </el-card>

  </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios'
import DecimalBox from '@/components/DecimalBox';
import ListBox from '@/components/ListBox'
export default {
  name: 'Requests',
  components: { DecimalBox, ListBox },
  data () {
    return {
      currentPage: 1,
    }
  },
  methods: {
    handleCurrentChange (page) {
        this.currentPage = page;
    }
  },
  mounted(){

  }

}


</script>
<style lang="less" scoped>
.title {
  color: red;
  text-align: center;
}
</style>