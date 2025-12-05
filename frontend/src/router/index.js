import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ServicesView from '@/views/ServicesView.vue'
import ReviewsView from '@/views/ReviewsView.vue'
import GalleryView from '@/views/GalerryView.vue'
import AdminView from '@/views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'about',
          name: 'about',
          component: AboutView
        },
         {
          path: 'services',
          name: 'services',
          component: ServicesView
        },
        {
          path: 'reviews',
          name: 'reviews',
          component: ReviewsView
        },
        {
          path: 'gallery',
          name: 'gallery',
          component: GalleryView
        },
        {
          path: 'admin-panel',
          name: 'admin-panel',
          component: AdminView
        },
        
      ]
    }
  ]
})

export default router
