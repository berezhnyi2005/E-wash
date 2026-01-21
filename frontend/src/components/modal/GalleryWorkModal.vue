<template>
  <div v-if="visible" class="modal-backdrop" @click.self="close">
    <div class="modal-panel">
      <h2 class="modal-title">
        {{ isEdit ? "Upraviť prácu v galérii" : "Pridať prácu do galérie" }}
      </h2>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-field">
          <label class="form-field-label">Názov práce</label>
          <input v-model="form.title" class="form-field-input" :class="{ 'has-error': errors.title }" />
          <p v-if="errors.title" class="form-field-error">
            {{ errors.title }}
          </p>
        </div>

        <div class="form-field">
          <label class="form-field-label">Služba (voliteľné)</label>
          <select v-model="form.serviceId" class="form-field-input">
            <option :value="null">Bez služby</option>
            <option v-for="s in services" :key="s.id" :value="s.id">
              {{ s.title }}
            </option>
          </select>
        </div>

        <div class="form-field">
          <label class="form-field-label">
            Fotografia pred {{ isEdit ? "(voliteľné)" : "*" }}
          </label>
          <input type="file" accept="image/*" @change="e => form.beforeFile = e.target.files[0]"
            :class="{ 'has-error': errors.before }" />
          <p v-if="errors.before" class="form-field-error">
            {{ errors.before }}
          </p>
        </div>

        <div class="form-field">
          <label class="form-field-label">
            Fotografia po {{ isEdit ? "(voliteľné)" : "*" }}
          </label>
          <input type="file" accept="image/*" @change="e => form.afterFile = e.target.files[0]"
            :class="{ 'has-error': errors.after }" />
          <p v-if="errors.after" class="form-field-error">
            {{ errors.after }}
          </p>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" @click="close">
            Zrušiť
          </button>
          <button type="submit" class="btn btn-green">
            {{ isEdit ? "Uložiť zmeny" : "Uložiť" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, computed, onMounted } from "vue"
import { useToast } from "vue-toastification"

const toast = useToast()

const props = defineProps({
  visible: Boolean,
  item: Object
})

const emit = defineEmits(["update:visible", "saved"])

const services = ref([])

const isEdit = computed(() => !!props.item)

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
  v => {
    if (v) {
      form.title = props.item?.title || ""
      form.serviceId = props.item?.serviceId || null
      form.beforeFile = null
      form.afterFile = null
      errors.title = ""
      errors.before = ""
      errors.after = ""
    }
  }
)

const close = () => emit("update:visible", false)

const validate = () => {
  errors.title = ""
  errors.before = ""
  errors.after = ""

  let ok = true

  if (!form.title.trim()) {
    errors.title = "Názov je povinný."
    ok = false
  }

  if (!isEdit.value) {
    if (!form.beforeFile) {
      errors.before = "Fotografia pred je povinná."
      ok = false
    }
    if (!form.afterFile) {
      errors.after = "Fotografia po je povinná."
      ok = false
    }
  }

  return ok
}

const handleSubmit = async () => {
  if (!validate()) {
    toast.error("Skontrolujte formulár.")
    return
  }

  const fd = new FormData()
  fd.append("title", form.title.trim())

  if (form.serviceId) fd.append("serviceId", form.serviceId)
  if (form.beforeFile) fd.append("before", form.beforeFile)
  if (form.afterFile) fd.append("after", form.afterFile)

  const url = isEdit.value
    ? `http://localhost:5000/api/gallery/${props.item.id}`
    : `http://localhost:5000/api/gallery`

  const method = isEdit.value ? "PUT" : "POST"

  await fetch(url, { method, body: fd })

  emit("saved")
  close()
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

.has-error {
  border-color: var(--red);
}
</style>
