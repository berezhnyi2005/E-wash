<template>
  <footer class="footer-root">
    <div class="page-container py-14">
      <div class="footer-grid">

        <div class="footer-column">
          <h3 class="footer-title">Kontakt</h3>

          <div class="footer-row">
            <i class="fas fa-map-marker-alt footer-icon"></i>
            <div>
              <a>123 Ulica Umývania</a>
              <a>010 01 Žilina, Slovensko</a>
            </div>
          </div>

          <div class="footer-row">
            <i class="fas fa-phone footer-icon"></i>
            <a href="tel:+421900123456" class="footer-link">+421 952 135 550</a>
          </div>

          <div class="footer-row">
            <i class="fas fa-envelope footer-icon"></i>
            <a href="mailto:info@ewash.sk" class="footer-link">info@ewash.sk</a>
          </div>
        </div>

        <div class="footer-column">
          <h3 class="footer-title">Otváracie hodiny</h3>
          <div class="footer-row">
            <i class="fas fa-clock footer-icon"></i>
            <div>
              <a>Pondelok – Piatok: 8:00 – 20:00</a>
              <p>Sobota: 9:00 – 18:00</p>
              <p>Nedeľa: 10:00 – 16:00</p>
            </div>
          </div>
        </div>

        <div class="footer-column">
          <h3 class="footer-title">Sledujte nás</h3>

          <p class="footer-text">
            Sledujte naše novinky, akcie a špeciálne ponuky.
          </p>

          <div class="flex items-center gap-3 mt-3">
            <a class="social-btn"><i class="fab fa-facebook-f"></i></a>
            <a class="social-btn"><i class="fab fa-instagram"></i></a>
            <a class="social-btn"><i class="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>

      <div class="footer-map-section">
        <button class="find-us-btn" @click="toggleMap">
          <span class="flex items-center gap-2">
            <i class="fas fa-map-marker-alt"></i>
            <span>Nájdete nás</span>
          </span>
          <span>{{ showMap ? '▲' : '▼' }}</span>
        </button>

        <transition name="fade-slide">
          <div v-if="showMap" class="map-wrapper">
             <iframe
              title="Mapa E-Wash"
              width="100%"
              height="260"
              style="border:0;"
              loading="lazy"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2660.157855913262!2d18.739289!3d49.223321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47145f3acb1e7b0f%3A0xaaa!2s%C5%BDilina!5e0!3m2!1ssk!2ssk!4v1700000000000"
            ></iframe>
          </div>
        </transition>
      </div>

      <div class="footer-bottom">
        2026 E-Wash
      </div>

    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
const showMap = ref(false)
const toggleMap = () => (showMap.value = !showMap.value)
</script>

<style scoped>
.footer-root {
  background-color: #020617;
  color: #e5e7eb;
  margin-top: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  max-width: 1100px;
  margin: 0 auto;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 700;
}

.footer-text {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.footer-row {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.footer-icon {
  color: var(--color-primary);
  margin-top: 0.25rem;
}

.footer-link {
  color: #e5e7eb;
  transition: color 0.2s ease;
  text-decoration: none;
}
.footer-link:hover {
  color: white;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background-color: transparent;
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
  margin-top: 2rem;
}

.find-us-btn {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0.7rem 1rem;
  border-radius: 0.75rem;
  background-color: var (--color-primary);
  border: 1px solid var (--color-primary);

  cursor: pointer;
  transition: 0.2s ease;
}

.find-us-btn:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary-dark);
}

.map-wrapper {
  margin-top: 1rem;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.7);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity .2s, transform .2s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.footer-bottom {
  margin-top: 2.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  font-size: 0.85rem;
  text-align: center;
  color: #9ca3af;
}
</style>
