<template>
  <div v-if="visible" class="modal-backdrop" @click.self="close">
    <div class="modal-panel">
      <div class="modal-header">
        <div>
          <h2 class="modal-title">
            {{ isEditMode ? 'Upraviť službu' : 'Vytvoriť novú službu' }}
          </h2>
          <p class="modal-subtitle">
            {{ isEditMode
              ? 'Upravte údaje existujúcej služby.'
              : 'Vyplňte údaje pre novú službu.' }}
          </p>
        </div>

        <span class="modal-chip">
          {{ isEditMode ? 'Edit' : 'Create' }}
        </span>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">

        <div class="form-field">
          <label class="form-field-label" for="service-title">
            Názov služby
          </label>
          <input id="service-title" v-model="localForm.title" type="text" class="form-field-input"
            :class="{ 'has-error': !!errors.title }" />
          <p v-if="errors.title" class="form-field-error">
            {{ errors.title }}
          </p>
        </div>

        <div class="form-field">
          <label class="form-field-label" for="service-description">
            Popis
          </label>
          <textarea id="service-description" v-model="localForm.description" rows="3" class="form-field-textarea"
            :class="{ 'has-error': !!errors.description }" placeholder="Stručný popis toho, čo táto služba zahŕňa." />
          <p v-if="errors.description" class="form-field-error">
            {{ errors.description }}
          </p>
        </div>

        <div class="form-row-two">
          <div class="form-field">
            <label class="form-field-label" for="service-price">
              Cena (€)
            </label>
            <input id="service-price" v-model.number="localForm.price" type="number" min="0" class="form-field-input"
              :class="{ 'has-error': !!errors.price }" />
            <p v-if="errors.price" class="form-field-error">
              {{ errors.price }}
            </p>
          </div>

          <div class="form-field">
            <label class="form-field-label" for="service-duration">
              Trvanie (min)
            </label>
            <input id="service-duration" v-model.number="localForm.durationMin" type="number" min="0" step="5"
              class="form-field-input" :class="{ 'has-error': !!errors.durationMin }" />
            <p v-if="errors.durationMin" class="form-field-error">
              {{ errors.durationMin }}
            </p>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" @click="close">
            Zrušiť
          </button>

          <button type="submit" class="btn btn-blue">
            {{ isEditMode ? 'Uložiť zmeny' : 'Vytvoriť službu' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue"
import { useToast } from "vue-toastification"

const toast = useToast()

const props = defineProps({
  visible: Boolean,
  mode: { type: String, default: "create" },
  service: { type: Object, default: null }
})

const emit = defineEmits(["update:visible", "save"])

const isEditMode = computed(() => props.mode === "edit")

const localForm = reactive({
  id: null,
  title: "",
  description: "",
  price: 0,
  durationMin: 30
})

const errors = reactive({
  title: "",
  description: "",
  price: "",
  durationMin: ""
})

watch(
  () => props.visible,
  (v) => {
    if (!v) return

    if (props.service && isEditMode.value) {
      Object.assign(localForm, props.service)
    } else {
      localForm.id = null
      localForm.title = ""
      localForm.description = ""
      localForm.price = 0
      localForm.durationMin = 30
    }

    Object.keys(errors).forEach(k => errors[k] = "")
  },
  { immediate: true }
)

const close = () => emit("update:visible", false)

const validate = () => {
  let ok = true
  Object.keys(errors).forEach(k => errors[k] = "")

  if (!localForm.title.trim()) {
    errors.title = "Názov je povinný."
    ok = false
  }

  if (!localForm.description.trim()) {
    errors.description = "Popis je povinný."
    ok = false
  }

  if (localForm.price <= 0) {
    errors.price = "Cena musí byť väčšia ako 0."
    ok = false
  }

  if (localForm.durationMin <= 0) {
    errors.durationMin = "Trvanie musí byť väčšie ako 0."
    ok = false
  }

  if (!ok) {
    toast.error("Skontrolujte formulár.", { position: "bottom-center" })
  }

  return ok
}

const handleSubmit = () => {
  if (!validate()) return

  emit("save", {
    ...localForm,
    mode: isEditMode.value ? "edit" : "create"
  })

  toast.success(
    isEditMode.value ? "Služba upravená." : "Služba vytvorená.",
    { position: "bottom-center" }
  )

  close()
}
</script>

<style scoped>
.modal-panel {
  width: 100%;
  max-width: 520px;
  padding: 22px 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.modal-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
}

.modal-chip {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 99px;
  background: var(--grey-light);
  align-self: center;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-field-input,
.form-field-textarea {
  padding: 12px 0px;
  border-radius: 10px;
}

.form-row-two {
  display: flex;
  gap: 24px;
}

.modal-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-field-error {
  font-size: 12px;
  color: var(--red);
  margin-top: 4px;
}

.has-error {
  border-color: var(--red) !important;
}

@media (max-width: 480px) {
  .modal-panel {
    padding: 18px 16px;
  }

  .modal-header {
    flex-direction: column;
    gap: 6px;
  }

  .form-row-two {
    flex-direction: column;
    gap: 14px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions .btn {
    width: 100%;
  }
}
</style>
