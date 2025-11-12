<!-- src/components/layout/Header.vue -->
<template>
  <header class="bg-gray-800 text-white fixed top-0 left-0 w-full shadow-md z-50">
    <div class="flex items-center justify-between px-8 h-16 w-full">
      
      <!-- ЛОГО -->
      <RouterLink to="/" class="flex items-center space-x-2">
        <div class="bg-blue-600 px-3 py-1.5 rounded-lg text-sm tracking-wider font-medium">
          PREMIUM WASH
        </div>
      </RouterLink>

      <!-- НАВИГАЦИЯ -->
      <nav class="flex items-center gap-8">
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="transition-colors text-gray-300 hover:text-white"
          :class="{ 'text-white font-semibold border-b-2 border-white pb-1': isActive(link.path) }"
        >
          {{ link.name }}
        </RouterLink>
      </nav>

      <!-- КНОПКА ВХОДА / АВАТАР -->
      <div class="flex items-center">
        <button
          v-if="!isLoggedIn"
          @click="toggleLogin"
          class="flex items-center border border-white text-white px-3 py-1.5 rounded-md hover:bg-white hover:text-gray-900 transition"
        >
          <i class="fas fa-user mr-2"></i> Sign In
        </button>

        <div
          v-else
          class="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-900 cursor-pointer hover:bg-gray-200 transition"
        >
          <i class="fas fa-user"></i>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const isLoggedIn = ref(false)

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

const toggleLogin = () => {
  isLoggedIn.value = !isLoggedIn.value
}

const isActive = (path) => route.path === path
</script>
