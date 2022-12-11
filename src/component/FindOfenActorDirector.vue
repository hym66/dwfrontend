<template>
    <div>
      <h1>FindOfenActorDirector</h1>
      <p>
        <button @click="load">Load</button>
      </p>
      <p>time:{{ time }}</p>
      <p>data:<br></p>
      <table>
      <thead>
        <tr>
          <th>StartPerson</th>
          <th>EndPerson</th>
          <th>CooperateNum</th>
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
        time: 0
      };
    },
    methods: {
      load() {
        axios
          .get('/neo4j/findOfenActorDirector', {
            params: {},
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
    }
  
    th, td {
      border: 1px solid #ccc;
      padding: 8px;
    }
  
  </style>