<template>
  <section class="page-section">
    <div class="page-container">

      <div class="section-header">
        <div>
          <h1 class="section-header-title">Moje rezervácie</h1>
          <p class="section-header-description">
            Prehľad vašich aktuálnych a minulých rezervácií
          </p>
        </div>
      </div>

      <div class="card">

        <div v-if="loading" class="muted-text">
          Načítavam rezervácie…
        </div>

        <div v-else-if="reservations.length === 0" class="muted-text">
          Nemáte žiadne rezervácie.
        </div>

        <div v-else class="table-wrapper">
          <table class="reservations-table">
            <thead>
              <tr>
                <th>Služba</th>
                <th>Dátum</th>
                <th>Čas</th>
                <th>Stav</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in reservations" :key="r.id">
                <td>{{ r.service.title }}</td>
                <td>{{ formatDate(r.dateTime) }}</td>
                <td>{{ formatTimeBlock(r.dateTime, r.service.durationMin) }}</td>
                <td>
                  <span class="status" :class="`status-${r.status.toLowerCase()}`">
                    {{ r.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="reservations-mobile" v-if="!loading && reservations.length">
          <div v-for="r in reservations" :key="r.id + '-mobile'" class="reservation-card">
            <div class="reservation-row">
              <span class="label">Služba</span>
              <span class="value">{{ r.service.title }}</span>
            </div>

            <div class="reservation-row">
              <span class="label">Dátum</span>
              <span class="value">{{ formatDate(r.dateTime) }}</span>
            </div>

            <div class="reservation-row">
              <span class="label">Čas</span>
              <span class="value">
                {{ formatTimeBlock(r.dateTime, r.service.durationMin) }}
              </span>
            </div>

            <div class="reservation-row">
              <span class="label">Stav</span>
              <span class="status" :class="`status-${r.status.toLowerCase()}`">
                {{ r.status }}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const reservations = ref([])
const loading = ref(false)

const fetchReservations = async () => {
  try {
    loading.value = true
    const user = JSON.parse(localStorage.getItem('user'))

    if (!user?.id) {
      throw new Error('User not logged in')
    }

    const res = await fetch(
      `http://localhost:5000/api/appointments/my?userId=${user.id}`
    )

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text)
    }

    const json = await res.json()
    reservations.value = json.data || []
  } catch (err) {
    toast.error('Nepodarilo sa načítať rezervácie')
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchReservations)

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('sk-SK')

const formatTimeBlock = (iso, duration) => {
  const start = new Date(iso)
  const end = new Date(start.getTime() + duration * 60000)

  const f = d =>
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

  return `${f(start)} – ${f(end)}`
}
</script>

<style scoped>
.card {
  background: var(--white-aktive);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  padding: 24px;
}

.muted-text {
  font-size: 14px;
  color: var(--color-text-muted);
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.reservations-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 520px;
}

.reservations-table th {
  text-align: left;
  padding-bottom: 8px;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  font-weight: 500;
}

.reservations-table td {
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-main);
}

.status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-pending {
  background: var(--blue-light);
  color: var(--blue-dark);
}

.status-approved {
  background: var(--green);
  color: white;
}

.status-cancelled {
  background: var(--red-aktive);
  color: white;
}

.status-done {
  background: #e5e7eb;
  color: #374151;
}

.reservations-mobile {
  display: none;
  flex-direction: column;
  gap: 12px;
}

.reservation-card {
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 14px 16px;
  background: var(--white-aktive);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reservation-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.reservation-row .label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.reservation-row .value {
  font-size: 14px;
  color: var(--color-text-main);
  text-align: right;
}

@media (max-width: 768px) {
  .reservations-table {
    display: none;
  }

  .reservations-mobile {
    display: flex;
  }

  .card {
    padding: 18px;
  }
}

@media (max-width: 480px) {
  .reservation-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .reservation-row .value {
    text-align: left;
  }
}
</style>
