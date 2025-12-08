<template>
  <div v-if="visible" class="backdrop" @click.self="cancel">
    <div class="modal">
      <div class="icon-wrap">
        <div class="icon">!</div>
      </div>

      <p class="text">Naozaj chcete vykonať túto akciu?</p>

      <div class="actions">
        <button class="btn btn-ghost" @click="cancel">Nie</button>
        <button class="btn btn-danger" @click="confirm">Áno</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, required: true }
})

const emit = defineEmits(['update:visible', 'confirm'])

const cancel = () => {
  emit('update:visible', false)
}

const confirm = () => {
  emit('confirm')
  emit('update:visible', false)
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  width: 100%;
  max-width: 300px;
  background: var(--white-aktive);
  border-radius: 14px;
  padding: 20px 18px;
  border: 1px solid var(--color-border);
  box-shadow: 0 14px 40px rgba(0,0,0,0.15);
  text-align: center;
}

.icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.12);
  color: var(--red);
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text {
  margin: 6px 0 16px;
  font-size: 14px;
  color: var(--color-text-main);
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

@media (max-width: 480px) {
  .actions {
    flex-direction: column;
  }
  .actions .btn {
    width: 100%;
  }
}
</style>
