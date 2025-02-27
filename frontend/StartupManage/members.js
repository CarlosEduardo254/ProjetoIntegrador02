// Variáveis globais
let startupId;

const API_BASE_URL = 'https://localhost:44369';

document.addEventListener('DOMContentLoaded', async () => {
    // Obter o ID da startup da URL
    const urlParams = new URLSearchParams(window.location.search);
    startupId = urlParams.get('startupId');
    
    if (!startupId) {
        showError('ID da startup não fornecido');
        return;
    }
    
    
    // Carregar dados da startup e membros
    loadStartupAndMembers();
    
   
        document.getElementById('add-member-btn').addEventListener('click', showAddMemberModal);
   
    
});
// Função para navegar de volta à página de gerenciamento
function goToManagement() {
    window.location.href = `manageStartup.html?id=${startupId}`;
}

// Carregar dados da startup e membros
async function loadStartupAndMembers() {
    try {
        // Try multiple URL patterns
        let response = null;
        const urls = [
            `${API_BASE_URL}/startupRotaDev/exibirStartup/${startupId}`,
            `/startupRotaDev/exibirStartup/${startupId}`,
            `../api/startupRotaDev/exibirStartup/${startupId}`
        ];
        
        for (const url of urls) {
            try {
                console.log(`Tentando carregar dados: ${url}`);
                response = await fetch(url).catch(() => null);
                if (response && response.ok) break;
            } catch (e) {
                console.log(`Falha na tentativa com URL ${url}:`, e);
            }
        }
        
        if (!response || !response.ok) {
            throw new Error('Falha ao carregar dados da startup');
        }
        
        const data = await response.json();
        
        // Atualizar título com nome da startup
        document.getElementById('startup-title').textContent = data.nome;
        
        // Mostrar membros
        displayMembers(data.membros);
    } catch (error) {
        showError(`Erro ao carregar dados: ${error.message}`);
    }
}


// Exibir membros da equipe
function displayMembers(members) {
    const membersList = document.getElementById('members-list');
    membersList.innerHTML = '';
    
    if (!members || members.length === 0) {
        membersList.innerHTML = '<div class="alert alert-info">Nenhum membro cadastrado nesta startup.</div>';
        return;
    }
    
    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'col-md-4 mb-4';
        
        // Definir o HTML do card com ou sem botão de remover, dependendo da permissão
        let cardHtml = `
            <div class="card member-card">
                <div class="card-body text-center">
                    <h5 class="member-name">${member.nome}</h5>
                    <p class="member-role">${member.funcao || 'Membro'}</p>
                    <p class="member-email">${member.email || 'Email não disponível'}</p>`;
                    
        // Adicionar botão de remover apenas para líderes
        
            cardHtml += `
                <button class="btn btn-danger btn-sm remove-member" data-member-id="${member.id}">
                    <i class="bi bi-person-dash"></i> Remover
                </button>`;
        
        
        cardHtml += `
                </div>
            </div>
        `;
        
        memberCard.innerHTML = cardHtml;
        membersList.appendChild(memberCard);
    });
    
    // Adicionar event listeners para os botões de remover (apenas para líderes)

        document.querySelectorAll('.remove-member').forEach(button => {
            button.addEventListener('click', (e) => {
                const memberId = e.currentTarget.getAttribute('data-member-id');
                confirmRemoveMember(memberId);
            });
        });
    
}

// Mostrar modal para adicionar membro
function showAddMemberModal() {
    // Aqui você poderia implementar uma busca de usuários disponíveis
    // Por agora, apenas mostrar um modal para digitar o ID
    const userIdInput = prompt('Digite o ID do usuário a adicionar:');
    
    if (userIdInput) {
        addMember(userIdInput);
    }
}

// Adicionar membro à startup
async function addMember(userId) {
    try {
        // Aqui está o problema - vamos corrigir o formato dos parâmetros
        let response = null;
        const urls = [
            `${API_BASE_URL}/startupRotaDev/adicionar/${startupId}?idUser=${userId}&idStartup=${startupId}`,
            `/startupRotaDev/adicionar/${startupId}?idUser=${userId}&idStartup=${startupId}`,
            `../api/startupRotaDev/adicionar/${startupId}?idUser=${userId}&idStartup=${startupId}`
        ];
        
        for (const url of urls) {
            try {
                console.log(`Tentando adicionar membro usando URL: ${url}`);
                response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                    // Removemos o body e passamos os parâmetros na URL
                }).catch(() => null);
                
                if (response && response.ok) break;
            } catch (e) {
                console.log(`Falha na tentativa com URL ${url}:`, e);
            }
        }
        
        if (!response || !response.ok) {
            throw new Error('Falha ao adicionar membro');
        }
        
        // Recarregar a lista de membros
        loadStartupAndMembers();
        alert('Membro adicionado com sucesso!');
    } catch (error) {
        showError(`Erro ao adicionar membro: ${error.message}`);
    }
}

// Confirmar remoção de membro
function confirmRemoveMember(memberId) {
    if (confirm('Tem certeza que deseja remover este membro da startup?')) {
        removeMember(memberId);
    }
}

// Remover membro da startup
async function removeMember(memberId) {
    try {
        let response = null;
        const urls = [
            `${API_BASE_URL}/startupRotaDev/remover/${startupId}?idUser=${memberId}&idStartup=${startupId}`,
            `/startupRotaDev/remover/${startupId}?idUser=${memberId}&idStartup=${startupId}`,
            `../api/startupRotaDev/remover/${startupId}?idUser=${memberId}&idStartup=${startupId}`
        ];
        
        for (const url of urls) {
            try {
                console.log(`Tentando remover membro usando URL: ${url}`);
                response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                    // Removemos o body e passamos os parâmetros na URL
                }).catch(() => null);
                
                if (response && response.ok) break;
            } catch (e) {
                console.log(`Falha na tentativa com URL ${url}:`, e);
            }
        }
        
        if (!response || !response.ok) {
            throw new Error('Falha ao remover membro');
        }
        
        // Recarregar a lista de membros
        loadStartupAndMembers();
        alert('Membro removido com sucesso!');
    } catch (error) {
        showError(`Erro ao remover membro: ${error.message}`);
    }
}
// Exibir mensagens de erro
function showError(message) {
    console.error(message);
    alert(message);
}