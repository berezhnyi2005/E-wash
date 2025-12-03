
<template>
  <div class="flex flex-col min-h-screen">
    <HeaderLayout />
    <main class="app-content">
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
