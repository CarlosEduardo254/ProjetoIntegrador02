document.addEventListener('DOMContentLoaded', () => {
    const startupId = new URLSearchParams(window.location.search).get('id');
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    const deleteBtn = document.getElementById('delete-startup-btn');
    const memberList = document.getElementById('member-list');

    // Controle de acesso
    if (userRole !== 'Líder') {
        deleteBtn.style.display = 'none';
    }

    // Carregar dados da startup
    const loadStartupData = async () => {
        try {
            const response = await fetch(`/api/startups/${startupId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar dados da startup');
            }

            const startup = await response.json();
            populateStartupInfo(startup);
            populateMembers(startup.membros);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            showErrorState();
        }
    };

    // Preencher informações da startup
    const populateStartupInfo = (startup) => {
        document.querySelectorAll('.loading-text').forEach(el => {
            el.classList.remove('loading-text');
            el.style.animation = 'none';
        });
    
        document.getElementById('startup-name').textContent = startup.nome;
        document.getElementById('startup-description').textContent = startup.descricao;
        document.getElementById('business-model').textContent = startup.modelo_negocio;
        document.getElementById('cnpj').textContent = startup.cnpj;
    
        const statusBadge = document.getElementById('startup-status');
        statusBadge.textContent = startup.status;
        statusBadge.classList.add(startup.status.toLowerCase());
    };

    // Preencher lista de membros
    const populateMembers = (members) => {
        const loadingElement = document.querySelector('#member-list .loading-text');
        memberList.innerHTML = '';

        if (members.length > 0) {
            members.forEach(member => {
                const memberItem = document.createElement('div');
                memberItem.className = 'member-item';
                memberItem.innerHTML = `
                    <img src="${member.foto || 'default-user.png'}" 
                         class="member-photo"
                         onerror="this.src='default-user.png'">
                    <div class="member-info">
                        <span class="member-name">${member.nome}</span>
                        <span class="member-role">${member.tipo_membro}</span>
                    </div>
                `;
                memberList.appendChild(memberItem);
            });
        } else {
            loadingElement.textContent = 'Nenhum membro encontrado';
        }
    };

    // Excluir startup
    const deleteStartup = () => {
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();

        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        confirmDeleteBtn.addEventListener('click', async () => {
            const password = confirmPasswordInput.value.trim();

            if (!password) {
                alert('Por favor, digite sua senha.');
                return;
            }

            try {
                // Validar senha
                const validateResponse = await fetch('/api/validate-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ password })
                });

                if (!validateResponse.ok) {
                    throw new Error('Senha incorreta');
                }

                // Excluir startup
                const deleteResponse = await fetch(`/api/startups/${startupId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!deleteResponse.ok) {
                    throw new Error('Falha ao excluir startup');
                }

                alert('Startup excluída com sucesso!');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Erro:', error);
                alert(error.message || 'Erro ao excluir startup');
            } finally {
                deleteModal.hide();
            }
        });
    };

    const showErrorState = () => {
        document.querySelectorAll('.loading-text').forEach(el => {
            el.textContent = 'Erro ao carregar dados';
            el.style.color = 'var(--error-red)';
            el.style.animation = 'none';
        });
    };

    deleteBtn.addEventListener('click', deleteStartup);

    loadStartupData();
});

function voltar() {
    window.history.back();
}

function irParaHome() {
    window.location.href = "home.html"; // TODO: adicionar link da home
}

function viewMembers() {
    const startupId = new URLSearchParams(window.location.search).get('id');
    window.location.href = `manageMembers.html?id=${startupId}`;
}
