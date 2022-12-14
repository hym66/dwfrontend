<template>
    <div>
      <h1>FindStarMovieNum</h1>
      <p>
        <label>starName:</label>
        <input v-model="starName" placeholder="要查询的主演名字，测试时可输入Madonna" style="width:400px"/>
      </p>
      <p>
        <button @click="submit">Submit</button>
      </p>
      <p>time:{{ time }}</p>
      <p>data:<br></p>
      <p>{{ data }}</p>
    </div>
  </template>
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        data: 0,
        time: 0,
        starName: '',
      };
    },
    methods: {
      submit() {
        axios
          .get('/api/neo4j/findStarMovieNum', {
            params: {
              starName: this.starName,
            },
          })
          .then((response) => {
            this.data = response.data.data;
            this.time = response.data.time;
          })
          .catch(() => {
            console.log('request failed');
          });
      },
    },
  };
  </script>
  <style>
    p {
      white-space: pre-wrap;
    }
  </style>