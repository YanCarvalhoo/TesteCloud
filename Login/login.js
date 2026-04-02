fetch('main.html')
.then(response => response.text())
.then(data => {
    document.getElementById('main').innerHTML = data;
});

(function () {
    const inputUsuario = document.getElementById('inputUsuario');
    const inputSenha   = document.getElementById('inputSenha');
    const chkLembrar   = document.getElementById('lembrarSenha');
    const btnLogin     = document.getElementById('btnLogin');
    const alertMsg     = document.getElementById('alertMsg');

    // Carregar "lembrar senha" e preencher campos se ativo
    const lembrado = localStorage.getItem('lembrarSenha');
    if (lembrado === 'true') {
        chkLembrar.checked = true;
        const senhaGuardada = localStorage.getItem('senhaGuardada');
        const usuarioGuardado = localStorage.getItem('usuarioGuardado');
        if (senhaGuardada) inputSenha.value = senhaGuardada;
        if (usuarioGuardado) inputUsuario.value = usuarioGuardado;
    }

    function showError(inputEl, errEl, msg) {
        inputEl.classList.add('error-field');
        errEl.textContent = msg;
        errEl.classList.add('show');
    }

    function clearError(inputEl, errEl) {
        inputEl.classList.remove('error-field');
        errEl.classList.remove('show');
    }

    inputUsuario.addEventListener('input', () => clearError(inputUsuario, document.getElementById('erroUsuario')));
    inputSenha.addEventListener('input',   () => clearError(inputSenha,   document.getElementById('erroSenha')));

    btnLogin.addEventListener('click', function () {
        let valido = true;
        alertMsg.className = 'alert-msg';
        alertMsg.textContent = '';

        if (!inputUsuario.value.trim()) {
            showError(inputUsuario, document.getElementById('erroUsuario'), 'Por favor, informe seu usuário.');
            valido = false;
        }
        if (!inputSenha.value.trim()) {
            showError(inputSenha, document.getElementById('erroSenha'), 'Por favor, informe sua senha.');
            valido = false;
        }

        if (!valido) return;

        // Salvar lembrar senha
        if (chkLembrar.checked) {
            localStorage.setItem('lembrarSenha', 'true');
            localStorage.setItem('senhaGuardada', inputSenha.value);
            localStorage.setItem('usuarioGuardado', inputUsuario.value.trim());
        } else {
            localStorage.removeItem('lembrarSenha');
            localStorage.removeItem('senhaGuardada');
            localStorage.removeItem('usuarioGuardado');
        }

        // Salvar usuário na sessionStorage
        sessionStorage.setItem('usuarioLogado', inputUsuario.value.trim());

        // Redirecionar
        alertMsg.textContent = 'Login realizado com sucesso! Redirecionando...';
        alertMsg.classList.add('success');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
})();