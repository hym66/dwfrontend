<!-- <template>
  <div>
    <h1 class="title">前端页面代码</h1>
    <div>
      <FAMG />
      <FAMN />
      <FDMN />
      <FGMS />
    </div>
    <div>
      <h1 class="title">前端页面代码</h1>
      <FMBI />
      <FOAA />
      <FOAD />
      <FSMN />
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios'
import FAMG from './component/FindActorMatchGenre.vue';
import FAMN from './component/FindActorMovieNum.vue';
import FDMN from './component/FindDirectorMovieNum.vue';
import FGMS from './component/FindGenreMovieSum.vue';
import FMBI from './component/FindMovieById.vue';
import FOAA from './component/FindOfenActorActor.vue';
import FOAD from './component/FindOfenActorDirector.vue';
import FSMN from './component/FindStarMovieNum.vue';
export default {
  name: 'App',
  components: {
    FAMG,
    FAMN,
    FDMN,
    FGMS,
    FMBI,
    FOAA,
    FOAD,
    FSMN,
  },
  data () {
    return {

    }
  },
  methods: {

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
</style> -->

<template>
  <div>
    <h1 style="text-align: center; color: red">前端页面代码</h1>
    <el-pagination
      style="text-align: center"
      :page-size="2"
      layout="total, prev, pager, next"
      :total="8"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <el-card v-if="currentPage === 1">
      <FAMG />
      <FAMN />
    </el-card>
    <el-card v-else-if="currentPage === 2">
      <FDMN />
      <FGMS />
    </el-card>
    <el-card v-else-if="currentPage === 3">
      <FMBI />
      <FOAA />
    </el-card>
    <el-card v-else-if="currentPage === 4">
      <FOAD />
      <FSMN />
    </el-card>
  </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios'
import { Pagination } from 'element-ui';
import FAMG from './component/FindActorMatchGenre.vue';
import FAMN from './component/FindActorMovieNum.vue';
import FDMN from './component/FindDirectorMovieNum.vue';
import FGMS from './component/FindGenreMovieSum.vue';
import FMBI from './component/FindMovieById.vue';
import FOAA from './component/FindOfenActorActor.vue';
import FOAD from './component/FindOfenActorDirector.vue';
import FSMN from './component/FindStarMovieNum.vue';
export default {
  name: 'App',
  components: {
    'el-pagination': Pagination,
    FAMG,
    FAMN,
    FDMN,
    FGMS,
    FMBI,
    FOAA,
    FOAD,
    FSMN,
  },
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