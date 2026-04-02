// ===============================
// CARREGAMENTO DO HTML PRINCIPAL
// ===============================

// Carrega o conteúdo de main.html dentro da <main id="main">
fetch('main.html')
.then(response => response.text())
.then(data => {
    document.getElementById('main').innerHTML = data;
});


// ===============================
// FUNÇÃO AUTOEXECUTÁVEL (IIFE)
// Evita poluir o escopo global
// ===============================
(function () {

    // ===============================
    // SELEÇÃO DOS ELEMENTOS
    // ===============================
    const inputUsuario = document.getElementById('inputUsuario');
    const inputSenha   = document.getElementById('inputSenha');
    const chkLembrar   = document.getElementById('lembrarSenha');
    const btnLogin     = document.getElementById('btnLogin');
    const alertMsg     = document.getElementById('alertMsg');


    // ===============================
    // CARREGAR DADOS SALVOS (LOCALSTORAGE)
    // ===============================

    // Verifica se o usuário marcou "lembrar senha"
    const lembrado = localStorage.getItem('lembrarSenha');

    if (lembrado === 'true') {
        chkLembrar.checked = true;

        // Recupera dados salvos
        const senhaGuardada = localStorage.getItem('senhaGuardada');
        const usuarioGuardado = localStorage.getItem('usuarioGuardado');

        // Preenche os campos automaticamente
        if (senhaGuardada) inputSenha.value = senhaGuardada;
        if (usuarioGuardado) inputUsuario.value = usuarioGuardado;
    }


    // ===============================
    // FUNÇÕES DE ERRO (VALIDAÇÃO)
    // ===============================

    // Exibe erro no campo
    function showError(inputEl, errEl, msg) {
        inputEl.classList.add('error-field'); // adiciona estilo de erro
        errEl.textContent = msg;              // define mensagem
        errEl.classList.add('show');          // mostra mensagem
    }

    // Remove erro do campo
    function clearError(inputEl, errEl) {
        inputEl.classList.remove('error-field');
        errEl.classList.remove('show');
    }


    // ===============================
    // EVENTOS DE INPUT (REMOVE ERRO AO DIGITAR)
    // ===============================
    inputUsuario.addEventListener('input', () => {
        clearError(inputUsuario, document.getElementById('erroUsuario'));
    });

    inputSenha.addEventListener('input', () => {
        clearError(inputSenha, document.getElementById('erroSenha'));
    });


    // ===============================
    // EVENTO DE LOGIN
    // ===============================
    btnLogin.addEventListener('click', function () {

        let valido = true;

        // Reset da mensagem de alerta
        alertMsg.className = 'alert-msg';
        alertMsg.textContent = '';

        // ===============================
        // VALIDAÇÃO DOS CAMPOS
        // ===============================

        if (!inputUsuario.value.trim()) {
            showError(
                inputUsuario,
                document.getElementById('erroUsuario'),
                'Por favor, informe seu usuário.'
            );
            valido = false;
        }

        if (!inputSenha.value.trim()) {
            showError(
                inputSenha,
                document.getElementById('erroSenha'),
                'Por favor, informe sua senha.'
            );
            valido = false;
        }

        // Se inválido, para execução
        if (!valido) return;


        // ===============================
        // LEMBRAR SENHA (LOCALSTORAGE)
        // ===============================
        if (chkLembrar.checked) {
            localStorage.setItem('lembrarSenha', 'true');
            localStorage.setItem('senhaGuardada', inputSenha.value);
            localStorage.setItem('usuarioGuardado', inputUsuario.value.trim());
        } else {
            localStorage.removeItem('lembrarSenha');
            localStorage.removeItem('senhaGuardada');
            localStorage.removeItem('usuarioGuardado');
        }


        // ===============================
        // SESSÃO DO USUÁRIO (SESSIONSTORAGE)
        // ===============================
        sessionStorage.setItem('usuarioLogado', inputUsuario.value.trim());


        // ===============================
        // FEEDBACK + REDIRECIONAMENTO
        // ===============================
        alertMsg.textContent = 'Login realizado com sucesso! Redirecionando...';
        alertMsg.classList.add('success');

        // Redireciona após 1 segundo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    });

})();