<template>
  <header class="header-root">
    <div class="header-container">

      <!-- LOGO -->
      <RouterLink to="/" class="header-logo">
        <span>PREMIUM WASH</span>
      </RouterLink>

      <!-- NAVIGATION -->
      <nav class="header-nav">
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          :class="{ active: isActive(link.path) }"
        >
          {{ link.name }}
        </RouterLink>
      </nav>

      <!-- LOGIN / AVATAR -->
      <div class="header-auth">
        <button
          v-if="!isLoggedIn"
          @click="toggleLogin"
          class="btn btn-ghost header-login-btn"
        >
          Prihlásiť sa
        </button>

        <div
          v-else
          class="header-avatar"
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
  { name: 'Domov', path: '/' },
  { name: 'Služby', path: '/services' },
  { name: 'Galéria', path: '/gallery' },
  { name: 'Recenzie', path: '/reviews' },
  { name: 'O nás', path: '/about' },
  { name: 'Kontakt', path: '/contact' },
]

const toggleLogin = () => {
  isLoggedIn.value = !isLoggedIn.value
}

const isActive = (path) => route.path === path
</script>

<style scoped>
/* --- ROOT HEADER --- */
.header-root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
  background-color: var(--grey-light);
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.06);
  z-index: 50;
}

/* --- FLEX WRAPPER --- */
.header-container {
  max-width: 72rem;
  height: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  

  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* --- LOGO --- */
.header-logo {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 0.45rem 0.9rem;
  border-radius: 0.75rem;
  background-color: var(--blue);
  color: white;
  transition: background-color 0.2s ease;
}

.header-logo:hover {
  background-color: var(--blue-dark);
}

/* --- NAVIGATION --- */
.header-nav {
  display: flex;
  gap: 1.75rem;
}

.nav-link {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  transition: color 0.2s ease;
  padding-bottom: 3px;
}

.nav-link:hover {
  color: var(--color-text-main);
}

.nav-link.active {
  color: var(--color-primary);
  font-weight: 600;
  border-bottom: 2px solid var(--color-primary);
}

/* --- RIGHT SIDE (LOGIN / AVATAR) --- */
.header-auth {
  display: flex;
  align-items: center;
}

.header-login-btn {
  padding: 0.45rem 1rem;
}

.header-avatar {
  width: 38px;
  height: 38px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--color-text-main);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.header-avatar:hover {
  background-color: #f3f4f6;
}
</style>
