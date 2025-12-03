<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-panel">
      <h2 class="modal-title">
        {{ mode === 'edit' ? 'Upraviť službu' : 'Vytvoriť službu' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
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
            class="btn btn-danger"
            @click="close"
          >
            Zrušiť
          </button>

          <button
            type="submit"
            class="btn btn-green"
          >
            {{ mode === 'edit' ? 'Uložiť zmeny' : 'Vytvoriť službu' }}
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
    if (value) {
      if (props.service && isEditMode.value) {
        localForm.id = props.service.id ?? null
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
    }
  },
  { immediate: true }
)

const close = () => {
  emit('update:visible', false)
}

const handleSubmit = () => {
  emit('save', {
    ...localForm,
    mode: isEditMode.value ? 'edit' : 'create'
  })
  emit('update:visible', false)
}
</script>
