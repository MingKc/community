import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import Estimate from '../components/Health/Estimate.vue'
const Estimate = () => import(/* webpackChunkName: "Estiamte_history" */ '../components/Health/Estimate.vue')
// import History from '../components/Health/History.vue'
const History = () => import(/* webpackChunkName: "Estiamte_history" */ '../components/Health/History.vue')
const Health = () => import(/* webpackChunkName: "Estiamte_history" */ '../components/Health/Health.vue')

// import Food from '../components/Food/Food.vue'
const Food = () => import(/* webpackChunkName: "Food_Foodlist_Addfood" */ '../components/Food/Food.vue')
// import Foodlist from '../components/Food/Foodlist.vue'
const Foodlist = () => import(/* webpackChunkName: "Food_Foodlist_Addfood" */ '../components/Food/Foodlist.vue')
// import Addfood from '../components/Food/Addfood.vue'
const Addfood = () => import(/* webpackChunkName: "Food_Foodlist_Addfood" */ '../components/Food/Addfood.vue')

// import Order from '../components/Order/Order.vue'
const Order = () => import(/* webpackChunkName: "Order" */ '../components/Order/Order.vue')

// import Notice from '../components/Notice/Notice.vue'
const Notice = () => import(/* webpackChunkName: "Notice" */ '../components/Notice/Notice.vue')
// import Desc from '../components/Notice/Desc.vue'
const Desc = () => import(/* webpackChunkName: "Notice" */ '../components/Notice/Desc.vue')
// import NoticeList from '../components/Notice/NoticeList.vue'
const NoticeList = () => import(/* webpackChunkName: "Notice" */ '../components/Notice/NoticeList.vue')
// import Add from '../components/Notice/Add.vue'
const Add = () => import(/* webpackChunkName: "Notice" */ '../components/Notice/Add.vue')

// import Rights from '../components/Authority/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Authority" */ '../components/Authority/Rights.vue')
// import Role from '../components/Authority/Role.vue'
const Role = () => import(/* webpackChunkName: "Authority" */ '../components/Authority/Role.vue')
// import User from '../components/Authority/User.vue'
const User = () => import(/* webpackChunkName: "Authority" */ '../components/Authority/User.vue')

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
            { path: '/estimate', component: Estimate },
            { path: '/health', component: Health },
            { path: '/History', component: History },
            { path: '/food', component: Food },
            { path: '/foodlist', component: Foodlist },
            { path: '/foodlist/add', component: Addfood },
            { path: '/order', component: Order },
            { path: '/notice', component: Notice },
            { path: '/notice/desc', component: Desc },
            { path: '/noticelist', component: NoticeList },
            { path: '/noticelist/add', component: Add },
            { path: '/rights', component: Rights },
            { path: '/role', component: Role },
            { path: '/user', component: User }
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
