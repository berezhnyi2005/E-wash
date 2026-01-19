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

        <table v-else class="reservations-table">
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
                <span
                  class="status"
                  :class="`status-${r.status.toLowerCase()}`"
                >
                  {{ r.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

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

    const res = await fetch(
      `http://localhost:5000/api/appointments/my/${user.id}`
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

/* helpers */
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

.reservations-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.reservations-table th {
  text-align: left;
  padding-bottom: 8px;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}

.reservations-table td {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

/* STATUS */
.status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: var(--blue-light);
  color: var(--blue-dark);
}

.status-confirmed {
  background: var(--green);
  color: white;
}

.status-canceled {
  background: var(--red-aktive);
  color: white;
}
</style>
