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
            required
          ></textarea>
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
          />
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

const handleSubmit = () => {
  emit('save', {
    rating: localForm.rating,
    comment: localForm.comment,
    imgReview: localForm.imgReview || null,
    mode: props.mode
  })
  emit('update:visible', false)
}
</script>

<style scoped>
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
</style>
