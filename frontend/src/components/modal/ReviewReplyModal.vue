<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-panel">
      <h2 class="modal-title">
        {{ mode === 'edit' ? 'Upraviť odpoveď' : 'Odpovedať na recenziu' }}
      </h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-field">
          <label
            for="admin-reply"
            class="form-field-label"
          >
            Odpoveď na recenziu
          </label>

          <textarea
            id="admin-reply"
            v-model="localReply"
            rows="4"
            class="form-field-textarea"
            :class="{ 'has-error': !!errorMessage }"
          ></textarea>

          <p
            v-if="errorMessage"
            class="form-field-error"
          >
            {{ errorMessage }}
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
            {{ mode === 'edit' ? 'Uložiť odpoveď' : 'Odoslať odpoveď' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  visible: Boolean,
  mode: {
    type: String,
    default: 'create'
  },
  review: Object
})

const emit = defineEmits(['update:visible', 'save'])

const localReply = ref('')
const errorMessage = ref('')

watch(
  () => props.visible,
  (value) => {
    if (!value) return

    if (props.review && props.mode === 'edit') {
      localReply.value = props.review.adminReview ?? ''
    } else {
      localReply.value = ''
    }

    errorMessage.value = ''
  },
  { immediate: true }
)

const close = () => {
  emit('update:visible', false)
}

const validate = () => {
  errorMessage.value = ''

  const trimmed = localReply.value.trim()

  if (!trimmed) {
    errorMessage.value = 'Odpoveď nemôže byť prázdna.'
  } else if (trimmed.length < 3) {
    errorMessage.value = 'Odpoveď musí mať aspoň 3 znaky.'
  }

  if (errorMessage.value) {
    toast.error(errorMessage.value, {
      position: 'bottom-center'
    })
    return false
  }

  return true
}

const handleSubmit = () => {
  if (!props.review?.id) return
  if (!validate()) return

  emit('save', {
    id: props.review.id,
    adminReview: localReply.value.trim()
  })

  emit('update:visible', false)
}
</script>

<style scoped>
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

.form-field-textarea {
  width: 100%;
  min-height: 120px;
  padding: 10px 0px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-size: 14px;
  resize: vertical;
}

.form-field-textarea.has-error {
  border-color: var(--red);
}

.form-field-error {
  font-size: 12px;
  color: var(--red);
}

.modal-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
