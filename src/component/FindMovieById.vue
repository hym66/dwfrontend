<template>
    <div>
      <h1>FindMovieById</h1>
      <p>
        <label>movieId:</label>
        <input v-model="movieId" placeholder="要查询的movieID" style="width: 400px" />
      </p>
      <p>
        <button @click="submit">Submit</button>
      </p>
      <p>time: {{ time }}</p>
      <p>data:</p>
      <ul>
        <li>{{ data.movieId }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        data: {},
        time: 0,
        movieId: '',
      };
    },
    methods: {
      submit() {
        axios
          .get('/api/neo4j/findMovieById', {
            params: {
              movieId: this.movieId,
            },
          })
          .then(({ data }) => {
            this.data = data.data;
            this.time = data.time;
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
  