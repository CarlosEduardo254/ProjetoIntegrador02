// Variáveis globais
let startupId;
let currentData = {};
const API_BASE_URL = 'https://localhost:44369'; // Certifique-se de que essa URL está correta

document.addEventListener('DOMContentLoaded', () => {
    // Obter o ID da startup da URL
    const urlParams = new URLSearchParams(window.location.search);
    startupId = urlParams.get('id');
    
    if (!startupId) {
        showError('ID da startup não fornecido');
        return;
    }
    
    // Inicializar formulário
    loadStartupData();
    
    // Adicionar event listener para o formulário
    document.getElementById('update-form').addEventListener('submit', updateStartup);
});

// Função para navegar de volta à página de gerenciamento
function goToManagement() {
    window.location.href = `manageStartup.html?id=${startupId}`;
}

// Carregar dados da startup
async function loadStartupData() {
    try {
        console.log(`Carregando dados da URL: ${API_BASE_URL}/startupRotaDev/exibirStartup/${startupId}`);
        const response = await fetch(`${API_BASE_URL}/startupRotaDev/exibirStartup/${startupId}`);
        
        if (!response.ok) {
            throw new Error(`Falha ao carregar dados da startup. Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos:', data); // Debug
        currentData = data;
        
        // Preencher o formulário com os dados atuais
        document.getElementById('startup-name').textContent = data.nome || 'Nome não disponível';
        document.getElementById('descricao').value = data.descricao || '';
        
        // Selecionar o status atual
        const statusSelect = document.getElementById('status');
        for (let i = 0; i < statusSelect.options.length; i++) {
            if (statusSelect.options[i].value === data.status) {
                statusSelect.selectedIndex = i;
                break;
            }
        }
        
        // Selecionar o modelo de negócio atual
        const modeloSelect = document.getElementById('modelo-negocio');
        for (let i = 0; i < modeloSelect.options.length; i++) {
            if (modeloSelect.options[i].value === data.modeloNegocio) {
                modeloSelect.selectedIndex = i;
                break;
            }
        }
        
        // Definir valor de MVP
        document.getElementById('mvp').checked = data.mvp || false;
        
        // Definir CNPJ
        document.getElementById('cnpj').value = data.cnpj || '';
        
        // Selecionar a jornada atual (ajuste o nome do campo conforme o backend)
        const jornadaSelect = document.getElementById('jornada');
        for (let i = 0; i < jornadaSelect.options.length; i++) {
            // Verifique o nome correto do campo no backend (pode ser 'jornada' ou 'jornadas')
            if (jornadaSelect.options[i].value === (data.jornadas || data.jornada)) {
                jornadaSelect.selectedIndex = i;
                break;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar:', error);
        showError(`Erro ao carregar dados: ${error.message}`);
    }
}

// Atualizar dados da startup
async function updateStartup(event) {
    event.preventDefault();
    
    const updateData = {
        descricao: document.getElementById('descricao').value,
        status: document.getElementById('status').value,
        modeloNegocio: document.getElementById('modelo-negocio').value,
        mvp: document.getElementById('mvp').checked,
        cnpj: document.getElementById('cnpj').value,
        // Ajuste o nome do campo conforme o backend
        jornadas: document.getElementById('jornada').value // ou 'jornada', dependendo do backend
    };
    
    // Verificar se algum campo mudou
    let hasChanges = false;
    for (const key in updateData) {
        if (updateData[key] !== currentData[key]) {
            hasChanges = true;
            break;
        }
    }
    
    if (!hasChanges) {
        alert('Nenhuma alteração foi feita.');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/startupRotaDev/atualizar/${startupId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            throw new Error(`Falha ao atualizar startup. Status: ${response.status}`);
        }
        
        alert('Startup atualizada com sucesso!');
        goToManagement();
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        showError(`Erro ao atualizar: ${error.message}`);
    }
}

// Exibir mensagens de erro
function showError(message) {
    console.error(message);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger mt-3';
    errorDiv.textContent = message;
    document.querySelector('.content').prepend(errorDiv);
    alert(message); // Mantém o alert para feedback imediato
}