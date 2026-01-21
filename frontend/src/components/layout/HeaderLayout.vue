<template>
  <header class="header-root">
    <div class="header-container">

      <RouterLink to="/" class="header-logo">
        <span>PREMIUM WASH</span>
      </RouterLink>

      <button class="header-menu-btn" type="button" @click="toggleMobileMenu">
        <span class="header-menu-line"></span>
        <span class="header-menu-line"></span>
        <span class="header-menu-line"></span>
      </button>

      <nav class="header-nav" :class="{ 'mobile-open': isMobileMenuOpen }">
        <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path" class="nav-link"
          :class="{ active: isActive(link.path) }" @click="closeMobileMenu">
          {{ link.name }}
        </RouterLink>
      </nav>

      <div class="header-auth">
        <div class="avatar-wrapper">
          <div class="header-avatar" @click="toggleDropdown">
            <i class="fas fa-user"></i>
          </div>

          <div v-if="showDropdown" class="avatar-dropdown">
            <button class="dropdown-item" @click="logout">
              Odhlásiť sa
            </button>
          </div>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute, useRouter, RouterLink } from "vue-router"

const route = useRoute()
const router = useRouter()

const isMobileMenuOpen = ref(false)
const showDropdown = ref(false)

const user = JSON.parse(localStorage.getItem("user") || "null")
const role = user?.role || "USER"

const baseNavLinks = [
  { name: 'Domov', path: '/' },
  { name: 'Služby', path: '/services' },
  { name: 'Galéria', path: '/gallery' },
  { name: 'Recenzie', path: '/reviews' },
]

const navLinks = computed(() => {
  if (role === 'ADMIN') {
    return [...baseNavLinks, { name: 'Admin panel', path: '/admin-panel' }]
  }
  return [...baseNavLinks, { name: 'Moje rezervácie', path: '/my-reservations' }]
})

const isActive = (path) => route.path === path

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const logout = () => {
  localStorage.removeItem("user")
  showDropdown.value = false
  router.push("/login")
}
</script>

<style scoped>
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

.header-logo {
  font-size: 17px;
  font-weight: 700;
  padding: 7px 14px;
  border-radius: 12px;
  background-color: var(--blue);
  color: #fff;
  text-decoration: none;
}

.header-menu-btn {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
}

.header-menu-line {
  width: 22px;
  height: 2px;
  background: var(--color-text-main);
}

.header-nav {
  display: none;
}

.nav-link {
  font-size: 15px;
  color: var(--color-text-muted);
  text-decoration: none;
}

.nav-link.active {
  color: var(--blue);
  font-weight: 600;

}

@media (min-width: 768px) {
  .header-menu-btn {
    display: none;
  }

  .header-nav {
    display: flex;
    gap: 28px;
  }
}

@media (max-width: 767px) {
  .header-nav.mobile-open {
    position: absolute;
    top: 72px;
    left: 0;
    width: 100%;
    background: var(--white-aktive);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    padding: 16px 24px;
    gap: 14px;
    z-index: 40;
  }
}

.avatar-wrapper {
  position: relative;
}

.header-avatar {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: var(--white-aktive);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header-avatar:hover {
  background: #f3f4f6;
}

.avatar-dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  min-width: 160px;
}

.dropdown-item {
  padding: 10px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: #f3f4f6;
}
</style>
