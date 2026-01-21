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
        <button v-if="isAdmin" type="button" class="btn btn-green" @click="openCreateModal">
          Vytvoriť službu
        </button>
      </header>

      <div v-if="loading" class="loading-text">
        Načítavam služby…
      </div>

      <div v-else-if="error" class="error-text">
        {{ error }}
      </div>

      <div v-else class="services-grid">
        <div v-for="service in services" :key="service.id" class="card-service">
          <header class="card-service-header">
            <h2 class="card-service-title">{{ service.title }}</h2>

            <span class="card-service-price">
              {{ formatPrice(service.price) }}
            </span>
          </header>

          <p class="card-service-description">
            {{ service.description || 'Popis služby bude čoskoro doplnený.' }}
          </p>

          <div class="card-service-meta">
            <span>⏱ Trvanie cca: {{ service.durationMin }} min</span>
          </div>

          <div class="card-service-actions">
            <button class="btn btn-primary" @click="goToReservation(service.id)">
              Rezervovať
            </button>

            <div v-if="isAdmin" class="card-service-admin-actions">
              <button class="btn btn-ghost" @click="openEditModal(service)">
                Upraviť
              </button>

              <button class="btn btn-danger" @click="askDeleteService(service.id)">
                Vymazať
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ServiceModal v-if="isAdmin && modalVisible" v-model:visible="modalVisible" :mode="modalMode"
      :service="selectedService" @save="handleSaveService" />

    <ConfirmModal v-if="isAdmin" v-model:visible="confirmDeleteVisible" @confirm="deleteServiceConfirmed" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ServiceModal from '@/components/modal/ServiceModal.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'

const router = useRouter()

const user = JSON.parse(localStorage.getItem('user') || 'null')
const isAdmin = computed(() => user?.role === 'ADMIN')

const services = ref([])
const loading = ref(false)
const error = ref('')

const modalVisible = ref(false)
const modalMode = ref('create')
const selectedService = ref(null)

const confirmDeleteVisible = ref(false)
const serviceToDelete = ref(null)

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

const goToReservation = (serviceId) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) {
    router.push('/login')
    return
  }

  router.push({
    path: '/reserve',
    query: { serviceId }
  })
}

const formatPrice = (value) => {
  if (!value && value !== 0) return '-'
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value)
}

const openCreateModal = () => {
  if (!isAdmin.value) return
  modalMode.value = 'create'
  selectedService.value = null
  modalVisible.value = true
}

const openEditModal = (service) => {
  if (!isAdmin.value) return
  modalMode.value = 'edit'
  selectedService.value = { ...service }
  modalVisible.value = true
}

const askDeleteService = (id) => {
  if (!isAdmin.value) return
  serviceToDelete.value = id
  confirmDeleteVisible.value = true
}

const deleteServiceConfirmed = async () => {
  if (!serviceToDelete.value) return

  try {
    const response = await fetch(
      `${API_BASE}/api/services/${serviceToDelete.value}`,
      { method: 'DELETE' }
    )

    if (!response.ok) {
      throw new Error('Nepodarilo sa vymazať službu.')
    }

    services.value = services.value.filter(
      s => s.id !== serviceToDelete.value
    )
  } catch (err) {
    alert(err.message)
  } finally {
    serviceToDelete.value = null
  }
}

const handleSaveService = async (formData) => {
  if (!isAdmin.value) return

  const { mode, id, ...payload } = formData

  try {
    let url = `${API_BASE}/api/services`
    let method = 'POST'

    if (mode === 'edit' && id) {
      url = `${API_BASE}/api/services/${id}`
      method = 'PUT'
    }

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Nepodarilo sa uložiť službu.')
    }

    await fetchServices()
  } catch (err) {
    alert(err.message || 'Chyba pri ukladaní služby.')
  }
}

onMounted(fetchServices)
</script>

<style scoped>
.services-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
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

.card-service {
  padding: 20px;
  border-radius: 16px;
  background: var(--white-aktive);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.card-service:hover {
  transform: translateY(-4px);
  border-color: var(--blue);
  box-shadow: 0 16px 32px var(--blue-light);
}

.card-service-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.card-service-title,
.card-service-price {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-main);
}

.card-service-description,
.card-service-meta {
  font-size: 14px;
  color: var(--color-text-muted);
}

.card-service-actions {
  margin-top: auto;
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-service-admin-actions {
  display: flex;
  gap: 8px;
}

.loading-text,
.error-text {
  text-align: center;
  padding: 24px 0;
  font-size: 14px;
}

.error-text {
  color: var(--red);
}
</style>
