<template>
  <div
    v-if="visible"
    class="modal-backdrop"
    @click.self="close"
  >
    <div class="modal-panel">
      <h2 class="modal-title">Pridať prácu do galérie</h2>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-field">
          <label class="form-field-label">Názov práce</label>
          <input
            v-model="form.title"
            type="text"
            class="form-field-input"
            :class="{ 'has-error': errors.title }"
          />
          <p v-if="errors.title" class="form-field-error">
            {{ errors.title }}
          </p>
        </div>

        <div class="form-field">
          <label class="form-field-label">Služba (voliteľné)</label>
          <select v-model="form.serviceId" class="form-field-input">
            <option :value="null">Bez služby</option>
            <option
              v-for="s in services"
              :key="s.id"
              :value="s.id"
            >
              {{ s.title }}
            </option>
          </select>
        </div>

        <div class="form-field">
          <label class="form-field-label">Fotografia pred</label>
          <input
            type="file"
            name="before"
            accept="image/*"
            class="form-field-input"
            @change="onBeforeChange"
          />
          <p v-if="errors.before" class="form-field-error">
            {{ errors.before }}
          </p>
        </div>

        <div class="form-field">
          <label class="form-field-label">Fotografia po</label>
          <input
            type="file"
            name="after"
            accept="image/*"
            class="form-field-input"
            @change="onAfterChange"
          />
          <p v-if="errors.after" class="form-field-error">
            {{ errors.after }}
          </p>
        </div>

        <div class="modal-actions">
          <button
            type="button"
            class="btn btn-ghost"
            @click="close"
          >
            Zrušiť
          </button>

          <button
            type="submit"
            class="btn btn-green"
          >
            Uložiť
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from "vue"
import { useToast } from "vue-toastification"

const toast = useToast()

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(["update:visible", "saved"])

const services = ref([])

const form = reactive({
  title: "",
  serviceId: null,
  beforeFile: null,
  afterFile: null
})

const errors = reactive({
  title: "",
  before: "",
  after: ""
})

watch(
  () => props.visible,
  (v) => {
    if (v) {
      form.title = ""
      form.serviceId = null
      form.beforeFile = null
      form.afterFile = null
      errors.title = ""
      errors.before = ""
      errors.after = ""
    }
  }
)

const close = () => {
  emit("update:visible", false)
}

const onBeforeChange = (e) => {
  form.beforeFile = e.target.files?.[0] || null
}

const onAfterChange = (e) => {
  form.afterFile = e.target.files?.[0] || null
}

const validate = () => {
  let ok = true
  errors.title = ""
  errors.before = ""
  errors.after = ""

  if (!form.title.trim()) {
    errors.title = "Názov je povinný."
    ok = false
  }

  if (!form.beforeFile) {
    errors.before = "Fotografia pred je povinná."
    ok = false
  }

  if (!form.afterFile) {
    errors.after = "Fotografia po je povinná."
    ok = false
  }

  if (!ok) {
    toast.error("Skontrolujte formulár.", {
      position: "bottom-center"
    })
  }

  return ok
}

const handleSubmit = async () => {
  if (!validate()) return

  const user = JSON.parse(localStorage.getItem("user"))

  const formData = new FormData()
  formData.append("title", form.title.trim())
  formData.append("userId", user.id)

  if (form.serviceId) {
    formData.append("serviceId", form.serviceId)
  }

  formData.append("before", form.beforeFile)
  formData.append("after", form.afterFile)

  try {
    const res = await fetch("http://localhost:5000/api/gallery", {
      method: "POST",
      body: formData
    })

    if (!res.ok) throw new Error()

    toast.success("Práca bola pridaná.", {
      position: "bottom-center"
    })

    emit("saved")
    emit("update:visible", false)
  } catch {
    toast.error("Chyba pri ukladaní galérie.", {
      position: "bottom-center"
    })
  }
}

onMounted(async () => {
  const res = await fetch("http://localhost:5000/api/services")
  const json = await res.json()
  services.value = json.data || []
})
</script>

<style scoped>
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-field-error {
  font-size: 12px;
  color: var(--red);
}
</style>
