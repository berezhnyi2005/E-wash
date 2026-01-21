<template>
  <section class="page-section">
    <div class="page-container">

      <!-- HEADER -->
      <div class="section-header">
        <div>
          <h1 class="section-header-title">Administrácia rezervácií</h1>
          <p class="section-header-description">
            Prehľad všetkých rezervácií a správa ich stavu
          </p>
        </div>

        <button class="btn btn-ghost" @click="showDone = !showDone">
          {{ showDone ? 'Skryť dokončené' : 'Zobraziť dokončené' }}
        </button>
      </div>

      <!-- CONTENT -->
      <div class="admin-card">
        <p v-if="!filteredAppointments.length" class="empty-text">
          Žiadne aktívne rezervácie.
        </p>

        <!-- DESKTOP TABLE -->
        <table v-else class="admin-table desktop-only">
          <thead>
            <tr>
              <th>Služba</th>
              <th>Užívateľ</th>
              <th>Dátum</th>
              <th>Čas</th>
              <th>Status</th>
              <th>Akcie</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="a in filteredAppointments" :key="a.id">
              <td>{{ a.service.title }}</td>

              <td>
                <div class="user-cell">
                  <strong>{{ a.user.name }}</strong>
                  <span class="user-email">{{ a.user.email }}</span>
                </div>
              </td>

              <td>{{ formatDate(a.dateTime) }}</td>
              <td>{{ formatTimeRange(a) }}</td>

              <!-- STATUS -->
              <td>
                <select
                  class="status-select"
                  :class="statusClass(a.status)"
                  :value="a.status"
                  :disabled="a.status === 'DONE'"
                  @change="onStatusChange(a, $event.target.value)"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="DONE">Done</option>
                </select>
              </td>

              <!-- ACTIONS -->
              <td>
                <button
                  v-if="a.status !== 'DONE'"
                  class="btn btn-danger"
                  @click="askDelete(a.id)"
                >
                  Zmazať
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- MOBILE -->
        <div class="mobile-only">
          <div
            v-for="a in filteredAppointments"
            :key="a.id"
            class="reservation-card"
          >
            <div class="card-row">
              <strong>{{ a.service.title }}</strong>
              <span>{{ formatDate(a.dateTime) }}</span>
            </div>

            <div class="card-row muted">
              {{ formatTimeRange(a) }}
            </div>

            <div class="card-row">
              <div class="user-cell">
                <strong>{{ a.user.name }}</strong>
                <span class="user-email">{{ a.user.email }}</span>
              </div>
            </div>

            <div class="card-row actions-row">
              <select
                class="status-select"
                :class="statusClass(a.status)"
                :value="a.status"
                :disabled="a.status === 'DONE'"
                @change="onStatusChange(a, $event.target.value)"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="DONE">Done</option>
              </select>

              <button
                v-if="a.status !== 'DONE'"
                class="btn btn-danger"
                @click="askDelete(a.id)"
              >
                Zmazať
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODALS -->
      <ConfirmModal
        v-model:visible="confirmDeleteVisible"
        @confirm="deleteConfirmed"
      />

      <ConfirmModal
        v-model:visible="confirmDoneVisible"
        @confirm="confirmSetDone"
      />

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'

const toast = useToast()

const appointments = ref([])
const showDone = ref(false)

const confirmDeleteVisible = ref(false)
const confirmDoneVisible = ref(false)

const appointmentToDelete = ref(null)
const appointmentToDone = ref(null)

const fetchAppointments = async () => {
  const res = await fetch('http://localhost:5000/api/appointments')
  const json = await res.json()
  appointments.value = json.data || []
}

onMounted(fetchAppointments)

/* FILTER */
const filteredAppointments = computed(() =>
  appointments.value.filter(a =>
    showDone.value ? true : a.status !== 'DONE'
  )
)

/* STATUS */
const onStatusChange = (a, newStatus) => {
  if (a.status === 'DONE') return

  if (newStatus === 'DONE') {
    appointmentToDone.value = a
    confirmDoneVisible.value = true
  } else {
    updateStatus(a.id, newStatus)
  }
}

const confirmSetDone = async () => {
  await updateStatus(appointmentToDone.value.id, 'DONE')
  appointmentToDone.value = null
}

/* API */
const updateStatus = async (id, status) => {
  const res = await fetch(
    `http://localhost:5000/api/appointments/${id}/status`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }
  )

  if (!res.ok) {
    toast.error('Nepodarilo sa zmeniť stav')
    return
  }

  toast.success('Status aktualizovaný')
  fetchAppointments()
}

const askDelete = (id) => {
  appointmentToDelete.value = id
  confirmDeleteVisible.value = true
}

const deleteConfirmed = async () => {
  const res = await fetch(
    `http://localhost:5000/api/appointments/${appointmentToDelete.value}`,
    { method: 'DELETE' }
  )

  if (!res.ok) {
    toast.error('Nepodarilo sa zmazať rezerváciu')
    return
  }

  toast.success('Rezervácia zmazaná')
  appointmentToDelete.value = null
  fetchAppointments()
}

/* HELPERS */
const formatDate = (d) =>
  new Date(d).toLocaleDateString('sk-SK')

const formatTimeRange = (a) => {
  const start = new Date(a.dateTime)
  const end = new Date(start.getTime() + a.service.durationMin * 60000)
  const f = (d) =>
    `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  return `${f(start)} – ${f(end)}`
}

const statusClass = (s) => {
  if (s === 'PENDING') return 'status-pending'
  if (s === 'APPROVED') return 'status-approved'
  if (s === 'CANCELLED') return 'status-cancelled'
  if (s === 'DONE') return 'status-done'
  return ''
}
</script>

<style scoped>
.admin-card {
  background: var(--white-aktive);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  padding: 20px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  padding: 12px;
  border-bottom: 1px solid var(--color-border);
}

.user-cell {
  display: flex;
  flex-direction: column;
}

.user-email {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* STATUS */
.status-select {
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid transparent;
  background: transparent;
}

.status-select:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.status-pending {
  color: var(--blue);
  background: rgba(37, 99, 235, 0.12);
}

.status-approved {
  color: var(--green);
  background: rgba(33, 166, 82, 0.12);
}

.status-cancelled {
  color: var(--red);
  background: rgba(196, 16, 16, 0.12);
}

.status-done {
  color: #5f6f63;
  background: rgba(95, 111, 99, 0.18);
}

/* MOBILE */
.reservation-card {
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-row {
  display: flex;
  justify-content: space-between;
}

.muted {
  color: var(--color-text-muted);
  font-size: 13px;
}

.desktop-only { display: table; }
.mobile-only { display: none; }

@media (max-width: 768px) {
  .desktop-only { display: none; }
  .mobile-only {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
}

.empty-text {
  text-align: center;
  padding: 40px;
  color: var(--color-text-muted);
}
</style>
