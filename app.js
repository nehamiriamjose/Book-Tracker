/**
 * Book Tracker - Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const bookForm = document.getElementById('book-form');
  const bookTitleInput = document.getElementById('book-title');
  const bookAuthorInput = document.getElementById('book-author');
  const readingStatusSelect = document.getElementById('reading-status');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const titleError = document.getElementById('title-error');
  const authorError = document.getElementById('author-error');

  const booksGrid = document.getElementById('books-grid');
  const emptyState = document.getElementById('empty-state');
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Stats Elements
  const statTotal = document.getElementById('stat-total');
  const statToRead = document.getElementById('stat-toread');
  const statReading = document.getElementById('stat-reading');
  const statFinished = document.getElementById('stat-finished');

  const toast = document.getElementById('toast');

  // Initial Sample Data if LocalStorage is empty
  const initialBooks = [
    {
      id: 'demo-1',
      title: 'Atomic Habits',
      author: 'James Clear',
      status: 'Reading',
      createdAt: Date.now() - 86400000 * 2
    },
    {
      id: 'demo-2',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      status: 'Finished',
      createdAt: Date.now() - 86400000 * 5
    },
    {
      id: 'demo-3',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      status: 'To read',
      createdAt: Date.now() - 86400000 * 1
    }
  ];

  // State
  let books = loadBooks();
  let currentFilter = 'all';
  let searchQuery = '';

  // Load from localStorage or set defaults
  function loadBooks() {
    const saved = localStorage.getItem('book_tracker_books');
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse books from localStorage', e);
      }
    }
    return [...initialBooks];
  }

  // Save to localStorage
  function saveBooks() {
    localStorage.setItem('book_tracker_books', JSON.stringify(books));
  }

  // Toast Notification
  let toastTimeout;
  function showToast(message, type = 'success') {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${type === 'danger' ? 'toast-danger' : 'toast-success'}`;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.className = 'toast';
    }, 2800);
  }

  const errorIconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  // Single Field Validation Helper
  function validateField(input, errorEl, fieldName) {
    const val = input.value.trim();
    if (!val) {
      input.classList.add('input-error');
      input.setAttribute('aria-invalid', 'true');
      errorEl.innerHTML = `${errorIconSvg} ${fieldName} is required.`;
      errorEl.classList.add('visible');
      return false;
    } else {
      input.classList.remove('input-error');
      input.removeAttribute('aria-invalid');
      errorEl.innerHTML = '';
      errorEl.classList.remove('visible');
      return true;
    }
  }

  // Full Form Validation
  function validateForm() {
    const isTitleValid = validateField(bookTitleInput, titleError, 'Book title');
    const isAuthorValid = validateField(bookAuthorInput, authorError, 'Author');

    // Auto-focus first invalid input
    if (!isTitleValid) {
      bookTitleInput.focus();
    } else if (!isAuthorValid) {
      bookAuthorInput.focus();
    }

    return isTitleValid && isAuthorValid;
  }

  // Clear Validation Errors
  function clearErrors() {
    bookTitleInput.classList.remove('input-error');
    bookAuthorInput.classList.remove('input-error');
    bookTitleInput.removeAttribute('aria-invalid');
    bookAuthorInput.removeAttribute('aria-invalid');
    titleError.innerHTML = '';
    titleError.classList.remove('visible');
    authorError.innerHTML = '';
    authorError.classList.remove('visible');
  }

  // Update Header Counters
  function updateStats() {
    const total = books.length;
    const toRead = books.filter(b => b.status === 'To read').length;
    const reading = books.filter(b => b.status === 'Reading').length;
    const finished = books.filter(b => b.status === 'Finished').length;

    statTotal.textContent = total;
    statToRead.textContent = toRead;
    statReading.textContent = reading;
    statFinished.textContent = finished;
  }

  // Render Books Grid
  function renderBooks() {
    updateStats();

    // Filter books based on search & category
    const filtered = books.filter(book => {
      const matchesFilter = (currentFilter === 'all') || (book.status === currentFilter);
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      booksGrid.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    booksGrid.innerHTML = filtered.map(book => {
      const statusClass = book.status === 'To read' 
        ? 'status-toread' 
        : book.status === 'Reading' 
          ? 'status-reading' 
          : 'status-finished';

      return `
        <article class="book-card" data-id="${book.id}">
          <div class="book-card-top">
            <div class="book-info">
              <h3 class="book-card-title">${escapeHTML(book.title)}</h3>
              <p class="book-card-author">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                ${escapeHTML(book.author)}
              </p>
            </div>
            <span class="status-badge ${statusClass}">${book.status}</span>
          </div>

          <div class="book-card-actions">
            <label for="change-status-${book.id}" class="sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;">Change status for ${escapeHTML(book.title)}</label>
            <select id="change-status-${book.id}" class="status-cycle-select" data-action="change-status" data-id="${book.id}" title="Change Reading Status">
              <option value="To read" ${book.status === 'To read' ? 'selected' : ''}>To read</option>
              <option value="Reading" ${book.status === 'Reading' ? 'selected' : ''}>Reading</option>
              <option value="Finished" ${book.status === 'Finished' ? 'selected' : ''}>Finished</option>
            </select>

            <button type="button" class="delete-btn" data-action="delete" data-id="${book.id}" title="Delete book from library" aria-label="Delete ${escapeHTML(book.title)}">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  // HTML Escaping Helper
  function escapeHTML(str) {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }

  // Handle Form Submission
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newBook = {
      id: 'book-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
      title: bookTitleInput.value.trim(),
      author: bookAuthorInput.value.trim(),
      status: readingStatusSelect.value || 'To read',
      createdAt: Date.now()
    };

    // If an incompatible filter or search is active, reset to 'all' so user sees their new book at the top
    if (currentFilter !== 'all' && currentFilter !== newBook.status) {
      currentFilter = 'all';
      filterBtns.forEach(btn => {
        const isActive = btn.dataset.filter === 'all';
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }
    if (searchQuery) {
      searchQuery = '';
      if (searchInput) searchInput.value = '';
    }

    // Add new book to the front (top of list)
    books.unshift(newBook);
    saveBooks();
    renderBooks();

    // Reset Form fields and maintain "To read" default
    bookTitleInput.value = '';
    bookAuthorInput.value = '';
    readingStatusSelect.value = 'To read';
    clearErrors();

    bookTitleInput.focus();
    showToast(`"${newBook.title}" added to your library!`, 'success');
  });

  // Handle Clear / Reset Button
  resetFormBtn.addEventListener('click', () => {
    bookTitleInput.value = '';
    bookAuthorInput.value = '';
    readingStatusSelect.value = 'To read';
    clearErrors();
    bookTitleInput.focus();
  });

  // Real-time input error clearing on type
  bookTitleInput.addEventListener('input', () => {
    if (bookTitleInput.value.trim()) {
      bookTitleInput.classList.remove('input-error');
      bookTitleInput.removeAttribute('aria-invalid');
      titleError.innerHTML = '';
      titleError.classList.remove('visible');
    }
  });

  bookAuthorInput.addEventListener('input', () => {
    if (bookAuthorInput.value.trim()) {
      bookAuthorInput.classList.remove('input-error');
      bookAuthorInput.removeAttribute('aria-invalid');
      authorError.innerHTML = '';
      authorError.classList.remove('visible');
    }
  });

  // Blur validation
  bookTitleInput.addEventListener('blur', () => {
    if (!bookTitleInput.value.trim()) {
      validateField(bookTitleInput, titleError, 'Book title');
    }
  });

  bookAuthorInput.addEventListener('blur', () => {
    if (!bookAuthorInput.value.trim()) {
      validateField(bookAuthorInput, authorError, 'Author');
    }
  });

  // Event Delegation for Card Actions (Change status & Delete)
  booksGrid.addEventListener('change', (e) => {
    const target = e.target;
    if (target.dataset.action === 'change-status') {
      const id = target.dataset.id;
      const newStatus = target.value;
      const book = books.find(b => b.id === id);
      if (book) {
        book.status = newStatus;
        saveBooks();
        renderBooks();
        showToast(`Status updated to "${newStatus}"`, 'success');
      }
    }
  });

  booksGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="delete"]');
    if (btn) {
      const id = btn.dataset.id;
      const bookToDelete = books.find(b => b.id === id);
      const title = bookToDelete ? bookToDelete.title : 'Book';
      books = books.filter(b => b.id !== id);
      saveBooks();
      renderBooks();
      showToast(`Removed "${title}"`, 'danger');
    }
  });

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentFilter = btn.dataset.filter;
      renderBooks();
    });
  });

  // Search input handler
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderBooks();
  });

  // Initial Render
  renderBooks();
});
