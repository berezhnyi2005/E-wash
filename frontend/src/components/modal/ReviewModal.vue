<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-panel">
      <h2 class="modal-title">
        Napísať recenziu
      </h2>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-field">
          <label class="form-field-label" for="review-rating">
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
        <div class="form-field">
          <label class="form-field-label" for="review-comment">
            Vaša skúsenosť
          </label>
          <textarea
            id="review-comment"
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
        <div class="form-field">
          <label class="form-field-label" for="review-image">
            Obrázok (URL, voliteľné)
          </label>
          <input
            id="review-image"
            v-model="localForm.imgReview"
            type="text"
            placeholder="https://..."
            class="form-field-input"
            :class="{ 'has-error': !!errors.imgReview }"
          />
          <p v-if="errors.imgReview" class="form-field-error">
            {{ errors.imgReview }}
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
  visible: {
    type: Boolean,
    required: true
  },
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
  imgReview: ''
})

const errors = reactive({
  comment: '',
  imgReview: ''
})

watch(
  () => props.visible,
  (value) => {
    if (value) {
      if (props.review && props.mode === 'edit') {
        localForm.rating = props.review.rating ?? 5
        localForm.comment = props.review.comment ?? ''
        localForm.imgReview = props.review.imgReview ?? ''
      } else {
        localForm.rating = 5
        localForm.comment = ''
        localForm.imgReview = ''
      }

      errors.comment = ''
      errors.imgReview = ''
    }
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

const validate = () => {
  let isValid = true

  errors.comment = ''
  errors.imgReview = ''

  const trimmedComment = localForm.comment.trim()
  if (!trimmedComment) {
    errors.comment = 'Komentár nesmie byť prázdny.'
    isValid = false
  } else if (trimmedComment.length < 5) {
    errors.comment = 'Komentár musí mať aspoň 5 znakov.'
    isValid = false
  }

  const trimmedImg = localForm.imgReview.trim()
  if (trimmedImg && trimmedImg.length < 10) {
    errors.imgReview = 'URL adresa je nesprávna, skontrolujte ju.'
    isValid = false
  }

  if (!isValid) {
    toast.error('Skontrolujte si formulár recenzie.', {
      position: 'bottom-center'
    })
  }

  return isValid
}

const handleSubmit = () => {
  if (!validate()) return

  const trimmedComment = localForm.comment.trim()
  const trimmedImg = localForm.imgReview.trim()

  emit('save', {
    rating: localForm.rating,
    comment: trimmedComment,
    imgReview: trimmedImg || null,
    mode: props.mode
  })

  toast.success(
    props.mode === 'edit'
      ? 'Recenzia bola upravená.'
      : 'Recenzia bola odoslaná. Ďakujeme!',
    { position: 'bottom-center' }
  )

  emit('update:visible', false)
}
</script>

<style scoped>
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

.form-field-textarea:focus,
.form-field-input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.form-field-textarea.has-error,
.form-field-input.has-error {
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
  padding: 0;
  margin: 0 2px;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  color: var(--color-text-muted);
  transition: transform 0.1s ease, color 0.1s ease;
}

.rating-star.active {
  color: #f5a623;
}

.rating-star:hover {
  transform: scale(1.1);
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
