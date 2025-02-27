document.addEventListener("DOMContentLoaded", carregarDados);

// Função para carregar dados do backend
async function carregarDados() {
    try {
        const startupId = new URLSearchParams(window.location.search).get('id'); // ID da startup da URL
        const token = localStorage.getItem('token');
        const lucros = await buscarLucros(startupId, token);
        const meses = gerarMeses();
        const lucrosMensais = preencherLucrosMensais(meses, lucros);

        renderizarGraficoLucro(meses, lucrosMensais);
        preencherTabelaLucro(meses, lucrosMensais);

        document.getElementById('salvarLucro').addEventListener('click', () => salvarLucros(startupId, token));
        document.getElementById('toggleTabela').addEventListener('click', toggleTabela);

        // Buscar atualizações da startup
        const atualizacoes = await buscarAtualizacoes(startupId, token);

        renderizarLinhaDoTempo(atualizacoes);

        // Adicionar evento ao formulário de atualização
        document.getElementById('formAtualizacao').addEventListener('submit', (event) => {
            event.preventDefault();
            adicionarAtualizacao(startupId, token);
        });
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        alert("Erro ao carregar dados. Tente novamente mais tarde.");
    }
}

// Função para buscar lucros da startup no backend
async function buscarLucros(startupId, token) {
    const resposta = await fetch(`http://localhost:3000/api/startups/${startupId}/lucros`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!resposta.ok) throw new Error("Erro ao buscar lucros");

    return await resposta.json();
}

// Função para buscar atualizações da startup no backend
async function buscarAtualizacoes(startupId, token) {
    const resposta = await fetch(`http://localhost:3000/api/startups/${startupId}/atualizacoes`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!resposta.ok) throw new Error("Erro ao buscar atualizações");

    return await resposta.json();
}

// Função para adicionar uma nova atualização
async function adicionarAtualizacao(startupId, token) {
    const descricao = document.getElementById('descricao').value;
    const tipoAtualizacao = document.getElementById('tipoAtualizacao').value;

    try {
        const resposta = await fetch(`http://localhost:3000/api/startups/${startupId}/atualizacoes`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ descricao, tipoAtualizacao })
        });

        if (!resposta.ok) throw new Error("Erro ao adicionar atualização");

        document.getElementById('descricao').value = '';
        document.getElementById('tipoAtualizacao').value = 'Funcionalidade';

        const atualizacoes = await buscarAtualizacoes(startupId, token);
        renderizarLinhaDoTempo(atualizacoes);

        alert("Atualização adicionada com sucesso!");
    } catch (erro) {
        console.error("Erro ao adicionar atualização:", erro);
        alert("Erro ao adicionar atualização. Tente novamente mais tarde.");
    }
}

// Função para gerar os rótulos dos últimos 12 meses
function gerarMeses() {
    const meses = [];
    const dataAtual = new Date();
    for (let i = 11; i >= 0; i--) {
        const data = new Date(dataAtual);
        data.setMonth(data.getMonth() - i);
        meses.push(data.toLocaleString('default', { month: 'long' }));
    }
    return meses;
}

// Função para preencher os lucros mensais
function preencherLucrosMensais(meses, lucros) {
    const lucrosMensais = new Array(meses.length).fill(0); // Inicializa com 0 para quando não tiver dados de lucro

    lucros.forEach(lucro => {
        const mes = new Date(lucro.data).toLocaleString('default', { month: 'long' });
        const index = meses.indexOf(mes);
        if (index !== -1) {
            lucrosMensais[index] = lucro.valor;
        }
    });

    return lucrosMensais;
}

// Função para renderizar o gráfico de colunas do lucro
function renderizarGraficoLucro(meses, lucros) {
    const ctx = document.getElementById('graficoLucro').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: 'Lucro Mensal (R$)',
                data: lucros,
                backgroundColor: 'rgba(44, 89, 172, 0.5)',
                borderColor: 'rgba(44, 89, 172, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Função para preencher a tabela de lucro com campos editáveis
function preencherTabelaLucro(meses, lucros) {
    const tabela = document.getElementById('tabelaLucro').getElementsByTagName('tbody')[0];
    tabela.innerHTML = "";

    meses.forEach((mes, index) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${mes}</td>
            <td><input type="number" value="${lucros[index]}" class="lucro-input"></td>
        `;
        tabela.appendChild(linha);
    });
}

// Função para salvar os lucros editados
async function salvarLucros(startupId, token) {
    const inputs = document.querySelectorAll('.lucro-input');
    const novosLucros = Array.from(inputs).map(input => parseFloat(input.value));

    try {
        // Enviar os novos lucros para o backend
        await fetch(`http://localhost:3000/api/startups/${startupId}/lucros`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(novosLucros)
        });

        // Atualizar o gráfico de lucro com os novos valores
        const meses = Array.from(document.querySelectorAll('#tabelaLucro tbody td:first-child')).map(td => td.textContent);
        renderizarGraficoLucro(meses, novosLucros);

        alert("Lucros salvos com sucesso!");
    } catch (erro) {
        console.error("Erro ao salvar lucros:", erro);
        alert("Erro ao salvar lucros. Tente novamente mais tarde.");
    }
}

// Função para alternar a visibilidade da tabela de inserção de dados dos lucros
function toggleTabela() {
    const tabelaContainer = document.getElementById('tabelaContainer');
    const toggleBtn = document.getElementById('toggleTabela');

    if (tabelaContainer.style.display === "none") {
        tabelaContainer.style.display = "block";
        toggleBtn.textContent = "Ocultar Tabela de Lucros";
    } else {
        tabelaContainer.style.display = "none";
        toggleBtn.textContent = "Mostrar Tabela de Lucros";
    }
}

// Função para renderizar a linha do tempo
function renderizarLinhaDoTempo(atualizacoes) {
    const lista = document.getElementById('atualizacoes');
    lista.innerHTML = atualizacoes.map(atualizacao => `
        <li>
            <strong>${new Date(atualizacao.dataAtualizacao).toLocaleDateString()}</strong>: 
            ${atualizacao.descricao} (${atualizacao.tipoAtualizacao})
        </li>
    `).join('');
}

function voltar() {
    window.history.back();
}

function irParaHome() {
    window.location.href = "home.html"; // TODO: adicionar link da home
}
