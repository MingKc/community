import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Health from '../components/Health/Health.vue'
import Estimate from '../components/Health/Estimate.vue'
import History from '../components/Health/History.vue'
import Food from '../components/Food/Food.vue'
import Order from '../components/Order/Order.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { 
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/health', component: Health },
            { path: '/estimate', component: Estimate },
            { path: '/History', component: History },
            { path: '/food', component: Food },
            { path: '/order', component: Order }
    ]}
  ]
})

// 挂载路由导航守卫
router.beforeEach(function (to, from, next) {
  // to: 访问路径   from: 从哪里跳转来
  // next()是一个函数 next(): 放行   next('/login'): 强制跳转
  const token = window.sessionStorage.getItem('token')
  if (!token && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router
