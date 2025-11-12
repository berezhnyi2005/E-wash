
<template>
  <div class="flex flex-col min-h-screen">
    <HeaderLayout />
    <main class="flex-grow pt-20 bg-gray-50">
      <RouterView />
    </main>
    <FooterLayout />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import FooterLayout from '@/components/layout/FooterLayout.vue'
import HeaderLayout from '@/components/layout/HeaderLayout.vue';
</script>
