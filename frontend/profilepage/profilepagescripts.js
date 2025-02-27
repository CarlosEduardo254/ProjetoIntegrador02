// Função para carregar dados do perfil
async function loadProfileData() {
  try {
    // Esta parte está comentada para ser possível visualizar em live
    /*const token = localStorage.getItem('token');

    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      window.location.href = '/login';
      return;
    }

    const response = await fetch('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });*/

    if (!response.ok) throw new Error('Erro ao carregar dados');

    const data = await response.json();

    document.querySelector('h2').textContent = `Nome: ${data.name}`;
    document.querySelector('p:nth-of-type(1)').textContent = `Email: ${data.email}`;
    document.querySelector('p:nth-of-type(2)').textContent = `Contato: ${data.contact}`;

    document.getElementById('name').value = data.name || '';
    document.getElementById('email').value = data.email || '';
    
    const contact = data.contact?.toString() || '';
    document.getElementById('ddd').value = contact.substring(0, 2) || '';
    document.getElementById('phone').value = contact.substring(2) || '';

    const profilePic = document.getElementById('profile-pic');
    profilePic.src = data.profileImage || 'default-profile.png';

  } catch (error) {
    console.error('Erro:', error);
    alert(error.message);
  }
}

// Função para formatar contato (DDD + número)
function formatContact(ddd, phone) {
  return parseInt(ddd + phone, 10);
}

document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const ddd = document.getElementById('ddd').value;
  const phone = document.getElementById('phone').value;
  const newPassword = document.getElementById('new-password').value;
  const currentPassword = document.getElementById('current-password').value;

  // Validações
  try {
    if (!/^\d{2}$/.test(ddd)) {
      throw new Error('DDD deve conter exatamente 2 dígitos!');
    }

    if (!/^\d{8,9}$/.test(phone)) {
      throw new Error('Número deve ter 8 ou 9 dígitos!');
    }

    if (newPassword && newPassword.length < 8) {
      throw new Error('A nova senha deve ter pelo menos 8 caracteres!');
    }

    if (!currentPassword) {
      throw new Error('Confirme com sua senha atual!');
    }

    const body = {
      name,
      email,
      contact: formatContact(ddd, phone),
      currentPassword,
      ...(newPassword && { newPassword })
    };

    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(body)
    });

    const responseText = await response.text();

    // Tratamento de erros com atualização de email
    if (!response.ok) {
      if (responseText.toLowerCase().includes('já está em uso')) {
        throw new Error('Este e-mail já está cadastrado!');
      }
      throw new Error(responseText || 'Erro desconhecido');
    }

    alert('Perfil atualizado com sucesso!');
    loadProfileData();
    document.getElementById('new-password').value = '';

  } catch (error) {
    console.error('Erro:', error);
    alert(error.message);
  }
});

// função para alterar foto
document.getElementById('upload-image').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/user/profile/image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) throw new Error('Falha no upload');

    const data = await response.json();
    document.getElementById('profile-pic').src = data.imageUrl;

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao enviar imagem: ' + error.message);
  }
});

// função para excluir conta
document.getElementById('confirm-delete').addEventListener('click', async () => {
  const password = document.getElementById('delete-password').value;

  try {
    if (!password) throw new Error('Digite sua senha para confirmar!');

    const response = await fetch('/api/user/profile', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao excluir conta');
    }

    localStorage.removeItem('token');
    alert('Conta excluída com sucesso!');
    window.location.href = '/login';

  } catch (error) {
    console.error('Erro:', error);
    alert(error.message);
  }
});

function voltar() {
    window.history.back();
}

function irParaHome() {
    window.location.href = "home.html"; // TODO: adicionar link da home
}

// Chamada da função para carregar os dados
document.addEventListener('DOMContentLoaded', () => {
  loadProfileData();
});
