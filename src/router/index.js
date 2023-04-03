import { createRouter, createWebHistory } from 'vue-router'
import VoyageView from '@/views/Voyage.vue'
import SignupView from '@/views/Signup.vue'
import LoginView from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: '404 Not Found',
      redirect: { name: 'voyage' }
    },
    {
      path:"/voyage",
      name: "voyage",
      component: VoyageView
    },
    {
      path:"/signup",
      name: "signup",
      component: SignupView
    },
    {
      path:"/login",
      name: "login",
      component: LoginView
    }
  ]
})

export default router
