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
            :class="{ 'has-error': !!errors.title }"
          />
          <p v-if="errors.title" class="form-field-error">
            {{ errors.title }}
          </p>
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
            :class="{ 'has-error': !!errors.description }"
            placeholder="Stručný popis toho, čo táto služba zahŕňa."
          ></textarea>
          <p v-if="errors.description" class="form-field-error">
            {{ errors.description }}
          </p>
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
              step=""
              class="form-field-input"
              :class="{ 'has-error': !!errors.price }"
            />
            <p v-if="errors.price" class="form-field-error">
              {{ errors.price }}
            </p>
          </div>

          <div class="form-field">
            <label class="form-field-label" for="service-duration">
              Trvanie (min)
            </label>
            <input
              id="service-duration"
              v-model.number="localForm.durationMin"
              type="number"
              min="0"
              step="5"
              class="form-field-input"
              :class="{ 'has-error': !!errors.durationMin }"
            />
            <p v-if="errors.durationMin" class="form-field-error">
              {{ errors.durationMin }}
            </p>
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
import { useToast } from 'vue-toastification'

const toast = useToast()

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

const errors = reactive({
  title: '',
  description: '',
  price: '',
  durationMin: ''
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

    errors.title = ''
    errors.description = ''
    errors.price = ''
    errors.durationMin = ''
  },
  { immediate: true }
)

const close = () => {
  emit('update:visible', false)
}

const validate = () => {
  let isValid = true

  errors.title = ''
  errors.description = ''
  errors.price = ''
  errors.durationMin = ''

  const title = String(localForm.title).trim()
  const description = String(localForm.description).trim()

  if (!title) {
    errors.title = 'Názov nesmie byť prázdny.'
    isValid = false
  } else if (title.length < 3) {
    errors.title = 'Názov musí mať aspoň 3 znaky.'
    isValid = false
  }

  if (!description) {
    errors.description = 'Popis nesmie byť prázdny.'
    isValid = false
  } else if (description.length < 5) {
    errors.description = 'Popis musí mať aspoň 5 znakov.'
    isValid = false
  }

  if (localForm.price == null || isNaN(localForm.price)) {
    errors.price = 'Cena musí byť číslo.'
    isValid = false
  } else if (localForm.price <= 0) {
    errors.price = 'Cena musí byť väčšia ako 0.'
    isValid = false
  }

  if (localForm.durationMin == null || isNaN(localForm.durationMin)) {
    errors.durationMin = 'Trvanie musí byť číslo.'
    isValid = false
  } else if (localForm.durationMin <= 0) {
    errors.durationMin = 'Trvanie musí byť väčšie ako 0.'
    isValid = false
  }

  if (!isValid) {
    toast.error('Skontrolujte si údaje služby.', {
      position: 'bottom-center'
    })
  }

  return isValid
}


const handleSubmit = () => {
  if (!validate()) return

  const trimmedTitle = localForm.title.trim()
  const trimmedDescription = localForm.description.trim()

  emit('save', {
    id: localForm.id,
    title: trimmedTitle,
    description: trimmedDescription,
    price: localForm.price,
    durationMin: localForm.durationMin,
    mode: isEditMode.value ? 'edit' : 'create'
  })

  toast.success(
    isEditMode.value ? 'Služba bola upravená.' : 'Služba bola vytvorená.',
    { position: 'bottom-center' }
  )

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

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-main);
}

.form-field-input,
.form-field-textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-size: 14px;
  outline: none;
  transition: 0.15s ease;
}

.form-field-input:focus,
.form-field-textarea:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.form-field-input.has-error,
.form-field-textarea.has-error {
  border-color: var(--red);
}

.form-field-error {
  font-size: 12px;
  color: var(--red);
}

.form-row-two {
  display: flex;
  column-gap: 50px;      
  margin-top: 16px;      
  margin-bottom: 16px;   
}

.form-row-two .form-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px; 
}

@media (max-width: 480px) {
  .form-row-two {
    flex-direction: column;
    row-gap: 16px;
    column-gap: 0;
  }
}

.modal-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 480px) {
  .form-row-two {
    flex-direction: column;
  }
}
</style>
