const apiUrl = 'https://openlibrary.org/search.json';
const booksPerPage = 6;

let data;
let currentPage = 1;
let numPages;

function searchBooksWithFilters() {
  currentPage = 1
  const title = document.getElementById('title')?.value.trim();
  const author = document.getElementById('author')?.value.trim();
  const sorting = document.getElementById('sorting')?.value;
  const parameters = [];
  if (title) {
    parameters.push(`title=${encodeURIComponent(title)}`);
  }
  if (author) {
    parameters.push(`author=${encodeURIComponent(author)}`);
  }
  if (sorting) {
    parameters.push(`sort=${encodeURIComponent(sorting)}`);
  }
  const url = `${apiUrl}?${parameters.join('&')}&page=${currentPage}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          'Incapaz de recuperar resultados. Por favor, tente novamente.'
        );
      }
      return response.json();
    })
    .then((resultData) => {
      displayResults(resultData);
    })
    .catch((error) => {
      console.error('Request error:', error);
      alert(error.message);
    });
}

function reSort() {
  const title = document.getElementById('title')?.value.trim();
  const author = document.getElementById('author')?.value.trim();
  const sorting = document.getElementById('sorting')?.value;
  const query = document.getElementById('query')?.value.trim();
  const parameters = [];
  if (title) {
    parameters.push(`title=${encodeURIComponent(title)}`);
  }
  if (author) {
    parameters.push(`author=${encodeURIComponent(author)}`);
  }
  if (query && !author && !title) {
    parameters.push(`q=${encodeURIComponent(query)}`);
  }
  if (sorting) {
    parameters.push(`sort=${encodeURIComponent(sorting)}`);
  }
  if (!sorting && !query && !author && !title) {
    console.log('no filters');
  }
  const url = `${apiUrl}?${parameters.join('&')}&page=${currentPage}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          'Incapaz de recuperar resultados. Por favor, tente novamente.'
        );
      }
      return response.json();
    })
    .then((resultData) => {
      console.log(resultData);
      displayResults(resultData);
    })
    .catch((error) => {
      console.error('Request error:', error);
      alert(error.message);
    });
}
function searchBooks() {
  currentPage = 1
  const query = document.getElementById('query')?.value.trim();
  const sorting = document.getElementById('sorting')?.value;
  const parameters = [];
  if (query) {
    parameters.push(`q=${encodeURIComponent(query)}`);
  }
  if (sorting) {
    parameters.push(`sort=${encodeURIComponent(sorting)}`);
  }
  const url = `${apiUrl}?${parameters.join('&')}&page=${currentPage}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          'Incapaz de recuperar resultados. Por favor, tente novamente.'
        );
      }
      return response.json();
    })
    .then((resultData) => {
      displayResults(resultData);
    })
    .catch((error) => {
      console.error('Request error:', error);
      alert(error.message);
    });
}

function openModalWithBook(book) {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  document.getElementById('book-cover').src =
    'https://covers.openlibrary.org/b/id/' + book.cover_i + '-M.jpg';
  document.getElementById('book-title').innerHTML = book.title;
  document.getElementById(
    'book-author'
  ).innerHTML = `<span>Autor(a):</span> ${book.author_name.join(', ')}`;
  document.getElementById(
    'book-first-publish-year'
  ).innerHTML = `<span>Primeira data de publicação:</span> ${book.first_publish_year}`;
  bookRating = book.ratings_average;
  if (bookRating == undefined) {
    bookRating = 'N/A';
  } else {
    bookRating = Math.round(bookRating * 100) / 100;
  }
  document.getElementById(
    'book-rating'
  ).innerHTML = `<span>Avaliação média</span>: ${bookRating}/5`;
  document.getElementById(
    'book-pages'
  ).innerHTML = `<span>Nº de páginas:</span> ${book.number_of_pages_median}`;
  document.getElementById(
    'book-isbn'
  ).innerHTML = `<span>ISBN:</span> ${book.isbn[0]}`;
  document.getElementById(
    'book-language'
  ).innerHTML = `Esse livro foi escrito em ${book.language.length} idioma${book.language.length != 1 ? 's' : ''
  }`;
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function displayResults(data) {
  const resultDiv = document.getElementById('result');
  const noResults = document.getElementById('noResults');
  const paginationDiv = document.getElementById('pagination');
  resultDiv.innerHTML = ``;
  if (data.docs.length === 0) {
    noResults.classList.add('visible');
    return;
  }
  noResults.classList.remove('visible');

  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const displayedBooks = data.docs.slice(startIndex, endIndex);

  displayedBooks.forEach((book) => {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book');

    const cover = book.cover_i
      ? `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="capa do livro ${book.title}">`
      : '<p class="no-cover">Capa indisponivel</p>';
    const infos = `<div class="book-info">
        <h3>${book.title}</h3>
        <p class="author">Autor(a): ${book.author_name ? book.author_name.join(', ') : 'N/A'
      }</p>
        </div>
        `;
    bookDiv.innerHTML = `${cover}${infos}`;
    bookDiv.addEventListener('click', () => {
      openModalWithBook(book);
    });
    resultDiv.appendChild(bookDiv);
  });

  numPages = Math.ceil(data.numFound / booksPerPage);

  paginationDiv.innerHTML = `<p>Pagina ${currentPage} de ${numPages}</p>`;

  if (numPages > 1) {
    paginationDiv.innerHTML += `
            <button class="button" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''
      }>Anterior</button>
            <button class="button" onclick="goToPage(${currentPage + 1})" ${currentPage === numPages ? 'disabled' : ''
      }>Proxima</button>
            <div class="search">
            Ir para a pagina: 
            <input type="number" id="inputPage" min="1" max="${numPages}" value="${currentPage}" />
            <button class="button" onclick="goToPage(document.getElementById('inputPage').value)">Go</button>
        </div>
        `;
  }
}

function clearResults() {
  const resultDiv = document.getElementById('result');
  const paginationDiv = document.getElementById('pagination');
  resultDiv.innerHTML = '';
  paginationDiv.innerHTML = '';
  noResults.classList.remove('visible');
}

function goToPage(page) {
  if (page >= 1 && page <= numPages) {
    currentPage = page;
    reSort();
  } else {
    alert(`Insira um numero entre 1 e ${numPages}.`);
  }
}
