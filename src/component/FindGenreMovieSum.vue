<template>
  <div>
    <h1>FindGenreMovieSum</h1>
    <p>
      <label>genreTitle:</label>
      <input v-model="genreTitle" placeholder="要查询的种类名称，测试时可输入Action" style="width: 400px" />
    </p>
    <p>
      <button @click="submit">Submit</button>
    </p>
    <p>time:{{ time }}</p>
    <p>data:<br></p>
    <ul>
      <li v-for="item in data" :key="item.id">
        {{ item.genre.name }} - {{ item.actor.name }}
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      data: [],
      time: 0,
      genreTitle: '',
    };
  },
  methods: {
    submit() {
      axios
        .get('/api/neo4j/findGenreMovieSum', {
          params: {
            genreTitle: this.genreTitle,
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