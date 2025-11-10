<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <header class="bg-gray-900 text-white p-4">
      <nav class="flex justify-center gap-8">
        <RouterLink to="/" class="hover:text-blue-400">Domov</RouterLink>
        <RouterLink to="/about" class="hover:text-blue-400">O aplikácii</RouterLink>
         <RouterLink to="/services" class="hover:text-blue-400">Services</RouterLink>
         <RouterLink to="/reviews" class="hover:text-blue-400">Reviews</RouterLink>
      </nav>
    </header>

    <!-- Главный контент -->
    <main class="flex-grow bg-gray-100 p-6">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white text-center p-3">
      © 2025 E-Wash — všetky práva vyhradené
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
