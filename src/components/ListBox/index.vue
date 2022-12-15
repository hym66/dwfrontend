<template>
  <div>
    <h1>{{title}}</h1>
    <el-main
      v-loading="loading"
      element-loading-text="正在向后端进行查询"
    >

      <el-form
        ref="form"
        label-width="200px"
        :v-loading="loading"
      >

        <el-form-item>
          <div
            slot="label"
            v-if="inputLabel1!=null"
          >
            {{inputLabel1}}
          </div>
          <el-input
            v-if="inputLabel1!=null"
            v-model="input1"
            placeholder="请输入查询内容"
            style="width:400px"
          />
          <br v-if="inputLabel2!=null">
          <div
            slot="label"
            v-if="inputLabel2!=null"
          >
            {{inputLabel2}}
          </div>
          <el-input
            v-if="inputLabel2!=null"
            v-model="input2"
            placeholder="请输入查询内容"
            style="width:400px;"
          />
          <el-button @click="submit()">提交</el-button>
        </el-form-item>

        <el-form-item
          v-if="isSubmit==true"
          label="查询时间"
        >
          {{ time }}ms
        </el-form-item>

        <el-form-item
          v-if="isSubmit==true"
          label="总条数"
        >
          <span v-if="data!=null">{{ data.length }}</span>
          <span v-else>{{ 0 }}</span>
        </el-form-item>

        <el-form-item v-if="isSubmit==true">
          <table>
            <tr>
              <th>{{outputLabel1}}</th>
              <th>{{outputLabel2}}</th>
              <th>{{outputLabel3}}</th>
            </tr>

            <tr
              v-for="item in data"
              :key="item.id"
            >
              <td v-if="attr1_0==null && attr2_0==null && attr3_0==null">
                {{item}}</td>

              <td v-if="attr1_0!=null&&attr1_1==null">{{ item[attr1_0] }}</td>
              <td v-else-if="attr1_1!=null">{{ item[attr1_0][attr1_1] }}</td>

              <td v-if="attr2_0!=null&&attr2_1==null">{{ item[attr2_0] }}</td>
              <td v-else-if="attr2_1!=null">{{ item[attr2_0][attr2_1] }}</td>

              <td v-if="attr3_0!=null&&attr3_1==null">{{ item[attr3_0] }}</td>
              <td v-else-if="attr3_1!=null">{{ item[attr3_0][attr3_1] }}</td>
            </tr>
          </table>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';

export default {
  name: "DecimalBox",
  data () {
    return {
      data: [],
      time: 0,
      input1: '',
      input2: '',
      isSubmit: false,
      loading: false,
    };
  },
  props: ['title', 'url', 'inputLabel1', 'inputLabel2',
    'param1', 'param2',
    'outputLabel1', 'outputLabel2', 'outputLabel3',
    'attr1_0', 'attr1_1', 'attr2_0', 'attr2_1', 'attr3_0', 'attr3_1'],
  methods: {
    submit () {
      this.loading = true;
      let myParams = {}
      if (this.param1 != null)
        myParams[this.param1] = this.input1;
      if (this.param2 != null)
        myParams[this.param2] = this.input2;
      axios
        .get(this.url, {
          params: myParams
        })
        .then((res) => {
          console.log(res)
          this.data = res.data.data;
          this.time = res.data.time;
          this.isSubmit = true;
          this.loading = false;
          this.$message({
            type: 'success',
            message: "查询成功！"
          })
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$message({
            type: 'danger',
            message: "查询失败"
          })
        });
    },
  },
  mounted () {
    //解析三个属性

  }
};
</script>