import Vue from 'vue'
import App from './App.vue'
import { upload,alert } from 'element-ui'
import http from 'axios'
import store from './store/index'
Vue.config.productionTip = false
Vue.use(upload)
Vue.use(alert)

// 按需引入Element-ui
import {
  Button, Container, Header, Main, Footer, Aside, Menu, Submenu, MenuItem, MenuItemGroup,
  Dropdown, DropdownMenu, DropdownItem, Row, Col, Card, MessageBox, Dialog, Steps, Step,
  Form, FormItem, Input, Select, Checkbox, Radio, Switch, DatePicker, TimePicker,
  Tabs, TabPane, Table, TableColumn, Descriptions, DescriptionsItem, Icon, Tooltip, Alert, Tag,
  Option, Avatar, Image, Skeleton, Divider, Calendar, Carousel, CarouselItem, Rate, Autocomplete, Popover, Pagination,
  Badge, Upload, CollapseItem, Collapse, Loading, RadioGroup, RadioButton, Cascader, CascaderPanel
} from 'element-ui'

new Vue({
  store,//Vuex注册
  render: h => h(App),
}).$mount('#app')
//全局baseURL
//http.defaults.baseURL = "http://127.0.0.1:8000"
//注册axios
Vue.prototype.$http = http
Vue.prototype.$message = Message;

//注册使用ElementUI
Vue.use(CascaderPanel)
Vue.use(Cascader)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Button);
Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Aside);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Dialog);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Switch);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Descriptions);
Vue.use(DescriptionsItem);
Vue.use(Icon);
Vue.use(Tooltip);
Vue.use(Alert);
Vue.use(Tag);
Vue.use(Option);
Vue.use(Avatar);
Vue.use(Image);
Vue.use(Skeleton);
Vue.use(Divider);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Calendar);
Vue.use(Rate);
Vue.use(Autocomplete);
Vue.use(Popover);
Vue.use(Pagination);
Vue.use(Badge);
Vue.use(Upload);
Vue.use(CollapseItem);
Vue.use(Collapse);

// import Axios from 'axios'
// Axios.defaults.baseURL = '/'
