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

    const url = `${API_BASE_URL}${endpoint}`;
    if (params && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(params);
    }

    console.log('Enviando requisição para:', url, options);

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// ==================== LOGIN ====================
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('emailLogin').value;
  const senha = document.getElementById('passwordLogin').value;

  try {
    const loginData = { email, senha };
    const API_BASE_URL = 'https://localhost:44369';
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    if (!response.ok) throw new Error('Erro ao fazer login');

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userId', data.userId); // Salva o ID do usuário

    alert('Login realizado com sucesso!');
    window.location.href = "../profilepage/profile.html"; // Caminho relativo para a pasta profilepage

  } catch (error) {
    alert(`Falha no login: ${error.message}`);
  }
}


// ==================== CADASTRO ====================
async function handleCadastro(event) {
  event.preventDefault();

  const nome = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const contato = document.getElementById("contato").value;
  const Tipo_membro = document.getElementById("tipo_membro").value;
  const senha = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (senha !== confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    const userData = {
      nome: nome,
      email: email,
      contato: contato,
      Tipo_membro: Tipo_membro,
      senha: senha
    };

    console.log("Dados de cadastro enviados:", userData);

    const response = await makeRequest('/userRouteDev/cadastro', 'POST', userData);

    if (response && response.success) {
      alert(response.message || "Cadastro realizado com sucesso!");
      window.location.href = "/profilepage/profile46.html"; // Caminho absoluto
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
  window.location.href = "/TelaLoginCadastro/profile2.html"; // Caminho absoluto
}

function goToLogin() {
  window.location.href = "/TelaLoginCadastro/profile46.html"; // Caminho absoluto
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