import { createRouter, createWebHistory } from 'vue-router'
import VoyageView from '@/views/Voyage.vue'

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
    }
  ]
})

export default router
