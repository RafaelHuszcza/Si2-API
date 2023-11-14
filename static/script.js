const apiUrl = 'https://openlibrary.org/search.json';
const booksPerPage = 6;

let data;
let currentPage = 1;






function searchBooksWithFilters() {
    const title = document.getElementById('title')?.value.trim();
    const author = document.getElementById('author')?.value.trim();
    const sorting = document.getElementById('sorting')?.value
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
        .then(response => {
            if (!response.ok) {
                throw new Error('Incapaz de recuperar resultados. Por favor, tente novamente.');
            }
            return response.json();
        })
        .then(resultData => {
            displayResults(resultData);
        })
        .catch(error => {
            console.error('Request error:', error);
            alert(error.message);
        });
}

function reSort() {
    const title = document.getElementById('title')?.value.trim();
    const author = document.getElementById('author')?.value.trim();
    const sorting = document.getElementById('sorting')?.value
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
        .then(response => {
            if (!response.ok) {
                throw new Error('Incapaz de recuperar resultados. Por favor, tente novamente.');
            }
            return response.json();
        })
        .then(resultData => {
            console.log(resultData);
            displayResults(resultData);
        })
        .catch(error => {
            console.error('Request error:', error);
            alert(error.message);
        });
}
function searchBooks() {
    const query = document.getElementById('query')?.value.trim();
    const sorting = document.getElementById('sorting')?.value
    const parameters = [];
    if (query) {
        parameters.push(`q=${encodeURIComponent(query)}`);
    }
    if (sorting) {
        parameters.push(`sort=${encodeURIComponent(sorting)}`);
    }
    const url = `${apiUrl}?${parameters.join('&')}&page=${currentPage}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Incapaz de recuperar resultados. Por favor, tente novamente.');
            }
            return response.json();
        })
        .then(resultData => {
            console.log(resultData);
            displayResults(resultData);
        })
        .catch(error => {
            console.error('Request error:', error);
            alert(error.message);
        });
}

function displayResults(data) {
    const resultDiv = document.getElementById('result');
    const noResults = document.getElementById('noResults');
    const paginationDiv = document.getElementById('pagination');

    if (data.docs.length === 0) {
        noResults.classList.add("visible");
        return;
    }
    noResults.classList.remove("visible");

    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const displayedBooks = data.docs.slice(startIndex, endIndex);
    resultDiv.innerHTML = ``;
    displayedBooks.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        const cover = book.cover_i
            ? `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}">`
            : '<p class="no-cover">Cover not available</p>';
        const infos = `<div class="book-info">
        <h3>${book.title}</h3>
        <p class="author">Author: ${book.author_name ? book.author_name.join(', ') : 'N/A'}</p>
        </div>
        `
        bookDiv.innerHTML = `${cover}${infos}`;
        resultDiv.appendChild(bookDiv);
    });

    const numPages = Math.ceil(data.numFound / booksPerPage);

    paginationDiv.innerHTML = `<p>Page ${currentPage} of ${numPages}</p>`;

    if (numPages > 1) {
        paginationDiv.innerHTML += `
            <button class="button" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <button class="button" onclick="goToPage(${currentPage + 1})" ${currentPage === numPages ? 'disabled' : ''}>Next</button>
            <div class="search">
            Go to page: 
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
    noResults.classList.remove("visible");
}

function goToPage(page) {
    const numPages = Math.ceil(data.numFound / booksPerPage);

    if (page >= 1 && page <= numPages) {
        currentPage = page;
        searchBooksWithFilters();
    } else {
        alert(`Enter a number between 1 and ${numPages}.`);
    }
}
