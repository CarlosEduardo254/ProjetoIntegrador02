// Configuração base da API
const API_BASE_URL = 'https://localhost:44369';

// Função genérica para requests
async function makeRequest(endpoint, method, params = null) {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const url = `${API_BASE_URL}${endpoint}`; // URL completa

    // Envia parâmetros no body para POST/PUT
    if (params && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(params);
    }

    console.log('Enviando requisição para:', url, options);

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Verifica se o conteúdo é JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return null; // Retorna null se não houver JSON
    }

  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// ==================== LOGIN ====================
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("passwordLogin").value;

  try {
    const loginData = { email, senha };
    console.log('Dados de login:', loginData);

    const response = await makeRequest('/auth/login', 'POST', loginData);
    console.log('Resposta do login:', response);

    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);

    alert("Login realizado com sucesso!");
    window.location.href = "profile47.html";

  } catch (error) {
    alert(`Falha no login: ${error.message}`);
  }
}

// ==================== CADASTRO ====================
async function handleCadastro(event) {
  event.preventDefault();

  // Coleta os valores dos campos do formulário
  const nome = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const contato = document.getElementById("contato").value;
  const Tipo_membro = document.getElementById("tipo_membro").value; // ID em minúsculo
  const senha = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validação de senha
  if (senha !== confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    // Monta o objeto de dados para cadastro
    const userData = {
      nome: nome,
      email: email,
      contato: contato,
      Tipo_membro: Tipo_membro, // Campo igual ao DTO do backend
      senha: senha
    };

    console.log("Dados de cadastro enviados:", userData);

    // Faz a requisição POST para o endpoint de cadastro
    const response = await makeRequest('/userRouteDev/cadastro', 'POST', userData);

    // Tratamento da resposta do servidor
    if (response && response.success) {
      alert(response.message || "Cadastro realizado com sucesso!");
      window.location.href = "profile46.html";
    } else {
      alert(response?.message || "Erro ao processar o cadastro");
    }

  } catch (error) {
    console.error("Erro detalhado:", error);
    alert(`Erro no cadastro: ${error.message}`);
  }
}

// ==================== FUNÇÕES AUXILIARES ====================
function goToRegister() {
  window.location.href = "profile2.html";
}

function goToLogin() {
  window.location.href = "profile46.html";
}

function goBack() {
  window.history.back();
}

// ==================== VALIDAÇÃO DE CHECKBOX ====================
const checkbox = document.getElementById("termsCheckbox");
const submitButton = document.getElementById("submitRegister");
if (checkbox && submitButton) {
  checkbox.addEventListener("change", function () {
    submitButton.disabled = !checkbox.checked;
  });
} 