const apiUrl = 'https://openlibrary.org/search.json';
let paginaAtual = 1;
const livrosPorPagina = 6;
let data;

function buscarLivrosComFiltros() {
    const tituloInput = document.getElementById('titulo');
    const autorInput = document.getElementById('autor');
    const queryInput = document.getElementById('query');

    const titulo = tituloInput.value.trim();
    const autor = autorInput.value.trim();
    const query = queryInput.value.trim();

    const parametros = [];

    if (titulo) {
        parametros.push(`title=${encodeURIComponent(titulo)}`);
    }

    if (autor) {
        parametros.push(`author=${encodeURIComponent(autor)}`);
    }


    const ordenacaoSelect = document.getElementById('ordenacao');
    const ordenacao = ordenacaoSelect.value;
    if (ordenacao) {
        parametros.push(`sort=${encodeURIComponent(ordenacao)}`);
    }

    const url = `${apiUrl}?${parametros.join('&')}&page=${paginaAtual}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Não foi possível obter os resultados. Tente novamente.');
            }
            return response.json();
        })
        .then(resultData => {
            console.log(resultData);
            data = resultData;
            exibirResultado(data);
        })
        .catch(error => {
            console.error('Erro na solicitação:', error);
            alert(error.message);
        });
}

function exibirResultado(data) {
    const resultadoDiv = document.getElementById('resultado');
    const paginationDiv = document.getElementById('pagination');

    resultadoDiv.innerHTML = '';
    paginationDiv.innerHTML = '';

    if (data.docs.length === 0) {
        resultadoDiv.innerHTML = '<p>Nenhum livro encontrado.</p>';
        return;
    }

    const startIndex = (paginaAtual - 1) * livrosPorPagina;
    const endIndex = startIndex + livrosPorPagina;
    const livrosExibidos = data.docs.slice(startIndex, endIndex);

    livrosExibidos.forEach(livro => {
        const livroDiv = document.createElement('div');
        livroDiv.classList.add('livro');

        const capa = livro.cover_i
            ? `<img src="https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg" alt="${livro.title}">`
            : '<p class="sem-capa">Capa não disponível</p>';

        const titulo = `<h2>${livro.title}</h2>`;
        const autor = `<p class="autor">Autor: ${livro.author_name ? livro.author_name.join(', ') : 'N/A'}</p>`;

        livroDiv.innerHTML = `${capa}${titulo}${autor}`;
        resultadoDiv.appendChild(livroDiv);
    });

    const numPags = Math.ceil(data.numFound / livrosPorPagina);

    paginationDiv.innerHTML = `<p>Página ${paginaAtual} de ${numPags}</p>`;

    if (numPags > 1) {
        paginationDiv.innerHTML += `
            <button onclick="irParaPagina(${paginaAtual - 1})" ${paginaAtual === 1 ? 'disabled' : ''}>Anterior</button>
            <span>
                Ir para página: 
                <input type="number" id="inputPagina" min="1" max="${numPags}" value="${paginaAtual}" />
                <button onclick="irParaPagina(document.getElementById('inputPagina').value)">Ir</button>
            </span>
            <button onclick="irParaPagina(${paginaAtual + 1})" ${paginaAtual === numPags ? 'disabled' : ''}>Próxima</button>
        `;
    }
}

function limparResultado() {
    const resultadoDiv = document.getElementById('resultado');
    const paginationDiv = document.getElementById('pagination');
    resultadoDiv.innerHTML = '';
    paginationDiv.innerHTML = '';
}

function irParaPagina(pagina) {
    const numPags = Math.ceil(data.numFound / livrosPorPagina);

    if (pagina >= 1 && pagina <= numPags) {
        paginaAtual = pagina;
        buscarLivrosComFiltros();
    } else {
        alert(`Digite um número entre 1 e ${numPags}.`);
    }
}
