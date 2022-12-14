import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import { auth } from '../firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/createPost',
    name: 'createPost',
    component: () => import(/* webpackChunkName: "createPost" */ '../views/CreatePost.vue'),
    meta: {
      requiresAuth: true
    }
  },
  { 
    path: '/userProfile/:userId', 
    name: 'userProfile',
    component: () => import(/* webpackChunkName: "userProfile" */ '../views/UserProfile.vue'), 
    meta: {
      requiresAuth: true
    },
    props: true
  },
  { 
    path: '/postBoard/:postId', 
    name: 'postBoard',
    component: () => import(/* webpackChunkName: "postBoard" */ '../views/PostBoard.vue'), 
    meta: {
      requiresAuth: true
    },
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
