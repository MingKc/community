import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
// element-ui
import './plugins/element.js'
// element-ui 样式表
import 'element-ui/lib/theme-chalk/index.css'

// 导入全局样式表
import './assets/css/global.css'

// 导入进度条Nprogress对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 导入axios
import axios from 'axios'
// 配置根路径
axios.defaults.baseURL = 'http://localhost/server/public/index/'

// axios请求拦截器   显示进度条NProgress.start()
axios.interceptors.request.use(function (config) {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, function (error) {
    return Promise.reject(error)
})
// axios响应拦截器   隐藏进度条NProgress.done()
axios.interceptors.response.use(function (result) {
  NProgress.done()
  return result.data
}, function (error) {
    return Promise.reject(error)
})
// 在Vue原型挂载axios
Vue.prototype.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
