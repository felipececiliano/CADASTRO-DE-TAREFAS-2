// ==========================================
// 1. MAPEAMENTO DOS ELEMENTOS DA DOM
// ==========================================
// Tarefas
const inputTarefa = document.getElementById('input-tarefa');
const btnAdicionar = document.getElementById('btn-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');

// Histórico
const listaHistorico = document.getElementById('lista-historico');
const btnLimparHistorico = document.getElementById('btn-limpar-historico');

// Tema
const btnTema = document.getElementById('btn-tema');

// Painel do Criador (Canto Superior Direito)
const btnCriador = document.getElementById('btn-criador');
const painelCriador = document.getElementById('painel-criador');

// Modal de Novidades (Canto Superior Esquerdo)
const btnNovidades = document.getElementById('btn-novidades');
const modalNovidades = document.getElementById('modal-novidades');
const btnFecharModal = document.getElementById('btn-fechar-modal');


// ==========================================
// 2. ESTADO DA APLICAÇÃO (LOCALSTORAGE)
// ==========================================
let tarefasAtivas = JSON.parse(localStorage.getItem('tarefasAtivas')) || [];
let historicoTarefas = JSON.parse(localStorage.getItem('historicoTarefas')) || [];


// ==========================================
// 3. FUNÇÕES DE RENDERIZAÇÃO E ATUALIZAÇÃO
// ==========================================
// Atualiza o localStorage e re-renderiza as listas na tela
function atualizarInterface() {
  localStorage.setItem('tarefasAtivas', JSON.stringify(tarefasAtivas));
  localStorage.setItem('historicoTarefas', JSON.stringify(historicoTarefas));
  
  renderizarTarefasAtivas();
  renderizarHistorico();
}

// Renderiza tarefas que ainda estão pendentes
function renderizarTarefasAtivas() {
  listaTarefas.innerHTML = '';

  tarefasAtivas.forEach((tarefa, index) => {
    const li = document.createElement('li');
    li.className = 'item-tarefa';

    li.innerHTML = `
      <span>${tarefa}</span>
      <div class="acoes-tarefa">
        <button class="botao-acao" onclick="concluirTarefa(${index})" title="Concluir">✓</button>
        <button class="botao-acao excluir" onclick="excluirTarefa(${index})" title="Excluir">✕</button>
      </div>
    `;

    listaTarefas.appendChild(li);
  });
}

// Renderiza o histórico de tarefas concluídas/excluídas
function renderizarHistorico() {
  listaHistorico.innerHTML = '';

  if (historicoTarefas.length === 0) {
    listaHistorico.innerHTML = '<li style="font-size:0.85rem; color: var(--cor-concluido); text-align:center;">Nenhum histórico disponível.</li>';
    return;
  }

  historicoTarefas.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'item-tarefa concluida';

    li.innerHTML = `
      <div>
        <span>${item.texto}</span>
        <br>
        <small style="font-size:0.75rem; color: var(--cor-concluido);">${item.status} em: ${item.data}</small>
      </div>
    `;

    listaHistorico.appendChild(li);
  });
}


// ==========================================
// 4. LÓGICA DAS TAREFAS
// ==========================================
// Adicionar nova tarefa
function adicionarTarefa() {
  const texto = inputTarefa.value.trim();
  if (texto === '') return;

  tarefasAtivas.push(texto);
  inputTarefa.value = '';
  atualizarInterface();
}

// Concluir tarefa e enviar ao histórico
function concluirTarefa(index) {
  const tarefaRemovida = tarefasAtivas.splice(index, 1)[0];
  
  historicoTarefas.unshift({
    texto: tarefaRemovida,
    status: 'Concluído',
    data: new Date().toLocaleString('pt-BR')
  });

  atualizarInterface();
}

// Excluir tarefa e enviar ao histórico
function excluirTarefa(index) {
  const tarefaRemovida = tarefasAtivas.splice(index, 1)[0];

  historicoTarefas.unshift({
    texto: tarefaRemovida,
    status: 'Excluído',
    data: new Date().toLocaleString('pt-BR')
  });

  atualizarInterface();
}


// ==========================================
// 5. EVENT LISTENERS (INTERAÇÕES)
// ==========================================
// Adicionar tarefa no clique ou tecla ENTER
btnAdicionar.addEventListener('click', adicionarTarefa);

inputTarefa.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') adicionarTarefa();
});

// Limpar todo o histórico
btnLimparHistorico.addEventListener('click', () => {
  if (confirm("Deseja realmente apagar todo o histórico?")) {
    historicoTarefas = [];
    atualizarInterface();
  }
});

// Alternar Modo Escuro / Claro
btnTema.addEventListener('click', () => {
  document.body.classList.toggle('modo-escuro');
});

// --- Controle do Painel do Criador ---
btnCriador.addEventListener('click', (e) => {
  e.stopPropagation();
  painelCriador.classList.toggle('esconde');
});

// Esconde o painel do criador ao clicar fora dele
document.addEventListener('click', (e) => {
  if (painelCriador && !painelCriador.contains(e.target) && e.target !== btnCriador) {
    painelCriador.classList.add('esconde');
  }
});

// --- Controle do Modal de Novidades ---
btnNovidades.addEventListener('click', () => {
  modalNovidades.classList.remove('esconde');
});

btnFecharModal.addEventListener('click', () => {
  modalNovidades.classList.add('esconde');
});

// Esconde o modal ao clicar na área escura fora do cartão
modalNovidades.addEventListener('click', (e) => {
  if (e.target === modalNovidades) {
    modalNovidades.classList.add('esconde');
  }
});


// ==========================================
// 6. INICIALIZAÇÃO DA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', atualizarInterface);