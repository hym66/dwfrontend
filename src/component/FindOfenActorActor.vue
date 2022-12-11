<template>
    <div>
      <h1>FindPersonCooperate</h1>
      <p>
        <button @click="load">Load</button>
      </p>
      <p>time: {{ time }}</p>
      <p>data:</p>
      <table>
        <thead>
          <tr>
            <th>Start Person</th>
            <th>End Person</th>
            <th>Cooperate Num</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td>{{ item.startPerson.name }}</td>
            <td>{{ item.endPerson.name }}</td>
            <td>{{ item.cooperateNum }}</td>
          </tr>
        </tbody>
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
      };
    },
    methods: {
      load() {
        axios
          .get('/neo4j/findOfenActorActor')
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
    table {
      border-collapse: collapse;
    }
  
    th, td {
      border: 1px solid #ccc;
      padding: 8px;
    }
  
  </style>
  