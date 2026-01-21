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
          class="btn btn-primary"
        >
          Naše služby
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  position: relative;
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  padding: 0 40px;

  background-image: url("../assets/fon/fona.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

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

.hero-content {
  position: relative;
  max-width: 620px;
  z-index: 1;
  color: white;
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
  margin-bottom: 28px;
  color: rgba(255, 255, 255, 0.85);
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}


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
