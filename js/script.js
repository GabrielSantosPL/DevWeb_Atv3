const STORAGE_KEY = 'crud_users_v1';

const form = document.getElementById('user-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const dobInput = document.getElementById('dob');

const clearAllBtn = document.getElementById('clear-all');
const tbody = document.getElementById('users-tbody');
const emptyMessage = document.getElementById('empty-message');

let users = loadUsers();
renderList();

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const name = nameInput.value.trim();
	const email = emailInput.value.trim();
	const dob = dobInput.value;

	if (!name || !email || !dob) {
		return alert('Preencha nome, email e data.');
	}

	users.push({ id: Date.now().toString(), name, email, dob });
	saveUsers();
	renderList();
	form.reset();
});

clearAllBtn.addEventListener('click', () => {
	if (!users.length) return alert('Nenhum usuário para excluir.');
	if (!confirm('Deseja realmente excluir TODOS os usuários?')) return;
	users = [];
	saveUsers();
	renderList();
});

tbody.addEventListener('click', (e) => {
	const btn = e.target.closest('button');
	if (!btn) return;
	const action = btn.dataset.action;
	const id = btn.dataset.id;
	const idx = users.findIndex(u => u.id === id);

	if (action === 'delete') {
		if (idx === -1) return;
		if (!confirm('Confirmar exclusão deste usuário?')) return;
		users.splice(idx, 1);
		saveUsers();
		renderList();
		return;
	}

	if (action === 'edit') {
		if (idx === -1) return;
		const u = users[idx];
		const novoNome = prompt('Editar nome:', u.name);
		const novoEmail = prompt('Editar email:', u.email);
		const novaDob = prompt('Editar data (AAAA-MM-DD):', u.dob);
		if (novoNome && novoEmail && novaDob) {
			users[idx] = { id: u.id, name: novoNome, email: novoEmail, dob: novaDob };
			saveUsers();
			renderList();
		}
	}
});

function loadUsers() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
	} catch {
		return [];
	}
}

function saveUsers() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function renderList() {
	tbody.innerHTML = '';
	if (!users.length) {
		emptyMessage.textContent = 'Nenhum usuário cadastrado.';
		return;
	}
	emptyMessage.textContent = '';
	for (const u of users) {
		const tr = document.createElement('tr');

		const tdName = document.createElement('td');
		tdName.textContent = u.name;
		tr.appendChild(tdName);

		const tdEmail = document.createElement('td');
		tdEmail.textContent = u.email;
		tr.appendChild(tdEmail);

		const tdDob = document.createElement('td');
		tdDob.textContent = formatDate(u.dob);
		tr.appendChild(tdDob);

		// coluna "idade" removida

		const tdActions = document.createElement('td');
		tdActions.className = 'text-end';

		const editBtn = document.createElement('button');
		editBtn.className = 'btn btn-sm btn-outline-secondary me-2';
		editBtn.dataset.action = 'edit';
		editBtn.dataset.id = u.id;
		editBtn.textContent = 'Editar';

		const deleteBtn = document.createElement('button');
		deleteBtn.className = 'btn btn-sm btn-outline-danger';
		deleteBtn.dataset.action = 'delete';
		deleteBtn.dataset.id = u.id;
		deleteBtn.textContent = 'Excluir';

		tdActions.appendChild(editBtn);
		tdActions.appendChild(deleteBtn);
		tr.appendChild(tdActions);

		tbody.appendChild(tr);
	}
}

// Adiciona a função de formatação de data usada em renderList
function formatDate(iso) {
	if (!iso) return '';
	const d = new Date(iso);
	return isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString();
}
