document.addEventListener("DOMContentLoaded", carregarDados);

const startupId = new URLSearchParams(window.location.search).get('id'); // ID da startup da URL
const token = localStorage.getItem('token'); // Token de autenticação
const usuarioAtual = JSON.parse(localStorage.getItem('usuario')); // Usuário logado

const membersList = document.getElementById("members");
const coordinatorName = document.getElementById("coordinator-name");
const coordinatorPhone = document.getElementById("coordinator-phone"); 
const coordinatorPhoto = document.getElementById("coordinator-photo");
const errorMessage = document.getElementById("error-message");
const modalBody = document.getElementById("modal-body");

const modal = document.getElementById("editModal");
const modalTitle = document.getElementById("modal-title");

let membroEditando = null;

// Função para carregar dados da startup
async function carregarDados() {
    try {
        const resposta = await fetch(`http://localhost:3000/api/startups/${startupId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) throw new Error("Erro ao carregar dados da startup");

        const dados = await resposta.json();
        exibirCoordenador(dados.coordenador);
        exibirMembros(dados.membros);

        document.querySelector(".add-member-btn").style.display = usuarioAtual.tipo_membro === "Líder" ? "block" : "none";
    } catch (erro) {
        errorMessage.innerText = erro.message;
    }
}

// Exibir lista de membros
function exibirMembros(membros) {
    membersList.innerHTML = "";

    membros.forEach(membro => {
        const li = document.createElement("li");
        li.classList.add("member-item");

        li.innerHTML = `
            <img src="${membro.foto || 'assets/default-user.png'}" class="member-photo" alt="Foto de ${membro.nome}">
            <span>${membro.nome} - ${membro.tipo_membro}</span>
            <span>${membro.telefone}</span> <!-- Adicionado telefone -->
            ${usuarioAtual.tipo_membro === "Líder" ? `
                <button onclick="editarMembro(${membro.id}, '${membro.tipo_membro}')">✏️</button>
                <button onclick="removerMembro(${membro.id})">❌</button>
            ` : ""}
        `;

        membersList.appendChild(li);
    });
}

// Exibir informações do coordenador
function exibirCoordenador(coordenador) {
    coordinatorName.innerText = coordenador.nome; 
    coordinatorPhone.innerText = coordenador.telefone; 
    coordinatorPhoto.src = coordenador.foto || "assets/default-user.png"; 
}

// Adicionar membro, com requisito de ser lider para adicionar
async function adicionarMembro() {
    if (usuarioAtual.tipo_membro !== "Líder") {
        alert("Apenas o líder pode adicionar membros.");
        return;
    }

    try {
        // Buscar usuários cadastrados
        const resposta = await fetch(`http://localhost:3000/api/usuarios`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) throw new Error("Erro ao buscar usuários");

        const usuarios = await resposta.json();

        // Exibir lista de usuários no modal
        modalBody.innerHTML = `
            <label for="selectUsuario">Selecione um usuário:</label>
            <select id="selectUsuario">
                ${usuarios.map(usuario => `
                    <option value="${usuario.id}">${usuario.nome}</option>
                `).join('')}
            </select>
            <label for="editCargo">Cargo:</label>
            <select id="editCargo">
                <option value="Líder">Líder</option>
                <option value="Desenvolvedor">Desenvolvedor</option>
                <option value="Marketing">Marketing</option>
            </select>
            <label for="editTelefone">Telefone:</label> <!-- Adicionado campo de telefone -->
            <input type="text" id="editTelefone" placeholder="Digite o telefone">
        `;

        modalTitle.innerText = "Adicionar Membro";
        abrirModal();
    } catch (erro) {
        errorMessage.innerText = erro.message;
    }
}

// Salvar edição (adicionar ou editar membro)
async function salvarEdicao() {
    try {
        const usuarioId = document.getElementById("selectUsuario").value;
        const tipoMembro = document.getElementById("editCargo").value;
        const telefone = document.getElementById("editTelefone").value;

        const resposta = await fetch(`http://localhost:3000/api/startups/${startupId}/membros`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ usuario_id: usuarioId, tipo_membro: tipoMembro, telefone: telefone }) 
        });

        if (!resposta.ok) throw new Error("Erro ao adicionar membro");

        fecharModal();
        carregarDados(); 
    } catch (erro) {
        errorMessage.innerText = erro.message;
    }
}

// Remover membro, com requisito do usuario ser lider
async function removerMembro(membroId) {
    if (usuarioAtual.tipo_membro !== "Líder") {
        alert("Apenas o líder pode remover membros.");
        return;
    }

    const confirmacao = confirm("Tem certeza que deseja remover este membro?");
    if (!confirmacao) return;

    try {
        const resposta = await fetch(`http://localhost:3000/api/startups/${startupId}/membros/${membroId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) throw new Error("Erro ao remover membro");

        carregarDados();
    } catch (erro) {
        errorMessage.innerText = erro.message;
    }
}

// Editar membro, com requisito do usuario ser lider
async function editarMembro(membroId, cargoAtual) {
    if (usuarioAtual.tipo_membro !== "Líder") {
        alert("Apenas o líder pode editar membros.");
        return;
    }

    try {
        const novoCargo = prompt("Digite o novo cargo:", cargoAtual);
        if (!novoCargo) return;

        const novoTelefone = prompt("Digite o novo telefone:"); 

        const resposta = await fetch(`http://localhost:3000/api/startups/${startupId}/membros/${membroId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ tipo_membro: novoCargo, telefone: novoTelefone }) 
        });

        if (!resposta.ok) throw new Error("Erro ao editar membro");

        carregarDados();
    } catch (erro) {
        errorMessage.innerText = erro.message;
    }
}

// Funções de controle do modal
function abrirModal() {
    modal.style.display = "flex";
}

function fecharModal() {
    modal.style.display = "none";
}

// Fechar o modal ao clicar fora dele
window.onclick = function (event) {
    if (event.target === modal) {
        fecharModal();
    }
};

function voltar() {
    window.history.back();
}

function irParaHome() {
    window.location.href = "home.html"; // TODO: adicionar link da home
}
