import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
// element-ui
import './plugins/element.js'
// element-ui 样式表
import 'element-ui/lib/theme-chalk/index.css'

// 导入全局样式表
import './assets/css/global.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

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
})
// axios响应拦截器   隐藏进度条NProgress.done()
axios.interceptors.response.use(function (result) {
  NProgress.done()
  const data = result.data
  if(data.meta.msg === '无效token!'){
    alert("登录过期，请重新登录")
    // 清空session
    window.sessionStorage.clear()
    router.push('/login')
  }else{
    return data
  }
})
// 在Vue原型挂载axios
Vue.prototype.axios = axios

// 将富文本编辑器注册成全局可用组件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
