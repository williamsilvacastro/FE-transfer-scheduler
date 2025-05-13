<template>
  <Transition name="toast">
    <div v-if="show" :class="['toast', type]">
      <div class="toast-content">
        <span class="toast-icon">
          <span v-if="type === 'success'">✓ </span>
          <span v-else-if="type === 'error'">✕ </span>
          <span v-else>ℹ </span>
        </span>
        <span class="toast-message">{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'info'].includes(value)
    }
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: var(--bg-secondary);
  color: white;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slideIn 0.3s ease;
}

.toast.success {
  background-color: var(--success);
}

.toast.error {
  background-color: var(--danger);
}

.toast.warning {
  background-color: var(--warning);
}

.toast.info {
  background-color: var(--info);
}

.close-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: var(--spacing-xs);
  margin-left: var(--spacing-sm);
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.close-button:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style> 