// Elementos da DOM
const inputTarefa = document.getElementById('input-tarefa');
const btnAdicionar = document.getElementById('btn-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const listaHistorico = document.getElementById('lista-historico');
const btnLimparHistorico = document.getElementById('btn-limpar-historico');
const btnTema = document.getElementById('btn-tema');

// Elementos do Menu do Criador
const btnCriador = document.getElementById('btn-criador');
const painelCriador = document.getElementById('painel-criador');

// Armazenamento das Listas no LocalStorage
let tarefasAtivas = JSON.parse(localStorage.getItem('tarefasAtivas')) || [];
let historicoTarefas = JSON.parse(localStorage.getItem('historicoTarefas')) || [];

// Atualiza a Interface e salva no LocalStorage
function atualizarInterface() {
  localStorage.setItem('tarefasAtivas', JSON.stringify(tarefasAtivas));
  localStorage.setItem('historicoTarefas', JSON.stringify(historicoTarefas));
  
  renderizarTarefasAtivas();
  renderizarHistorico();
}

// Renderiza a lista de tarefas ativas
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

// Renderiza a lista do histórico
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

// Adicionar Nova Tarefa
function adicionarTarefa() {
  const texto = inputTarefa.value.trim();
  if (texto === '') return;

  tarefasAtivas.push(texto);
  inputTarefa.value = '';
  atualizarInterface();
}

// Concluir Tarefa
function concluirTarefa(index) {
  const tarefaRemovida = tarefasAtivas.splice(index, 1)[0];
  
  historicoTarefas.unshift({
    texto: tarefaRemovida,
    status: 'Concluído',
    data: new Date().toLocaleString('pt-BR')
  });

  atualizarInterface();
}

// Excluir Tarefa
function excluirTarefa(index) {
  const tarefaRemovida = tarefasAtivas.splice(index, 1)[0];

  historicoTarefas.unshift({
    texto: tarefaRemovida,
    status: 'Excluído',
    data: new Date().toLocaleString('pt-BR')
  });

  atualizarInterface();
}

// Eventos de Input/Botões
btnAdicionar.addEventListener('click', adicionarTarefa);

inputTarefa.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') adicionarTarefa();
});

btnLimparHistorico.addEventListener('click', () => {
  if (confirm("Deseja realmente apagar o histórico?")) {
    historicoTarefas = [];
    atualizarInterface();
  }
});

// Alternar Modo Escuro
btnTema.addEventListener('click', () => {
  document.body.classList.toggle('modo-escuro');
});

// Controle de Abertura/Fechamento do Painel do Criador
btnCriador.addEventListener('click', (e) => {
  e.stopPropagation();
  painelCriador.classList.toggle('esconde');
});

document.addEventListener('click', (e) => {
  if (!painelCriador.contains(e.target) && e.target !== btnCriador) {
    painelCriador.classList.add('esconde');
  }
});

// Inicialização
document.addEventListener('DOMContentLoaded', atualizarInterface);