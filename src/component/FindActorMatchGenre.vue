<template>
  <div>
    <h1>FindActorMatchGenre</h1>
    <p>
      <label>genreTitle:</label>
      <input v-model="genreTitle" placeholder="要查询的电影类型名称，测试时可输入Action" />
    </p>
    <p>
      <label>personNum:</label>
      <input v-model="personNum" type="number" placeholder="要查询的演员组合人数" />
    </p>
    <p>
      <button @click="submit">Submit</button>
    </p>
    <p>{{ time }}</p>
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
  name: 'MyApp',
  data() {
    return {
      data: [],
      time: 0,
      genreTitle: '',
      personNum: 0,
    };
  },
  methods: {
    submit() {
      axios
        .get('/neo4j/findActorMatchGenre', {
          params: {
            genreTitle: this.genreTitle,
            personNum: this.personNum,
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
