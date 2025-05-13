<template>
  <div class="login-card">
    <h2 class="login-title">Bem-vindo</h2>
    <p class="login-desc">Acesse sua conta para visualizar e agendar transferências.</p>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="contaOrigem">Número da Conta:</label>
        <input
          type="text"
          id="contaOrigem"
          v-model="contaOrigem"
          required
          pattern="[0-9]{10}"
          class="form-control"
          :class="{ 'error': errors.contaOrigem }"
          placeholder="Digite os 10 dígitos da sua conta"
        >
        <span class="error-message" v-if="errors.contaOrigem">{{ errors.contaOrigem }}</span>
      </div>
      <button type="submit" class="btn-primary">Entrar</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const contaOrigem = ref('')
    const errors = ref({})

    const validarConta = () => {
      errors.value = {}
      if (contaOrigem.value.length !== 10) {
        errors.value.contaOrigem = 'A conta deve ter 10 dígitos'
        return false
      }
      if (!/^\d+$/.test(contaOrigem.value)) {
        errors.value.contaOrigem = 'A conta deve conter apenas números'
        return false
      }
      return true
    }

    const handleLogin = async () => {
      if (!validarConta()) return

      try {
        const success = await store.dispatch('login', {
          contaOrigem: contaOrigem.value
        })
        if (success) {
          router.push('/agendamentos')
        }
      } catch (error) {
        console.error('Erro no login:', error)
        errors.value.contaOrigem = 'Erro ao realizar login'
      }
    }

    return {
      contaOrigem,
      errors,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-card {
  max-width: 380px;
  margin: 64px auto 0 auto;
  padding: 40px 32px 32px 32px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-icon {
  font-size: 3rem;
  margin-bottom: 12px;
  color: var(--primary);
}

.login-title {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

.login-desc {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 24px;
  text-align: center;
}

.form-group {
  margin-bottom: var(--spacing-lg);
  width: 100%;
  text-align: left;
}

label {
  display: block;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: var(--input-bg);
  color: var(--text-primary);
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
}

.form-control.error {
  border-color: var(--danger);
}

.error-message {
  color: var(--danger);
  font-size: 0.9em;
  margin-top: var(--spacing-xs);
  display: block;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  padding: 12px 0;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  width: 100%;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 8px;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.login-card form {
  width: 100%;
}
</style> 