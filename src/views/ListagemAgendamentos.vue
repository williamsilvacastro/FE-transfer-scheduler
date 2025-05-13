<template>
  <div class="listagem">
    <h2>Agendamentos de Transferência</h2>
    
    <div class="actions">
      <router-link to="/novo-agendamento" class="btn-primary">Novo Agendamento</router-link>
    </div>

    <div v-if="loading" class="loading">
      Carregando...
    </div>

    <div v-else-if="agendamentos.length === 0" class="empty-state">
      Nenhum agendamento encontrado.
    </div>

    <div v-else>
      <table class="agendamentos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Conta Origem</th>
            <th>Conta Destino</th>
            <th>Valor</th>
            <th>Taxa</th>
            <th>Data Agendamento</th>
            <th>Data Transferência</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="agendamento in agendamentos" :key="agendamento.id">
            <td>{{ agendamento.id }}</td>
            <td>{{ agendamento.contaOrigem }}</td>
            <td>{{ agendamento.contaDestino }}</td>
            <td>R$ {{ agendamento.valor.toFixed(2) }}</td>
            <td>R$ {{ agendamento.taxa.toFixed(2) }}</td>
            <td>{{ formatarData(agendamento.dataAgendamento) }}</td>
            <td>{{ formatarData(agendamento.dataTransferencia) }}</td>
            <td>
              <button
                @click="confirmarExclusao(agendamento.id)"
                class="btn-danger"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="totalPages > 1" class="pagination">
        <button
          :disabled="currentPage === 0"
          @click="mudarPagina(currentPage - 1)"
          class="btn-page"
        >
          Anterior
        </button>
        <span class="page-info">
          Página {{ currentPage + 1 }} de {{ totalPages }}
        </span>
        <button
          :disabled="currentPage === totalPages - 1"
          @click="mudarPagina(currentPage + 1)"
          class="btn-page"
        >
          Próxima
        </button>
      </div>
    </div>

    <Toast
      :show="toast.show.value"
      :message="toast.message.value"
      :type="toast.type.value"
    />

    <ConfirmDialog
      v-model="showConfirmDialog"
      title="Confirmar Exclusão"
      message="Tem certeza que deseja excluir este agendamento?"
      confirmText="Excluir"
      @confirm="handleExclusaoConfirmada"
    />
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import Toast from '@/components/Toast.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useToast } from '@/composables/useToast'

export default {
  name: 'ListagemAgendamentos',
  components: {
    Toast,
    ConfirmDialog
  },
  setup() {
    const store = useStore()
    const loading = computed(() => store.state.loading)
    const agendamentos = computed(() => store.state.agendamentos)
    const currentPage = computed(() => store.state.pagination.currentPage)
    const totalPages = computed(() => store.state.pagination.totalPages)
    const toast = useToast()
    const showConfirmDialog = ref(false)
    const agendamentoParaExcluir = ref(null)

    const formatarData = (data) => {
      return new Date(data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const carregarAgendamentos = async (page = 0) => {
      try {
        await store.dispatch('fetchAgendamentos', { page, size: 10 })
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error)
        toast.error('Erro ao carregar agendamentos')
      }
    }

    const mudarPagina = (page) => {
      carregarAgendamentos(page)
    }

    const confirmarExclusao = (id) => {
      agendamentoParaExcluir.value = id
      showConfirmDialog.value = true
    }

    const handleExclusaoConfirmada = async () => {
      try {
        await store.dispatch('excluirAgendamento', agendamentoParaExcluir.value)
        await carregarAgendamentos(currentPage.value)
        toast.success('Agendamento excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error)
        toast.error('Erro ao excluir agendamento')
      }
    }

    onMounted(() => {
      carregarAgendamentos()
    })

    return {
      loading,
      agendamentos,
      currentPage,
      totalPages,
      formatarData,
      mudarPagina,
      confirmarExclusao,
      showConfirmDialog,
      handleExclusaoConfirmada,
      toast
    }
  }
}
</script>

<style scoped>
.agendamentos-container, .listagem {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.agendamentos-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--bg-tertiary);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.agendamentos-table th,
.agendamentos-table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.agendamentos-table th {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  font-weight: 600;
}

.agendamentos-table tr:hover {
  background-color: var(--bg-tertiary);
}

.agendamentos-table tr:last-child td {
  border-bottom: none;
}

.acoes {
  display: flex;
  gap: var(--spacing-sm);
}

.paginacao {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--spacing-lg);
  gap: var(--spacing-sm);
}

.paginacao button {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.paginacao button:hover {
  background-color: var(--bg-secondary);
}

.paginacao button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.paginacao span {
  color: var(--text-secondary);
}

.actions {
  margin-bottom: 20px;
  text-align: right;
}

.btn-primary {
  background-color: var(--success);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-page {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 8px 16px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: white;
  background-color: var(--bg-tertiary);
  border-radius: 4px;
}
</style> 