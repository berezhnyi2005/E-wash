<template>
  <section class="page-section">
    <div class="page-container">

      <div class="section-header">
        <div>
          <h1 class="section-header-title">Administrácia rezervácií</h1>
          <p class="section-header-description">
            Prehľad všetkých rezervácií a správa ich stavu
          </p>
        </div>
      </div>

      <div class="admin-card">
        <table v-if="appointments.length" class="admin-table">
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
            <tr v-for="a in appointments" :key="a.id">
              <td>{{ a.service.title }}</td>

              <td>
                <div class="user-cell">
                  <strong>{{ a.user.name }}</strong>
                  <span class="user-email">{{ a.user.email }}</span>
                </div>
              </td>

              <td>{{ formatDate(a.dateTime) }}</td>
              <td>{{ formatTimeRange(a) }}</td>

              <td>
                <select
                  class="status-select"
                  :class="statusClass(a.status)"
                  :value="a.status"
                  @change="changeStatus(a.id, $event.target.value)"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </td>

              <td>
                <button
                  class="btn btn-danger"
                  @click="askDelete(a.id)"
                >
                  Zmazať
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else class="empty-text">
          Žiadne rezervácie neboli nájdené.
        </p>
      </div>

      <ConfirmModal
        v-model:visible="confirmDeleteVisible"
        @confirm="deleteConfirmed"
      />

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'

const toast = useToast()

const appointments = ref([])
const confirmDeleteVisible = ref(false)
const appointmentToDelete = ref(null)

const fetchAppointments = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/appointments')
    const json = await res.json()
    if (!res.ok) throw new Error(json.message)
    appointments.value = json.data
  } catch (err) {
    toast.error(err.message)
  }
}

const changeStatus = async (id, status) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/appointments/${id}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }
    )

    if (!res.ok) throw new Error('Status update failed')

    toast.success('Status aktualizovaný')
    fetchAppointments()
  } catch (err) {
    toast.error(err.message)
  }
}

const statusClass = (status) => ({
  'status-pending': status === 'PENDING',
  'status-approved': status === 'APPROVED',
  'status-cancelled': status === 'CANCELLED'
})

const askDelete = (id) => {
  appointmentToDelete.value = id
  confirmDeleteVisible.value = true
}

const deleteConfirmed = async () => {
  try {
    await fetch(
      `http://localhost:5000/api/appointments/${appointmentToDelete.value}`,
      { method: 'DELETE' }
    )

    toast.success('Rezervácia zmazaná')
    fetchAppointments()
  } catch (err) {
    toast.error(err.message)
  } finally {
    appointmentToDelete.value = null
  }
}
const formatDate = (date) =>
  new Date(date).toLocaleDateString('sk-SK')

const formatTimeRange = (a) => {
  const start = new Date(a.dateTime)
  const end = new Date(start.getTime() + a.service.durationMin * 60000)

  const f = (d) =>
    `${String(d.getHours()).padStart(2, '0')}:${String(
      d.getMinutes()
    ).padStart(2, '0')}`

  return `${f(start)} – ${f(end)}`
}

onMounted(fetchAppointments)
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
  font-size: 14px;
}

.admin-table th {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

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

.status-select {
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
}

.status-pending {
  color: var(--blue);
  background: rgba(37, 99, 235, 0.12);
  border-color: rgba(37, 99, 235, 0.35);
}

.status-approved {
  color: var(--green);
  background: rgba(33, 166, 82, 0.12);
  border-color: rgba(33, 166, 82, 0.35);
}

.status-cancelled {
  color: var(--red);
  background: rgba(196, 16, 16, 0.12);
  border-color: rgba(196, 16, 16, 0.35);
}

.empty-text {
  text-align: center;
  padding: 40px;
  color: var(--color-text-muted);
}
</style>
