import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
    },

    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'services',
          name: 'services',
          component: () => import('@/views/ServicesView.vue'),
        },
        {
          path: 'reserve',
          name: 'reserve',
          component: () => import('@/views/ReservationView.vue'),
        },
        {
          path: 'reviews',
          name: 'reviews',
          component: () => import('@/views/ReviewsView.vue'),
        },
        {
          path: 'gallery',
          name: 'gallery',
          component: () => import('@/views/GalerryView.vue'),
        },
        {
          path: 'admin-panel',
          name: 'admin-panel',
          component: () => import('@/views/AdminView.vue'),
        },
        {
          path: 'my-reservations',
          name: 'my-reservations',
          component: () => import('@/views/MyReservationsView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const publicPages = ['/login', '/register']

  if (!user && !publicPages.includes(to.path)) {
    return next('/login')
  }

  next()
})

export default router
