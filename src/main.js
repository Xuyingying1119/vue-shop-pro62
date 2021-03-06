import Vue from 'vue'
import App from './App'
import router from './router'

// 引入global.css全局样式控制文件
import './assets/css/global.css'
// 引入"图标"css样式文件
import './assets/fonts/iconfont.css'
// 引入element-ui组件库模块
import ElementUI from 'element-ui'

// 引入axios并做相关配置
import axios from 'axios'
// 引入 table-tree
import ZkTable from 'vue-table-with-tree-grid'

// 引入nprogress模块
import NProgress from 'nprogress'
// 引入nprpgress模块对应的css样式
import 'nprogress/nprogress.css'
// 注册table-tree
Vue.use(ZkTable)

// axios请求根地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios的请求拦截器(在其中配置token)
axios.interceptors.request.use(
  function(config) {
    // config:代表axios的子级配置对象
    // 设置加载进度条(开始..)
    NProgress.start()
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)
// axios响应拦截器
axios.interceptors.response.use(function (response) {
  // 设置加载进度条(结束..)
  NProgress.done()
  return response;
},function(error) {
  return Promise.reject(error);
});
// 给axios配置给Vue的$http成员
Vue.prototype.$http = axios

// 把element-ui注册给Vue
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
