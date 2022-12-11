<template>
    <div>
      <h1>FindActorMovieNum</h1>
      <p>
        <label>actorName:</label>
        <input v-model="actorName" placeholder="要查询的参演名字，测试时可输入Madonna" style="width:400px"/>
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
        actorName: '',
      };
    },
    methods: {
      submit() {
        axios
          .get('/neo4j/findActorMovieNum', {
            params: {
              actorName: this.actorName,
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