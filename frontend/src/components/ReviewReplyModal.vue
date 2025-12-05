<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-panel">
      <h2 class="modal-title">
        {{ mode === 'edit' ? 'Upraviť odpoveď' : 'Odpovedať na recenziu' }}
      </h2>

      <form @submit.prevent="handleSubmit" >
        <div class="form-field">
          <textarea
            id="admin-reply"
            v-model="localReply"
            rows="4"
            class="form-field-textarea"
            required
          ></textarea>
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

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  mode: {
    type: String,
    default: 'create' // 'create' | 'edit'
  },
  review: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'save'])

const localReply = ref('')

watch(
  () => props.visible,
  (value) => {
    if (value) {
      if (props.review && props.mode === 'edit') {
        localReply.value = props.review.adminReview ?? ''
      } else {
        localReply.value = ''
      }
    }
  },
  { immediate: true }
)

const close = () => {
  emit('update:visible', false)
}

const handleSubmit = () => {
  if (!props.review || !props.review.id) return

  emit('save', {
    id: props.review.id,
    adminReview: localReply.value,
    mode: props.mode
  })
  emit('update:visible', false)
}
</script>
