<template>
  <section class="home-hero">
    <div class="hero-overlay"></div>

    <div class="hero-content">
      <h1 class="hero-title">
        Premium ručná <br />
        starostlivosť o vaše auto
      </h1>

      <p class="hero-subtitle">
        Profesionálna ručná autoumyváreň. <br />
        Čistota, detail a kvalita bez kompromisov.
      </p>

      <div class="hero-actions">
        <RouterLink
          to="/reserve?"
          class="btn btn-green"
        >
          Rezervovať termín
        </RouterLink>

        <RouterLink
          to="/services"
          class="btn btn-ghost-light"
        >
          Naše služby
        </RouterLink>
      </div>
    </div>
  </section>
</template>


<style scoped>
/* =========================
   HERO SECTION
========================= */

.home-hero {
  position: relative;
  min-height: calc(100vh - 72px); /* если есть header */
  display: flex;
  align-items: center;
  padding: 0 40px;

  /* 👉 поменяй картинку здесь */
  background-image: url("../assets/fon/fon.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* затемнение */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.55) 40%,
    rgba(0, 0, 0, 0.15) 100%
  );
}

/* контент поверх */
.hero-content {
  position: relative;
  max-width: 620px;
  color: white;
  z-index: 1;
}

.hero-title {
  font-size: 44px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 28px;
}

/* кнопки */
.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

/* светлая ghost-кнопка */
.btn-ghost-light {
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  color: white;
}

.btn-ghost-light:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 768px) {
  .home-hero {
    padding: 0 20px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 26px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-actions .btn {
    width: 100%;
  }
}
</style>
