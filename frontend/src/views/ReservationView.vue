<template>
  <section class="page-section">
    <div class="page-container reservation-container">
      <div class="reservation-card">

        <h1 class="reservation-title">Rezervácia služby</h1>
        <p class="reservation-subtitle">
          Vyberte službu, dátum a dostupný čas
        </p>

        <div class="form-field">
          <label class="form-field-label">Služba</label>
          <select v-model="selectedServiceId" class="form-field-input">
            <option disabled :value="null">Vyberte službu</option>
            <option v-for="s in services" :key="s.id" :value="s.id">
              {{ s.title }} ({{ s.durationMin }} min)
            </option>
          </select>
        </div>

        <div class="form-field">
          <label class="form-field-label">Dátum</label>
          <input
            type="date"
            v-model="selectedDate"
            class="form-field-input"
            :min="today"
          />
        </div>

        <div class="form-field">
          <label class="form-field-label">Dostupné časy</label>

          <p v-if="noSlots" class="no-slots-text">
            Pre tento deň už nie sú dostupné žiadne voľné termíny.
          </p>

          <div v-else class="slots-grid">
            <button
              v-for="slot in timeSlots"
              :key="slot.start"
              class="slot-btn"
              :class="{ active: selectedSlotStart === slot.start }"
              @click="selectedSlotStart = slot.start"
            >
              {{ slot.label }}
            </button>
          </div>
        </div>

        <div class="form-field">
          <label class="form-field-label">Poznámka</label>
          <textarea v-model="notes" class="form-field-textarea" />
        </div>

        <div class="reservation-actions">
          <button class="btn btn-ghost" @click="$router.back()">Späť</button>
          <button class="btn btn-primary" :disabled="!canSubmit" @click="submit">
            Potvrdiť rezerváciu
          </button>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useToast } from "vue-toastification"

const toast = useToast()
const route = useRoute()
const router = useRouter()

const services = ref([])
const busySlots = ref([])

const selectedServiceId = ref(null)
const selectedDate = ref("")
const selectedSlotStart = ref(null)
const notes = ref("")

const WORK_START = 9 * 60
const WORK_END = 17 * 60
const STEP = 30

const today = new Date().toISOString().split("T")[0]

onMounted(async () => {
  const res = await fetch("http://localhost:5000/api/services")
  const json = await res.json()
  services.value = json.data || []

  const pre = Number(route.query.serviceId)
  if (pre) selectedServiceId.value = pre
})

watch(selectedDate, async () => {
  if (!selectedDate.value) return

  const res = await fetch(
    `http://localhost:5000/api/appointments/busy?date=${selectedDate.value}`
  )
  const json = await res.json()
  busySlots.value = json.data || []
  selectedSlotStart.value = null
})

const selectedService = computed(() =>
  services.value.find(s => s.id === selectedServiceId.value)
)

const nowMinutes = computed(() => {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
})

const isToday = computed(() => selectedDate.value === today)

const timeSlots = computed(() => {
  if (!selectedService.value || !selectedDate.value) return []

  const slots = []
  const duration = selectedService.value.durationMin

  for (let start = WORK_START; start + duration <= WORK_END; start += STEP) {
    if (isToday.value && start <= nowMinutes.value) continue

    const end = start + duration

    const overlap = busySlots.value.some(b => {
      const bStart = new Date(b.dateTime).getTime()
      const bEnd = bStart + b.durationMin * 60000
      const sStart = toDate(start).getTime()
      const sEnd = toDate(end).getTime()
      return sStart < bEnd && sEnd > bStart
    })

    if (!overlap) {
      slots.push({
        start,
        label: `${format(start)} – ${format(end)}`
      })
    }
  }

  return slots
})

const noSlots = computed(() =>
  selectedService.value &&
  selectedDate.value &&
  timeSlots.value.length === 0
)

const canSubmit = computed(() =>
  selectedService.value &&
  selectedDate.value &&
  selectedSlotStart.value !== null
)

const toDate = (min) => {
  const d = new Date(`${selectedDate.value}T00:00:00`)
  d.setMinutes(min)
  return d
}

const format = (m) =>
  String(Math.floor(m / 60)).padStart(2, "0") +
  ":" +
  String(m % 60).padStart(2, "0")

const submit = async () => {
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user?.id) {
    toast.error("Nie ste prihlásený")
    return
  }

  const res = await fetch("http://localhost:5000/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      serviceId: selectedServiceId.value,
      dateTime: toDate(selectedSlotStart.value).toISOString(),
      notes: notes.value
    })
  })

  if (!res.ok) {
    const json = await res.json()
    const map = {
      MISSING_FIELDS: "Vyplňte všetky povinné polia",
      INVALID_DATE: "Neplatný dátum alebo čas",
      PAST_DATE: "Nie je možné rezervovať v minulosti",
      OUTSIDE_WORKING_HOURS: "Mimo pracovných hodín",
      TIME_NOT_AVAILABLE: "Tento termín je už obsadený",
      SERVICE_NOT_FOUND: "Služba neexistuje"
    }

    if (json?.errors?.length) {
      json.errors.forEach(e =>
        toast.error(map[e] || "Chyba pri rezervácii")
      )
    } else {
      toast.error("Chyba pri rezervácii")
    }
    return
  }

  toast.success("Rezervácia bola úspešná")
  router.push("/")
}
</script>

<style scoped>
.reservation-container {
  display: flex;
  justify-content: center;
}

.reservation-card {
  width: 100%;
  max-width: 500px;
  max-height: 800;
  background: var(--white-aktive);
  padding: 32px;
  border-radius: 16px;
  border: 1px solid var(--color-border);
}

.reservation-title {
  font-size: 28px;
  font-weight: 700;
}

.reservation-subtitle {
  font-size: 15px;
  color: var(--color-text-muted);
  margin-bottom: 24px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-field-input {
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 0 0px;
}

.form-field-textarea {
  min-height: 96px;
  resize: vertical;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 10px 10px;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.slot-btn {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: #fff;
  cursor: pointer;
}

.slot-btn.active {
  background: var(--blue);
  color: #fff;
  border-color: var(--blue);
}

.reservation-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 28px;
}

.no-slots-text {
  font-size: 14px;
  color: var(--red);
}

@media (max-width: 640px) {
  .reservation-card {
    padding: 20px;
  }

  .reservation-actions {
    flex-direction: column;
  }

  .reservation-actions .btn {
    width: 100%;
  }
}
</style>
