<template>
    <div>
      <h1>FindDirectorMovieNum</h1>
      <p>
        <label>directorName:</label>
        <input v-model="directorName" placeholder="要查询的导演名字，测试时可输入Madonna" style="width:400px"/>
      </p>
      <p>
        <button @click="submit">Submit</button>
      </p>
      <p>time:{{ time }}</p>
      <p>data:<br></p>
      <P>{{ data }}</P>
    </div>
  </template>
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        data: 0,
        time: 0,
        directorName: ''
      };
    },
    methods: {
      submit() {
        axios
          .get('/neo4j/findDirectorMovieNum', {
            params: {
              directorName: this.directorName,
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
    ul {
      list-style: none;
    }
  </style>