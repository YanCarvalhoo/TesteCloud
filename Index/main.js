// ===============================
// INICIALIZAÇÃO DO SISTEMA
// ===============================
document.addEventListener("DOMContentLoaded", async function () {

    // ===============================
    // CARREGAR HTMLs DINÂMICOS
    // ===============================
    await fetch('header.html')
        .then(r => r.text())
        .then(data => document.getElementById('header').innerHTML = data);

    await fetch('main.html')
        .then(r => r.text())
        .then(data => document.getElementById('main').innerHTML = data);

    await fetch('footer.html')
        .then(r => r.text())
        .then(data => document.getElementById('footer').innerHTML = data);

    // Após carregar tudo, inicia o sistema
    iniciarSistema();
});


// ===============================
// FUNÇÃO PRINCIPAL DO SISTEMA
// ===============================
function iniciarSistema() {

    // ===============================
    // CONFIGURAÇÕES
    // ===============================
    const STORAGE_KEY = 'sysprod_produtos';

    let produtos = carregarProdutos(); // lista de produtos
    let idParaDeletar = null;          // controle do modal


    // ===============================
    // USUÁRIO LOGADO
    // ===============================
    const nomeUsuario = sessionStorage.getItem('usuarioLogado');

    if (nomeUsuario) {
        const el = document.getElementById('nomeUsuario');
        if (el) el.textContent = nomeUsuario;
    }


    // ===============================
    // LOGO (RECARREGA SISTEMA)
    // ===============================
    const logo = document.getElementById('logoLink');

    if (logo) {
        logo.addEventListener('click', e => {
            e.preventDefault();
            location.reload();
        });
    }


    // ===============================
    // NAVEGAÇÃO ENTRE TELAS
    // ===============================
    function navegar(screen) {

        // Remove active de todas telas e links
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        // Ativa tela selecionada
        document.getElementById('screen-' + screen)?.classList.add('active');
        document.querySelector(`[data-screen="${screen}"]`)?.classList.add('active');

        // Ações específicas por tela
        if (screen === 'produtos') renderTabela();
        if (screen === 'cadastrar') limparForm2();
    }

    // Clique no menu
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            navegar(link.dataset.screen);
        });
    });

    // Clique nos cards da home
    document.querySelectorAll('[data-goto]').forEach(card => {
        card.addEventListener('click', () => navegar(card.dataset.goto));
    });


    // ===============================
    // BOTÕES PRINCIPAIS
    // ===============================

    // Abrir formulário (novo produto)
    document.getElementById('btnNovoProduto')?.addEventListener('click', () => {
        document.getElementById('cardCriar').style.display = 'block';
        limparForm();
        document.getElementById('formTitulo').textContent = 'Novo Produto';
    });

    // Salvar (form principal)
    document.getElementById('btnSalvar')?.addEventListener('click', () => {
        salvarProduto(
            document.getElementById('inputNome'),
            document.getElementById('inputPreco'),
            document.getElementById('inputEstoque'),
            document.getElementById('erroNome'),
            document.getElementById('erroPreco'),
            document.getElementById('erroEstoque'),
            document.getElementById('editandoId').value
        );
    });

    // Cancelar (form principal)
    document.getElementById('btnCancelar')?.addEventListener('click', () => {
        limparForm();
        document.getElementById('cardCriar').style.display = 'none';
    });

    // Salvar (form secundário)
    document.getElementById('btnSalvar2')?.addEventListener('click', () => {
        salvarProduto(
            document.getElementById('inputNome2'),
            document.getElementById('inputPreco2'),
            document.getElementById('inputEstoque2'),
            document.getElementById('erroNome2'),
            document.getElementById('erroPreco2'),
            document.getElementById('erroEstoque2'),
            null
        );
    });

    // Limpar (form secundário)
    document.getElementById('btnCancelar2')?.addEventListener('click', limparForm2);


    // ===============================
    // MODAL DE EXCLUSÃO
    // ===============================
    document.getElementById('btnCancelDel')?.addEventListener('click', () => {
        document.getElementById('modalOverlay').style.display = 'none';
        idParaDeletar = null;
    });

    document.getElementById('btnConfirmDel')?.addEventListener('click', () => {

        if (idParaDeletar !== null) {

            // Remove produto
            produtos = produtos.filter(p => p.id !== idParaDeletar);

            salvarProdutosStorage();
            renderTabela();

            toast('Produto excluído', 'error');
        }

        document.getElementById('modalOverlay').style.display = 'none';
        idParaDeletar = null;
    });


    // ===============================
    // FUNÇÕES AUXILIARES
    // ===============================

    // Gera ID único
    function gerarId() {
        return Date.now();
    }


    // ===============================
    // SALVAR PRODUTO (CREATE / UPDATE)
    // ===============================
    function salvarProduto(inputNome, inputPreco, inputEstoque, erroNome, erroPreco, erroEstoque, editId) {

        const nome = inputNome.value.trim();
        const preco = parseFloat(inputPreco.value);
        const estoque = parseInt(inputEstoque.value);

        // Validação simples
        if (!nome || isNaN(preco) || isNaN(estoque)) {
            toast('Preencha corretamente', 'error');
            return;
        }

        // EDITAR
        if (editId) {
            const idx = produtos.findIndex(p => p.id === parseInt(editId));
            produtos[idx] = { ...produtos[idx], nome, preco, estoque };
        } 
        // CRIAR
        else {
            produtos.push({
                id: gerarId(),
                nome,
                preco,
                estoque
            });
        }

        salvarProdutosStorage();
        renderTabela();

        // Limpa campos
        inputNome.value = '';
        inputPreco.value = '';
        inputEstoque.value = '';
    }


    // ===============================
    // LIMPAR FORMULÁRIOS
    // ===============================
    function limparForm() {
        ['inputNome','inputPreco','inputEstoque'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }

    function limparForm2() {
        ['inputNome2','inputPreco2','inputEstoque2'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }


    // ===============================
    // RENDERIZAÇÃO DA TABELA
    // ===============================
    function renderTabela() {

        const tbody = document.getElementById('tabelaProdutos');
        if (!tbody) return;

        tbody.innerHTML = produtos.map(p => `
            <tr>
                <td>${p.nome}</td>
                <td>${p.preco}</td>
                <td>${p.estoque}</td>
                <td>
                    <button onclick="alert('editar depois')">
                        Editar
                    </button>
                </td>
            </tr>
        `).join('');
    }


    // ===============================
    // LOCAL STORAGE
    // ===============================
    function salvarProdutosStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
    }

    function carregarProdutos() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }


    // ===============================
    // TOAST (SIMPLES)
    // ===============================
    function toast(msg) {
        console.log(msg);
    }


    // Inicializa tabela
    renderTabela();
}