import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'
import Instruments from '../views/Instruments.vue'
import Route from '../views/Route.vue'
import AddRoute from '../views/AddRoute.vue'
import Credits from '../views/Credits.vue'
import FAQ from '../views/FAQ.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/instruments',
      name: 'instruments',
      component: Instruments
    },
    {
      path: '/credits',
      name: 'credits',
      component: Credits
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQ
    },
    {
      path: '/demoroute',
      name: 'demoroute',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DemoRoute.vue')
    },
    {
      path: '/add-route',
      name: 'add-route',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AddRoute
    },
    {
      path: '/route',
      name: 'route',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Route
    },
    {
      path: '/notes',
      name: 'notes',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Notes.vue')
    },
  ]
})

export default router
