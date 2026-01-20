<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-panel">
      <h2 class="modal-title">
        Napísať recenziu
      </h2>

      <form @submit.prevent="handleSubmit" class="modal-form">

        <!-- RATING -->
        <div class="form-field">
          <label class="form-field-label">
            Hodnotenie (1 – 5)
          </label>

          <div class="rating-wrapper">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="rating-star"
              :class="{ active: star <= localForm.rating }"
              @click="setRating(star)"
            >
              ★
            </button>

            <span class="rating-value">
              {{ localForm.rating }} / 5
            </span>
          </div>
        </div>

        <!-- COMMENT -->
        <div class="form-field">
          <label class="form-field-label">
            Vaša skúsenosť
          </label>

          <textarea
            v-model="localForm.comment"
            rows="4"
            class="form-field-textarea"
            :class="{ 'has-error': !!errors.comment }"
            placeholder="Opíšte, ako ste boli spokojný s umývaním..."
          ></textarea>

          <p v-if="errors.comment" class="form-field-error">
            {{ errors.comment }}
          </p>
        </div>

        <!-- IMAGE FILE -->
        <div class="form-field">
          <label class="form-field-label">
            Obrázok (voliteľné)
          </label>

          <input
            type="file"
            accept="image/*"
            class="form-field-input"
            @change="onFileChange"
          />
        </div>

        <!-- ACTIONS -->
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
            Odoslať recenziu
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  visible: Boolean,
  mode: {
    type: String,
    default: 'create'
  },
  review: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'save'])

const localForm = reactive({
  rating: 5,
  comment: '',
  imageFile: null
})

const errors = reactive({
  comment: ''
})

watch(
  () => props.visible,
  (v) => {
    if (!v) return

    localForm.rating = props.review?.rating ?? 5
    localForm.comment = props.review?.comment ?? ''
    localForm.imageFile = null
    errors.comment = ''
  },
  { immediate: true }
)

const close = () => {
  emit('update:visible', false)
}

const setRating = (value) => {
  if (value < 1) value = 1
  if (value > 5) value = 5
  localForm.rating = value
}

const onFileChange = (e) => {
  localForm.imageFile = e.target.files?.[0] || null
}

const validate = () => {
  errors.comment = ''

  const text = localForm.comment.trim()
  if (!text || text.length < 5) {
    errors.comment = 'Komentár musí mať aspoň 5 znakov.'
    toast.error('Skontrolujte si formulár recenzie.', {
      position: 'bottom-center'
    })
    return false
  }

  return true
}

const handleSubmit = () => {
  if (!validate()) return

  const formData = new FormData()
  formData.append('rating', String(localForm.rating))
  formData.append('comment', localForm.comment.trim())

  if (localForm.imageFile) {
    formData.append('imgReview', localForm.imageFile)
  }

  emit('save', formData)
  emit('update:visible', false)
}
</script>

<style scoped>
/* ❗ СТИЛИ НЕ ТРОНУТЫ */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.form-field-textarea,
.form-field-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-size: 14px;
  outline: none;
  transition: 0.15s ease;
}

.form-field-textarea.has-error {
  border-color: var(--red);
}

.form-field-error {
  font-size: 12px;
  color: var(--red);
}

.rating-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-star {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 22px;
  color: var(--color-text-muted);
}

.rating-star.active {
  color: #f5a623;
}

.rating-value {
  font-size: 13px;
  color: var(--color-text-muted);
}

.modal-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
