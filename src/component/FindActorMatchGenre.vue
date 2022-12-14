<template>
  <div>
    <h1>FindActorMatchGenre</h1>
    <p>
      <label>genreTitle:</label>
      <input v-model="genreTitle" placeholder="要查询的电影类型名称，测试时可输入Action" style="width:400px"/>
    </p>
    <p>
      <label>personNum:</label>
      <input v-model="personNum" type="number" placeholder="要查询的演员组合人数" style="width:400px"/>
    </p>
    <p>
      <button @click="submit">Submit</button>
    </p>
    <p>time:{{ time }}</p>
    <p>data:<br></p>
    <table>
      <tr>
        <th>actor.name</th>
        <th>genre.name</th>
        <th>playGenreCommentSum</th>
      </tr>
      <tr v-for="item in data" :key="item.id">
        <td>{{ item.actor.name }}</td>
        <td>{{ item.genre.name }}</td>
        <td>{{ item.playGenreCommentSum }}</td>
      </tr>
    </table>
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
      personNum: ''
    };
  },
  methods: {
    submit() {
      axios
        .get('/api/neo4j/findActorMatchGenre', {
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
  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    border: 1px solid black;
    text-align: left;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
</style>