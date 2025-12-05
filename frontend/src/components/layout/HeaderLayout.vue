<template>
  <header class="header-root">
    <div class="header-container">

      <!-- LOGO -->
      <RouterLink to="/" class="header-logo">
        <span>PREMIUM WASH</span>
      </RouterLink>

      <!-- MOBILE MENU TOGGLE -->
      <button
        class="header-menu-btn"
        type="button"
        @click="toggleMobileMenu"
      >
        <span class="header-menu-line"></span>
        <span class="header-menu-line"></span>
        <span class="header-menu-line"></span>
      </button>

      <!-- NAVIGATION -->
      <nav
        class="header-nav"
        :class="{ 'mobile-open': isMobileMenuOpen }"
      >
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          :class="{ active: isActive(link.path) }"
          @click="closeMobileMenu"
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
const isMobileMenuOpen = ref(false)
const isAdmin = true;

const baseNavLinks = [
  { name: 'Domov', path: '/' },
  { name: 'Služby', path: '/services' },
  { name: 'Galéria', path: '/gallery' },
  { name: 'Recenzie', path: '/reviews' },
  { name: 'O nás', path: '/about' },
  { name: 'Kontakt', path: '/contact' }
]
let navLinks = [...baseNavLinks];

if (isAdmin) {
  navLinks.push({ name: 'Admin panel', path: '/admin-panel' }); 
}

const toggleLogin = () => {
  isLoggedIn.value = !isLoggedIn.value
}

const isActive = (path) => route.path === path

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
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
  max-width: 1152px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

/* --- LOGO --- */
.header-logo {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 7px 14px;
  border-radius: 12px;
  background-color: var(--blue);
  color: #ffffff;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.header-logo:hover {
  background-color: var(--blue-dark);
}

/* --- MOBILE MENU BUTTON (BURGER) --- */
.header-menu-btn {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 6px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
}

/* скрываем бургер на больших экранах */
@media (min-width: 768px) {
  .header-menu-btn {
    display: none;
  }
}

.header-menu-line {
  width: 20px;
  height: 2px;
  background-color: #111827;
  border-radius: 999px;
}

/* --- NAVIGATION --- */
.header-nav {
  display: none;
}

/* DESKTOP NAV */
@media (min-width: 768px) {
  .header-nav {
    display: flex;
    gap: 28px;
    align-items: center;
  }
}

/* MOBILE NAV (ДРОПДАУН) */
.header-nav.mobile-open {
  position: absolute;
  top: 72px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 12px 16px 16px;
  background-color: var(--white-aktive);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
}

/* --- LINKS --- */
.nav-link {
  font-size: 15px;
  color: var(--color-text-muted);
  transition: color 0.2s ease, border-color 0.2s ease;
  padding-bottom: 3px;
}

/* на мобиле ссылки на всю ширину и чуть больше отступов */
.header-nav.mobile-open .nav-link {
  padding: 6px 4px;
}

/* hover */
.nav-link:hover {
  color: var(--color-text-main);
}

/* активная ссылка */
.nav-link.active {
  color: var(--blue);
  font-weight: 600;
  border-bottom: 2px solid var(--blue);
}

/* --- RIGHT SIDE (LOGIN / AVATAR) --- */
.header-auth {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* прячем кнопку логина на очень узких экранах, если надо сильно экономить место */
/* можно убрать, если хочешь всегда видеть кнопку */
@media (max-width: 360px) {
  .header-auth {
    display: none;
  }
}

.header-login-btn {
  padding: 7px 16px;
}

.header-avatar {
  width: 38px;
  height: 38px;
  background-color: var(--white-aktive);
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
