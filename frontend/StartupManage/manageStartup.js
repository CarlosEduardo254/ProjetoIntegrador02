
// Variáveis globais
let startupId;
let deleteModal;

// Configuração da URL base da API
const API_BASE_URL = 'https://localhost:44369'; // Ajuste conforme necessário para seu ambiente

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', async () => {
    // Obter o ID da startup da URL
    const urlParams = new URLSearchParams(window.location.search);
    startupId = urlParams.get('id');
    
    if (!startupId) {
        showError('ID da startup não fornecido');
        return;
    }

    console.log('Startup ID:', startupId); // Debug

    // Inicializar o modal de exclusão
    const deleteModalElement = document.getElementById('deleteModal');
    if (deleteModalElement) {
        deleteModal = new bootstrap.Modal(deleteModalElement);
        
        // Configurar o botão de exclusão
        const deleteBtn = document.getElementById('delete-startup-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                deleteModal.show();
            });
        }
        
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', deleteStartup);
        }
    }
    
    // Adicionar botão de edição (se não existir)
    addEditButton();
    
    // Carregar os dados da startup
    loadStartupData();
});

// Modificar botões de navegação para incluir verificação
function setupNavigationButtons() {
    // Botão para editar informações da startup (apenas para líderes)
    const editButton = document.getElementById('edit-startup-btn');
    
    
    // Botão para gerenciar membros (apenas para líderes)
    const membersButton = document.getElementById('manage-members-btn');
    
}


// Função para adicionar botão de edição
function addEditButton() {
    const deleteSection = document.getElementById('delete-section');
    
    // Verificar se já existe um botão de edição
    if (!document.getElementById('edit-startup-btn') && deleteSection) {
        const editButton = document.createElement('button');
        editButton.id = 'edit-startup-btn';
        editButton.className = 'btn btn-primary me-2';
        editButton.innerHTML = '<i class="bi bi-pencil"></i> Editar Startup';
        editButton.addEventListener('click', () => {
            window.location.href = `editStartup.html?id=${startupId}`;
        });
        
        // Inserir antes do botão de exclusão
        deleteSection.prepend(editButton);
    }
}

// Função para navegar para a página inicial
function goHome() {
    window.location.href = 'index.html';
}

// Função para carregar os dados da startup
async function loadStartupData() {
    try {
        // Log para debug
        console.log(`Tentando carregar dados da startup: ${API_BASE_URL}/startupRotaDev/exibirStartup/${startupId}`);
        
        // Tentar primeiro com a URL completa
        let response = await fetch(`${API_BASE_URL}/startupRotaDev/exibirStartup/${startupId}`)
            .catch(() => null);
        
        // Se falhar, tentar sem o API_BASE_URL
        if (!response || !response.ok) {
            console.log('Primeira tentativa falhou, tentando URL alternativa');
            response = await fetch(`/startupRotaDev/exibirStartup/${startupId}`)
                .catch(() => null);
        }
        
        // Ainda sem sucesso, tentar com uma URL relativa diferente
        if (!response || !response.ok) {
            console.log('Segunda tentativa falhou, tentando URL relativa');
            response = await fetch(`../startupRotaDev/exibirStartup/${startupId}`)
                .catch(e => {
                    console.error('Erro na terceira tentativa:', e);
                    return null;
                });
        }
        
        // Se ainda não houver resposta ou ela não for ok
        if (!response || !response.ok) {
            console.error('Status da resposta:', response ? response.status : 'Sem resposta');
            throw new Error(`Falha ao carregar dados da startup. Status: ${response ? response.status : 'Conexão falhou'}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos:', data); // Debug
        
        displayStartupData(data);
        displayMembers(data.membros);
        
        // Adicionar esta linha para carregar os dados do coordenador
        await loadCoordinatorData();
    } catch (error) {
        console.error('Erro completo:', error);
        showError(`Erro ao carregar dados: ${error.message}`);
        
        // Exibir dados simulados para debug/demonstração
        displayFallbackData();
    }
}

// Função para carregar os dados do coordenador do líder da startup
async function loadCoordinatorData() {
    try {
        // Primeiro precisamos identificar o líder da startup
        const startupResponse = await fetch(`${API_BASE_URL}/startupRotaDev/exibirStartup/${startupId}`)
            .catch(() => null);
            
        if (!startupResponse || !startupResponse.ok) {
            console.log('Falha ao obter dados da startup para identificar o líder');
            return null;
        }
        
        const startupData = await startupResponse.json();
        
        // Encontrar o membro líder
        const leader = startupData.membros.find(member => 
            member.tipoMembro === 'Lider' || member.funcao === 'Lider');
            
        if (!leader) {
            console.log('Nenhum líder encontrado para esta startup');
            displayCoordinatorData(null);
            return null;
        }
        
        // Consultar coordenador do líder
        const coordinatorResponse = await fetch(`${API_BASE_URL}/coordRouteDev/obterCoordenador/${leader.id}`)
            .catch(() => null);
            
        if (!coordinatorResponse || !coordinatorResponse.ok) {
            console.log('Falha ao obter dados do coordenador');
            displayCoordinatorData(null);
            return null;
        }
        
        const coordinatorData = await coordinatorResponse.json();
        displayCoordinatorData(coordinatorData);
        return coordinatorData;
        
    } catch (error) {
        console.error('Erro ao carregar dados do coordenador:', error);
        displayCoordinatorData(null);
        return null;
    }
}

// Exibir dados do coordenador na página
function displayCoordinatorData(data) {
    // Remover classe de carregamento
    document.querySelectorAll('#coordinator-name, #coordinator-contact, #coordinator-email')
        .forEach(el => {
            el.classList.remove('loading-text');
        });
    
    if (!data) {
        document.getElementById('coordinator-name').textContent = "Não disponível";
        document.getElementById('coordinator-contact').textContent = "Não disponível";
        document.getElementById('coordinator-email').textContent = "Não disponível";
        return;
    }
    
    document.getElementById('coordinator-name').textContent = data.nome || "Nome não disponível";
    document.getElementById('coordinator-contact').textContent = data.contato || "Contato não disponível";
    document.getElementById('coordinator-email').textContent = data.email || "Email não disponível";
}

// Função para exibir dados de fallback (para debug)
// Função para exibir dados de fallback (para debug)
function displayFallbackData() {
    const mockData = {
        nome: "Startup Demo (Modo Offline)",
        descricao: "Esta é uma visualização de demonstração porque não foi possível conectar ao servidor.",
        status: "ATIVA",
        modeloNegocio: "SAAS",
        cnpj: "XX.XXX.XXX/XXXX-XX",
        membros: [
            { id: "1", nome: "Usuário Demo", funcao: "CEO", tipoMembro: "Lider", fotoUrl: null },
            { id: "2", nome: "Usuário Teste", funcao: "CTO", fotoUrl: null }
        ]
    };
    
    displayStartupData(mockData);
    displayMembers(mockData.membros);
    
    // Adicionar dados simulados do coordenador
    const mockCoordinatorData = {
        nome: "Coordenador Demo",
        contato: "(00) 00000-0000",
        email: "coordenador.demo@exemplo.com"
    };
    
    displayCoordinatorData(mockCoordinatorData);
}

// Exibir dados da startup na página
function displayStartupData(data) {
    if (!data) {
        showError("Dados inválidos recebidos do servidor");
        return;
    }
    
    // Remover classe de carregamento
    document.querySelectorAll('.loading-text').forEach(el => {
        el.classList.remove('loading-text');
    });
    
    document.getElementById('startup-name').textContent = data.nome || "Nome não disponível";
    document.getElementById('startup-description').textContent = data.descricao || "Descrição não disponível";
    
    const statusElement = document.getElementById('startup-status');
    if (statusElement) {
        statusElement.textContent = data.status || "Status desconhecido";
        if (data.status) {
            statusElement.classList.add(data.status.toLowerCase() === 'ativa' ? 'ativa' : 'inativa');
        }
    }
    
    document.getElementById('business-model').textContent = data.modeloNegocio || "Não especificado";
    document.getElementById('cnpj').textContent = data.cnpj || 'Não registrado';
}

// Exibir membros da equipe
function displayMembers(members) {
    const memberList = document.getElementById('member-list');
    if (!memberList) return;
    
    memberList.innerHTML = '';
    
    if (!members || members.length === 0) {
        memberList.innerHTML = '<p>Nenhum membro cadastrado.</p>';
        return;
    }
    
    // Mostrar apenas até 3 membros na visualização principal
    const displayLimit = 3;
    const displayMembers = members.slice(0, displayLimit);
    
    displayMembers.forEach(member => {
        const memberItem = document.createElement('div');
        memberItem.className = 'member-item';
        memberItem.innerHTML = `
            <div class="member-info">
                <div class="member-name">${member.nome || 'Nome não disponível'}</div>
                <div class="member-role">${member.funcao || 'Membro'}</div>
            </div>
        `;
        memberList.appendChild(memberItem);
    });
    
    // Adicionar indicação de mais membros se houver mais que o limite
    if (members.length > displayLimit) {
        const moreMembers = document.createElement('p');
        moreMembers.className = 'text-center mt-2';
        moreMembers.textContent = `+${members.length - displayLimit} membros adicionais`;
        memberList.appendChild(moreMembers);
    }
}

// Função para navegar para a página de visualização de membros
function viewMembers() {
    window.location.href = `members.html?startupId=${startupId}`;
}

// Função para excluir a startup
async function deleteStartup() {
    const passwordInput = document.getElementById('confirmPassword');
    const password = passwordInput ? passwordInput.value : '';
    
    if (!password) {
        alert('Por favor, digite sua senha para confirmar.');
        return;
    }
    
    try {
        // Tentar com diferentes formatos de URL, como na função loadStartupData
        let response = null;
        const urls = [
            `${API_BASE_URL}/startupRotaDev/excluir/${startupId}`,
            `/startupRotaDev/excluir/${startupId}`,
            `../startupRotaDev/excluir/${startupId}`
        ];
        
        for (const url of urls) {
            try {
                console.log(`Tentando excluir usando URL: ${url}`);
                response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password })
                });
                
                if (response && response.ok) break;
            } catch (e) {
                console.log(`Falha na tentativa com URL ${url}:`, e);
            }
        }
        
        if (!response || !response.ok) {
            throw new Error(`Falha ao excluir startup. Status: ${response ? response.status : 'Conexão falhou'}`);
        }
        
        // Redirecionar para a página inicial após excluir
        alert('Startup excluída com sucesso!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao excluir:', error);
        alert(`Erro ao excluir: ${error.message}`);
        if (deleteModal) deleteModal.hide();
    }
}

// Exibir mensagens de erro
function showError(message) {
    console.error(message);
    
    // Verificar se já existe um elemento de erro
    let errorElement = document.getElementById('error-message');
    
    if (!errorElement) {
        // Criar elemento para exibir o erro
        errorElement = document.createElement('div');
        errorElement.id = 'error-message';
        errorElement.className = 'alert alert-danger mt-3';
        errorElement.role = 'alert';
        
        // Inserir no início do conteúdo
        const contentElement = document.querySelector('.content');
        if (contentElement) {
            contentElement.prepend(errorElement);
        } else {
            // Alternativa: adicionar ao corpo do documento
            document.body.prepend(errorElement);
        }
    }
    
    // Atualizar a mensagem
    errorElement.textContent = message;
    
    // Opcional: Adicionar alerta popup também
    alert(message);
}