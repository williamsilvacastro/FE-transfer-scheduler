<template>
  <div class="agendamento">
    <h2>Novo Agendamento de Transferência</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="contaDestino">Conta de Destino:</label>
        <input
          type="text"
          id="contaDestino"
          v-model="form.contaDestino"
          required
          pattern="[0-9]{10}"
          class="form-control"
          :class="{ 'error': errors.contaDestino }"
        >
        <span class="error-message" v-if="errors.contaDestino">{{ errors.contaDestino }}</span>
      </div>

      <div class="form-group">
        <label for="valor">Valor da Transferência:</label>
        <input
          type="text"
          id="valor"
          v-model="valorFormatado"
          required
          class="form-control"
          :class="{ 'error': errors.valor }"
          @input="handleValorInput"
          placeholder="R$ 0,00"
        >
        <span class="error-message" v-if="errors.valor">{{ errors.valor }}</span>
      </div>

      <div class="form-group">
        <label for="dataTransferencia">Data e Hora da Transferência:</label>
        <input
          type="datetime-local"
          id="dataTransferencia"
          v-model="form.dataTransferencia"
          required
          :min="minDateTime"
          class="form-control"
          :class="{ 'error': errors.dataTransferencia }"
        >
        <span class="error-message" v-if="errors.dataTransferencia">{{ errors.dataTransferencia }}</span>
      </div>

      <div v-if="taxaCalculada" class="info-box">
        <p>Taxa Estimada: R$ {{ taxaCalculada.toFixed(2) }}</p>
      </div>

      <div class="button-group">
        <button type="submit" class="btn-primary">Agendar</button>
        <button type="button" @click="limparFormulario" class="btn-secondary">Limpar</button>
      </div>
    </form>

    <Toast
      :show="toast.show.value"
      :message="toast.message.value"
      :type="toast.type.value"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Toast from '@/components/Toast.vue'
import { useToast } from '@/composables/useToast'

export default {
  name: 'AgendamentoTransferencia',
  components: {
    Toast
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const errors = ref({})
    const toast = useToast()

    const form = ref({
      contaDestino: '',
      valor: '',
      dataTransferencia: ''
    })

    const valorFormatado = ref('')

    const minDateTime = computed(() => {
      const now = new Date()
      return now.toISOString().slice(0, 16)
    })

    const calcularTaxa = (valor, dataTransferencia) => {
      const hoje = new Date()
      const dataTransferenciaObj = new Date(dataTransferencia)
      const diffDias = Math.floor((dataTransferenciaObj - hoje) / (1000 * 60 * 60 * 24))

      if (diffDias === 0) {
        return 12 + (valor * 0.025)
      } else if (diffDias >= 1 && diffDias <= 10) {
        return 12
      } else if (diffDias >= 11 && diffDias <= 20) {
        return valor * 0.082
      } else if (diffDias >= 21 && diffDias <= 30) {
        return valor * 0.069
      } else if (diffDias >= 31 && diffDias <= 40) {
        return valor * 0.047
      } else if (diffDias >= 41 && diffDias <= 50) {
        return valor * 0.017
      }
      return null
    }

    const taxaCalculada = computed(() => {
      if (!form.value.valor || !form.value.dataTransferencia) return null
      return calcularTaxa(Number(form.value.valor), form.value.dataTransferencia)
    })

    const formatarValor = (valor) => {
      if (typeof valor !== 'string') return 'R$ 0,00';

      // Remove caracteres não numéricos
      const apenasNumeros = valor.replace(/\D/g, '');

      // Garante pelo menos 3 dígitos para evitar problemas ao extrair centavos
      const numeroComZeroEsquerda = apenasNumeros.padStart(3, '0');

      // Separa centavos e reais
      const centavos = numeroComZeroEsquerda.slice(-2);
      const reais = numeroComZeroEsquerda.slice(0, -2);

      // Formata os reais com separador de milhar
      const reaisFormatados = Number(reais).toLocaleString('pt-BR');

      return `R$ ${reaisFormatados},${centavos}`;
    };

    const handleValorInput = (event) => {
      const valor = event.target.value
      valorFormatado.value = formatarValor(valor)
      
      // Atualiza o valor no form (em centavos)
      const numero = valor.replace(/\D/g, '')
      form.value.valor = numero ? Number(numero) / 100 : ''
    }

    const validarFormulario = () => {
      errors.value = {}

      if (form.value.contaDestino.length !== 10) {
        errors.value.contaDestino = 'A conta de destino deve ter 10 dígitos'
      }

      if (form.value.contaDestino === store.state.auth.contaOrigem) {
        errors.value.contaDestino = 'A conta de destino não pode ser igual à sua conta'
      }

      if (!form.value.valor || form.value.valor <= 0) {
        errors.value.valor = 'O valor deve ser maior que zero'
      }

      if (!form.value.dataTransferencia) {
        errors.value.dataTransferencia = 'A data e hora de transferência são obrigatórias'
      } else if (new Date(form.value.dataTransferencia) < new Date()) {
        errors.value.dataTransferencia = 'A data e hora de transferência não podem ser no passado'
      }

      return Object.keys(errors.value).length === 0
    }

    const handleSubmit = async () => {
      if (!validarFormulario()) return

      try {
        const agendamento = {
          contaDestino: form.value.contaDestino,
          valor: Number(form.value.valor),
          dataTransferencia: form.value.dataTransferencia
        }

        await store.dispatch('criarAgendamento', agendamento)
        toast.success('Transferência agendada com sucesso!')
        setTimeout(() => {
          router.push('/agendamentos')
        }, 1500)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erro ao agendar transferência')
      }
    }

    const limparFormulario = () => {
      form.value = {
        contaDestino: '',
        valor: '',
        dataTransferencia: ''
      }
      valorFormatado.value = ''
      errors.value = {}
    }

    return {
      form,
      errors,
      minDateTime,
      taxaCalculada,
      valorFormatado,
      handleValorInput,
      handleSubmit,
      limparFormulario,
      toast
    }
  }
}
</script>

<style scoped>
.agendamento-container, .agendamento {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
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
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
}

.form-control::placeholder {
  color: var(--text-muted);
}

.error-message {
  color: var(--danger);
  font-size: 0.9em;
  margin-top: var(--spacing-xs);
}

.btn-submit {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.btn-submit:hover {
  background-color: var(--primary-hover);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  color: var(--text-secondary);
  text-align: center;
  padding: var(--spacing-xl);
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary, .btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-secondary {
  background-color: #666;
  color: white;
}

.btn-primary:hover {
  background-color: #3aa876;
}

.btn-secondary:hover {
  background-color: #555;
}

.info-box {
  background-color: var(--info-box-bg);
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
  text-align: left;
  color: var(--info-box-text);
  font-weight: bold;
}
</style> 