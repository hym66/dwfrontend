<template>
  <div class="dashboard-container">

  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",

};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  &-box {
    // border-style: groove;
    height: auto;
    margin-top: 20px;
    padding: 20px;
  }
  &-boxinsidehor {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
  }
  &-boxinsidever {
    margin-top: 50px;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>
