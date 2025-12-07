<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-panel">
      <div class="modal-header">
        <div>
          <h2 class="modal-title">
            {{ isEditMode ? 'Upraviť službu' : 'Vytvoriť novú službu' }}
          </h2>
          <p class="modal-subtitle">
            {{ isEditMode ? 'Upravte údaje existujúcej služby.' : 'Vyplňte údaje pre novú službu.' }}
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
          <input
            id="service-title"
            v-model="localForm.title"
            type="text"
            class="form-field-input"
            required
          />
        </div>

        <div class="form-field">
          <label class="form-field-label" for="service-description">
            Popis
          </label>
          <textarea
            id="service-description"
            v-model="localForm.description"
            rows="3"
            class="form-field-textarea"
            placeholder="Stručný popis toho, čo táto služba zahŕňa."
          ></textarea>
        </div>

        <div class="form-row-two">
          <div class="form-field">
            <label class="form-field-label" for="service-price">
              Cena (€)
            </label>
            <input
              id="service-price"
              v-model.number="localForm.price"
              type="number"
              min="0"
              step="0.5"
              class="form-field-input"
              required
            />
          </div>

          <div class="form-field">
            <label class="form-field-label" for="service-duration">
              Trvanie (min)
            </label>
            <input
              id="service-duration"
              v-model.number="localForm.durationMin"
              type="number"
              min="10"
              step="5"
              class="form-field-input"
              required
            />
          </div>
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
            class="btn btn-blue"
          >
            {{ isEditMode ? 'Uložiť zmeny' : 'Vytvoriť službu' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  mode: {
    type: String,
    default: 'create' // 'create' | 'edit'
  },
  service: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'save'])

const localForm = reactive({
  id: null,
  title: '',
  description: '',
  price: 0,
  durationMin: 30
})

const isEditMode = computed(() => props.mode === 'edit')

watch(
  () => props.visible,
  (value) => {
    if (!value) return

    if (props.service && props.service.id && isEditMode.value) {
      localForm.id = props.service.id
      localForm.title = props.service.title ?? ''
      localForm.description = props.service.description ?? ''
      localForm.price = props.service.price ?? 0
      localForm.durationMin = props.service.durationMin ?? 30
    } else {
      localForm.id = null
      localForm.title = ''
      localForm.description = ''
      localForm.price = 0
      localForm.durationMin = 30
    }
  },
  { immediate: true }
)

const close = () => {
  emit('update:visible', false)
}

const handleSubmit = () => {
  emit('save', {
    id: localForm.id,
    title: localForm.title,
    description: localForm.description,
    price: localForm.price,
    durationMin: localForm.durationMin,
    mode: isEditMode.value ? 'edit' : 'create'
  })
  emit('update:visible', false)
}
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.modal-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--color-text-muted);
}

.modal-chip {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background-color: var(--grey-light);
  color: var(--color-text-main);
  white-space: nowrap;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>
