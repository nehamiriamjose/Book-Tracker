#  Book Tracker

A personal reading journal and library catalog inspired by independent bookstores and classic reading logs. Built with clean, accessible Vanilla HTML, CSS, and JavaScript.

---

##  Overview

**Book Tracker** provides a quiet space to chronicle your reading life. Whether you're curating a list of books to read, keeping track of your current reads, or archiving finished titles, Book Tracker offers a simple, elegant experience with instant responsiveness and local persistence.

---

##  Features

- **Intuitive Book Entry**: Log books with fields for **Book Title**, **Author**, and **Reading Status** (*To read*, *Reading*, *Finished*).
- **Inline Validation**: Enforces mandatory fields with clear error messages, accessible `aria-describedby` announcements, and automatic focus.
- **Real-Time Reading Ledger**: Live statistics counter tracking **Total Books**, **To Read**, **Reading**, and **Finished**.
- **Instant Search**: Search through your entire library in real time by book title or author name.
- **Status Filter Tabs**: Seamlessly toggle between *All*, *To read*, *Reading*, and *Finished* categories.
- **Card Actions**: Update a book's reading status on the fly with in-card dropdowns or delete titles with a single click.
- **Persistent Storage**: All books, edits, and deletions persist on your machine via the browser's `localStorage` — no database or account required.
- **Fully Responsive**: Adapts naturally to desktop, tablet, and mobile screens.

---

##  Design Aesthetics

- **Reading-Inspired Palette**: Soft cream and ivory background (`#fbf9f4`) reminiscent of fine book paper, accented with muted botanical sage green (`#3f6050`) and warm leather tones (`#8a5836`).
- **Natural Typography**: Paired Google Fonts — **Lora** (an elegant editorial serif for titles and headings) and **Plus Jakarta Sans** (clean, readable sans-serif for UI controls).
- **Restrained Styling**: Replaced neon gradients and heavy glows with crisp 1px borders, subtle paper shadows, and matte pastel status badges.

---

##  Project Structure

```text
book-tracker/
├── index.html        # Semantic HTML structure, form layout, and bookplate cards
├── style.css         # Custom CSS design system, typography, and responsive breakpoints
├── app.js            # Application logic, validation, DOM rendering, and localStorage management
├── PROMPTS.md        # Detailed prompt history, implementation logs, and bug fix summaries
└── README.md         # Comprehensive project documentation
```

---

##  Getting Started

No build tools, bundlers, or server dependencies are required.

### Run Locally

1. Clone or download this repository to your computer:
   ```bash
   git clone https://github.com/your-username/book-tracker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd book-tracker
   ```
3. Open `index.html` directly in any web browser:
   - **Double-click** `index.html` in your file explorer, OR
   - Run a lightweight local server if preferred:
     ```bash
     npx serve .
     # or with Python:
     python -m http.server 8000
     ```

---

##  How Data Persistence Works

All reading records are saved in your browser's **`localStorage`** under the key `book_tracker_books`.

Each book is stored as a structured JSON object:
```json
{
  "id": "book-1728925500000-abc123",
  "title": "The Remains of the Day",
  "author": "Kazuo Ishiguro",
  "status": "Reading",
  "createdAt": 1728925500000
}
```

### Inspecting Your Data
1. Press <kbd>F12</kbd> (or right-click and select **Inspect**) in your browser.
2. Navigate to the **Storage** tab (Firefox) or **Application** tab (Chrome / Edge / Safari).
3. Expand **Local Storage** in the left sidebar and select your origin to view and inspect all stored books in real time.

---

##  Testing

The codebase includes verification for:
- [x] Submitting books without page reloads.
- [x] Prepending newly added books to the top of the collection.
- [x] Rejecting empty or whitespace-only titles and authors with inline warnings.
- [x] Resetting input fields and setting status back to *"To read"* upon addition.
- [x] Recalculating reading ledger stats on additions, status updates, and deletions.
- [x] Preserving empty bookshelves across refreshes when all books are cleared.

---

##  License

This project is open source and available under the [MIT License](LICENSE).
