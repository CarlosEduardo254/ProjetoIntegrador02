// auth.js
const API_BASE_URL = 'https://localhost:44369';

// Obter usuário logado do localStorage ou sessionStorage
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Verificar se o usuário atual é líder da startup especificada
async function isStartupLeader(startupId) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        return false; // Usuário não está logado
    }
    
    try {
        // Tente múltiplos padrões de URL
        let response = null;
        const urls = [
            `${API_BASE_URL}/startupRotaDev/verificarLider/${startupId}?userId=${currentUser.id}`,
            `/startupRotaDev/verificarLider/${startupId}?userId=${currentUser.id}`,
            `../api/startupRotaDev/verificarLider/${startupId}?userId=${currentUser.id}`
        ];
        
        for (const url of urls) {
            try {
                response = await fetch(url).catch(() => null);
                if (response && response.ok) break;
            } catch (e) {
                console.log(`Falha na tentativa com URL ${url}:`, e);
            }
        }
        
        if (!response || !response.ok) {
            console.log("Falha ao verificar permissões de líder");
            return false;
        }
        
        const result = await response.json();
        return result.isLeader === true;
        
    } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        return false;
    }
}

// Mostrar ou esconder elementos baseado em permissões de líder
async function setupLeaderPermissions(startupId) {
    const isLeader = await isStartupLeader(startupId);
    
    // Seleciona todos os elementos que devem ser visíveis apenas para líderes
    const leaderOnlyElements = document.querySelectorAll('.leader-only');
    
    // Mostra ou esconde os elementos baseado na permissão
    leaderOnlyElements.forEach(element => {
        element.style.display = isLeader ? '' : 'none';
    });
    
    return isLeader;
}

export { getCurrentUser, isStartupLeader, setupLeaderPermissions };