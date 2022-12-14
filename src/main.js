/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import http from 'axios'
import store from './store/index'
Vue.config.productionTip = false



// // 引入element样式文件
import 'element-ui/lib/theme-chalk/index.css'
// 按需引入Element-ui
import ElementUI from 'element-ui'; // 导入 elementUI
import 'element-ui/lib/theme-chalk/index.css'; // 导入 css
Vue.use(ElementUI);

new Vue({
  el: '#app',
  store,//Vuex注册
  render: h => h(App),
});

//全局baseURL
//http.defaults.baseURL = "http://127.0.0.1:8000"
//注册axios
Vue.prototype.$http = http
Vue.prototype.$message = Message;

Vue.config.productionTip = false

//注册使用ElementUI
