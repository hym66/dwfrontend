import Vue from 'vue'
import $ from 'jquery'

//kanban组件
import vueKanban from 'vue-kanban'
Vue.use(vueKanban)

// 引用高德地图组件 main.js
import VueAMap from 'vue-amap';
Vue.use(VueAMap);

//引入iconfont
import '@/assets/css/icon/iconfont.css'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//引入V-chart
import VCharts from 'v-charts'
Vue.use(VCharts)


//初始化
VueAMap.initAMapApiLoader({
  key: 'b3547a696798898bc4082f7cc064543a',
  plugin: [
    ' AMap.Geolocation ',  //定位空间，用来获取和展示用户主机所在的经纬度位置
    ' AMap.Autocomplete ',  //输入提示插件
    ' AMap.PlaceSearch ', //POI搜索插件
    ' AMap.Scale ',   //右下角缩略图插件，比例尺
    ' AMap.OverView ', //地图鹰眼插件
    ' AMap.ToolBar ',  //地图工具条
    ' AMap.MapType ',  //类别切换空间，实现默认图层与卫星图，实施交通层之间切换的控制
    ' AMap.PolyEditor ', //编辑 折线多边形
    ' AMap.CircleEditor ',
    "AMap.Geocoder",     //地图编码

    'AMap.MarkerClusterer',

  ],
});

window._AMapSecurityConfig = {
  securityJsCode: '26ffb3338c51da6e748b4bdecc911e15',
}


//全局样式
import './assets/css/global.css'
//chat box
import LemonIMUI from 'lemon-imui'
import 'lemon-imui/dist/index.css';
Vue.use(LemonIMUI)

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import './styles/element-variables.scss'

import App from './App.vue'
import store from './store'
import router from './router'
import animated from "animate.css"
import '@/icons' // icon
import '@/permission' // permission control
//--------------------
//-------------------
Vue.use(animated)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  $,
  render: h => h(App)
})
