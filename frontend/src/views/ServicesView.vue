<template>
  <section class="page-section">
    <div class="page-container">

      <header class="section-header">
        <div>
          <h1 class="section-header-title">Naše služby</h1>
          <p class="section-header-description">
            Vyberte si balík ručného umývania, ktorý najlepšie vyhovuje vášmu autu
          </p>
        </div>

        <button
          v-if="isAdmin"
          type="button"
          class="btn btn-green"
          @click="openCreateModal"
        >
          Vytvoriť službu
        </button>
      </header>

      <!-- Loading -->
      <div v-if="loading" class="loading-text">
        Načítavam služby…
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-text">
        {{ error }}
      </div>



      <!-- GRID LAYOUT -->
      <div v-else class="services-grid">
        <div
          v-for="service in services"
          :key="service.id"
          class="card-service"
        >
          <!-- header -->
          <header class="card-service-header">
            <h2 class="card-service-title">{{ service.title }}</h2>

            <span class="card-service-price">
              {{ formatPrice(service.price) }}
            </span>
          </header>

          <!-- popis -->
          <p class="card-service-description">
            {{ service.description || 'Popis služby bude čoskoro doplnený.' }}
          </p>

          <!-- meta info -->
          <div class="card-service-meta">
            <span> ⏱ Trvanie cca: {{ service.durationMin }} min </span>
          </div>

          <!-- akcie -->
          <div class="card-service-actions">
            <button class="btn btn-primary">Rezervovať</button>

            <div v-if="isAdmin" class="card-service-admin-actions">
              <button class="btn btn-ghost" @click="openEditModal(service)">
                Upraviť
              </button>

              <button class="btn btn-danger" @click="requestDelete(service.id)">
                Vymazať
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ServiceModal
      v-if="modalVisible"
      v-model:visible="modalVisible"
      :mode="modalMode"
      :service="selectedService"
      @save="handleSaveService"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ServiceModal from '@/components/ServiceModal.vue'

const isAdmin = true

const services = ref([])
const loading = ref(false)
const error = ref('')

const modalVisible = ref(false)
const modalMode = ref('create')
const selectedService = ref(null)

const API_BASE = 'http://localhost:5000'

const fetchServices = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`${API_BASE}/api/services`)
    if (!response.ok) throw new Error('Nepodarilo sa načítať služby.')

    const json = await response.json()
    services.value = json.data || []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const formatPrice = (value) => {
  if (!value) return '-'
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

const openCreateModal = () => {
  modalMode.value = 'create'
  selectedService.value = null
  modalVisible.value = true
}

const openEditModal = (service) => {
  modalMode.value = 'edit'
  selectedService.value = { ...service }
  modalVisible.value = true
}

const requestDelete = async (id) => {
  if (!confirm('Naozaj chcete vymazať túto službu?')) return
  try {
    const response = await fetch(`${API_BASE}/api/services/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Nepodarilo sa vymazať službu.')
    }

    services.value = services.value.filter((s) => s.id !== id)
  } catch (err) {
    alert(err.message)
  }
}

// 🔥 ВАЖНО: реальная обработка создания / редактирования
const handleSaveService = async (formData) => {
  console.log('handleSaveService payload:', formData)

  const { mode, id, ...payload } = formData

  try {
    let url = `${API_BASE}/api/services`
    let method = 'POST'

    // Редактирование существующей услуги
    if (mode === 'edit' && id) {
      url = `${API_BASE}/api/services/${id}`
      method = 'PUT'
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Nepodarilo sa uložiť službu.')
    }
    await fetchServices()
  } catch (err) {
    console.error('save error:', err)
    alert(err.message || 'Chyba pri ukladaní služby.')
  }
}

onMounted(fetchServices)
</script>


<style scoped>
/* GRID LAYOUT: 1 → 2 → 3 v riadku */
.services-grid {
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 640px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
/* CARD */
.card-service {
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  border: 1.5px solid var(--blue);
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: 0.15s ease;
}
.card-service:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px var(--blue-light);
}

/* header */
.card-service-header {
  display: flex;
  justify-content: space-between;
}

.card-service-title {
  font-size: 20px;
  font-weight: bold;
}

.card-service-price {
  font-size: 20px;
  font-weight: bold;
}

/* texty */
.card-service-description {
  font-size: 15px;
  color: var(--color-text-muted);
}

.card-service-meta {
  font-size: 15px;
  color: var(--color-text-muted);
}

/* actions */
.card-service-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.card-service-admin-actions {
  display: flex;
  gap: 8px;
}

/* loading + error */
.loading-text {
  text-align: center;
  padding: 25px 0;
  font-size: 14px;
  color: grey;
}

.error-text {
  text-align: center;
  padding: 25px 0;
  font-size: 14px;
  color: #ff0000;
}
</style>
