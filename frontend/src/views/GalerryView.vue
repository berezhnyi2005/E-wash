<template>
  <section class="page-section">
    <div class="page-container">

      <div class="section-header">
        <div>
          <h1 class="section-header-title">Galéria výsledkov</h1>
          <p class="section-header-description">
            Porovnanie stavu vozidiel pred a po profesionálnom umytí
          </p>
        </div>

        <button
          v-if="isAdmin"
          class="btn btn-primary"
          @click="createVisible = true"
        >
          Pridať prácu
        </button>
      </div>

      <div v-if="loading" class="text-center text-sm text-[var(--color-text-muted)]">
        Načítavam galériu...
      </div>

      <div
        v-else-if="items.length === 0"
        class="text-center text-sm text-[var(--color-text-muted)]"
      >
        Zatiaľ nie sú k dispozícii žiadne fotografie.
      </div>

      <!-- ACTIVE ITEM -->
      <div v-else class="gallery-main">

        <h2 class="gallery-title">
          {{ activeItem.title }}
        </h2>

        <p v-if="activeItem.service" class="gallery-service">
          Služba: {{ activeItem.service.title }}
        </p>

        <div class="gallery-images">
          <div class="image-box">
            <img :src="apiUrl + activeItem.beforeUrl" />
            <span class="badge before">Pred</span>
          </div>

          <div class="image-box">
            <img :src="apiUrl + activeItem.afterUrl" />
            <span class="badge after">Po</span>
          </div>
        </div>

        <!-- NAVIGATION -->
        <div class="gallery-nav">
          <button @click="prev" :disabled="activeIndex === 0">‹</button>

          <div class="thumbnails">
            <div
              v-for="(item, i) in items"
              :key="item.id"
              class="thumb"
              :class="{ active: i === activeIndex }"
              @click="activeIndex = i"
            >
              <img :src="apiUrl + item.afterUrl" />
            </div>
          </div>

          <button
            @click="next"
            :disabled="activeIndex === items.length - 1"
          >
            ›
          </button>
        </div>
      </div>

    </div>
  </section>

  <GalleryCreateModal
    v-model:visible="createVisible"
    @saved="fetchGallery"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import GalleryCreateModal from "@/components/modal/GalleryCreateModal.vue"

const apiUrl = "http://localhost:5000"

const items = ref([])
const loading = ref(true)
const createVisible = ref(false)
const activeIndex = ref(0)

const user = JSON.parse(localStorage.getItem("user"))
const isAdmin = computed(() => user?.role === "ADMIN")

const activeItem = computed(() => items.value[activeIndex.value])

const fetchGallery = async () => {
  loading.value = true
  try {
    const res = await fetch(`${apiUrl}/api/gallery`)
    const json = await res.json()
    items.value = json.data || []
    activeIndex.value = 0
  } finally {
    loading.value = false
  }
}

const prev = () => {
  if (activeIndex.value > 0) activeIndex.value--
}

const next = () => {
  if (activeIndex.value < items.value.length - 1) activeIndex.value++
}

onMounted(fetchGallery)
</script>

<style scoped>
.gallery-main {
  margin-top: 24px;
  text-align: center;
}

.gallery-title {
  font-size: 20px;
  font-weight: 600;
}

.gallery-service {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.gallery-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.image-box {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.image-box img {
  width: 100%;
  height: 320px;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 10px;
  padding: 4px 10px;
  font-size: 11px;
  color: white;
  border-radius: 999px;
}

.before {
  left: 10px;
  background: var(--red);
}

.after {
  right: 10px;
  background: var(--green);
}

.gallery-nav {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.gallery-nav button {
  font-size: 24px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.gallery-nav button:disabled {
  opacity: 0.3;
  cursor: default;
}

.thumbnails {
  display: flex;
  gap: 10px;
}

.thumb {
  width: 80px;
  height: 50px;
  border-radius: 10px;
  overflow: hidden;
  opacity: 0.5;
  cursor: pointer;
  border: 2px solid transparent;
}

.thumb.active {
  opacity: 1;
  border-color: var(--blue);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
