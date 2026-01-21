<template>
  <footer class="footer-root">
    <div class="page-container footer-container">

      <div class="footer-grid">

        <div class="footer-column">
          <h3 class="footer-title">Kontakt</h3>

          <div class="footer-row">
            <i class="fas fa-map-marker-alt footer-icon"></i>
            <div class="footer-text-block">
              <span>Námestie Ľ. Štúra 8155/5, 010 01 Žilina</span>
              <span>010 01 Žilina, Slovensko</span>
            </div>
          </div>

          <div class="footer-row">
            <i class="fas fa-phone footer-icon"></i>
            <a href="tel:+421952135550" class="footer-link">
              +421 952 135 550
            </a>
          </div>

          <div class="footer-row">
            <i class="fas fa-envelope footer-icon"></i>
            <a href="mailto:info@ewash.sk" class="footer-link">
              info@ewash.sk
            </a>
          </div>
        </div>

        <div class="footer-column">
          <h3 class="footer-title">Otváracie hodiny</h3>

          <div class="footer-row">
            <i class="fas fa-clock footer-icon"></i>
            <span>Pondelok – Nedeľa: 9:00 – 17:00</span>
          </div>
        </div>

        <div class="footer-column">
          <h3 class="footer-title">Sledujte nás</h3>

          <p class="footer-text">
            Sledujte naše novinky, akcie a špeciálne ponuky.
          </p>

          <div class="footer-social">
            <a class="social-btn" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"
              aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>

            <a class="social-btn" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
              aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>

            <a class="social-btn" href="https://twitter.com/" target="_blank" rel="noopener noreferrer"
              aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-map-section">
        <button class="find-us-btn" @click="toggleMap">
          <span class="find-us-left">
            <i class="fas fa-map-marker-alt"></i>
            <span>Nájdete nás</span>
          </span>
          <span class="find-us-arrow">
            {{ showMap ? '▲' : '▼' }}
          </span>
        </button>

        <transition name="fade-slide">
          <div v-if="showMap" class="map-wrapper">
            <iframe title="Mapa E-Wash" width="100%" height="260" style="border:0;" loading="lazy" allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230.33488746640458!2d18.74174587258378!3d49.220631328883805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47145fe9e964cba9%3A0xbf6004641e936aca!2zR2Fyw6HFvmUgQXVwYXJrIC0gdsO9Y2hvZG7DvSB2amF6ZA!5e0!3m2!1suk!2ssk!4v1769023577764!5m2!1suk!2ssk"
              ;></iframe>
          </div>
        </transition>
      </div>

      <div class="footer-bottom">
        © 2026 E-Wash
      </div>

    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const showMap = ref(false)
const toggleMap = () => {
  showMap.value = !showMap.value
}
</script>

<style scoped>
.footer-root {
  background-color: var(--color-footer-bg, #020617);
  color: #e5e7eb;
  margin-top: auto;
}

.footer-container {
  padding-top: 56px;
  padding-bottom: 40px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 48px;
  max-width: 1100px;
  margin: 0 auto;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
}

.footer-text {
  font-size: 14px;
  color: var(--color-text-muted);
}

.footer-text-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
}

.footer-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
}

.footer-icon {
  margin-top: 2px;
  color: var(--color-primary);
}

.footer-link {
  color: #e5e7eb;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: white;
}

.footer-social {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: transparent;
  color: #e5e7eb;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.2s ease;
}

.social-btn:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.footer-map-section {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.find-us-btn {
  width: 100%;
  max-width: 420px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 16px;
  border-radius: 12px;

  background-color: var(--color-primary);
  border: 1px solid var(--color-primary);
  color: white;

  cursor: pointer;
  transition: 0.2s ease;
}

.find-us-btn:hover {
  background-color: var(--color-primary-dark);
}

.find-us-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.map-wrapper {
  margin-top: 16px;
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.footer-bottom {
  margin-top: 48px;
  padding-top: 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  font-size: 13px;
  text-align: center;
  color: #9ca3af;
}

@media (max-width: 640px) {
  .footer-container {
    padding-top: 40px;
  }

  .footer-map-section {
    margin-top: 32px;
  }
}
</style>
