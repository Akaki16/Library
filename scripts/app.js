'use strict';

import { StateValue } from './toggle.js';

class Book {
    constructor(name, author, pages) {
        this.name = name;
        this.author = author;
        this.pages = pages;
    }
}

class UI {
    static showBookList(book, idx) {
        const bookList = document.querySelector('.book-list');
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div>
                <h2>${book.name}</h2>
            </div>
            <div>
                <h3>${book.author}</h3>
            </div>
            <div>
                <h4>${book.pages}</h4>
            </div>
            <div class="btn-area">
                <button class="toggle-btn" type="button">
                    Read
                </button>
                <button data-index=${idx} class="remove-btn" type="button">
                    Remove
                </button>
            </div>
        `;
        bookList.appendChild(bookCard);
    }

    static renderBooks() {
        const books = BookStore.getBooks();
        books.forEach((book, index) => {
            UI.showBookList(book, index);
        });
    }

    static removeBook(event) {
        let books = BookStore.getBooks();
        const element = event.target.classList;
        const target = event.target;
        const parent = target.parentElement.parentElement;
        if (element.contains('remove-btn')) {
            // remove from UI
            parent.remove();
            // remove from localStorage
            books.splice(target.dataset.index, 1);
            books = JSON.stringify(books);
            // update localStorage data
            localStorage.setItem('books', books);
        }
    }

    static toggleBookMode(e) {
        if (e.target.classList.contains('toggle-btn')) {
            if (e.target.innerText === 'Read') {
                e.target.innerText = 'Not read';
                e.target.style.backgroundColor = 'red';
            } else if (e.target.innerText === 'Not read') {
                e.target.innerText = 'Read';
                e.target.style.backgroundColor = 'rgb(95, 190, 170)';
            }
        }
    }

    static setAppBgColor(color) {
        document.body.style.backgroundColor = '#' + color;
        document.querySelector('.modal-content').style.backgroundColor = '#' + color;
    }

    static setAppTextColor(color) {
        document.body.style.color = '#' + color;
    }
    
    static displayAppBgColor() {
        const bgColor = StateValue.getBgColor();
        document.body.style.backgroundColor = '#' + bgColor;
        document.querySelector('.modal-content').style.backgroundColor = '#' + bgColor;
    }

    static displayAppTextColor() {
        const textColor = StateValue.getTextColor();
        document.body.style.color = '#' + textColor;
    }

    static closeModal() {
        // close adding book modal
        document.querySelector('.close-modal1').addEventListener('click', () => {
            Modal.close('modal1');
        });

        document.getElementById('close-modal1').addEventListener('click', () => {
            Modal.close('modal1');
        });

        document.addEventListener('keydown', e => {
            const key = e.code;
            if (key === 'Escape') {
                Modal.close('modal1');
                Modal.close('modal2');
            }
        });
    }

    static showMessage(selector, text, color) {
        document.getElementById(selector).textContent = text;
        document.getElementById(selector).style.color = color;
    }

    static clearFields() {
        document.getElementById('book_name').value = '';
        document.getElementById('book_author').value = '';
        document.getElementById('book_pages').value = '';
    }
}

class Modal {
    static open(selector) {
        document.getElementById(selector).style.display = 'block';
    }

    static close(selector) {
        document.getElementById(selector).style.display = 'none';
    }
}

class BookStore {
    static getBooks() {
        let books;
        if (!localStorage.getItem('books')) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(bookObj) {
        const books = BookStore.getBooks();
        books.push(bookObj);
        // add books array to a localStorage (convert to JSON)
        localStorage.setItem('books', JSON.stringify(books));
    }

    static searchBook() {
        const books = BookStore.getBooks();
        const userInput = document.getElementById('search_book').value;
        let words = userInput.split(' ');
        words = words.join('');
        books.forEach((book) => {
            let searchedBookName = book.name.toLowerCase();
            if (words === searchedBookName) {
                // open book modal after 3 milliseconds
                setTimeout(() => {
                    Modal.open('modal2');
                }, 300);
                // update modal
                document.querySelector('.book-title').textContent = `Title: ${book.name}`;
                document.querySelector('.book-author').textContent = `Author: ${book.author}`;
                document.querySelector('.book-pages').textContent = `Pages: ${book.pages}`;
            }
        });
    }
}

// open adding book modal
document.querySelector('.add-book').addEventListener('click', () => {
    Modal.open('modal1');
});

// close book modal
document.querySelector('.close-modal2').addEventListener('click', () => {
    Modal.close('modal2');
});

// close modals when user presses Escape key
UI.closeModal();

// add books
document.getElementById('add-form').addEventListener('submit', e => {
    e.preventDefault();

    const bookName = document.getElementById('book_name');
    const bookAuthor = document.getElementById('book_author');
    const bookPages = document.getElementById('book_pages');

    // validate fields
    if (bookName.value === '') {
        UI.showMessage('msg1', 'This field is required', 'red');
    } else {
        UI.showMessage('msg1', 'This field is required', 'green');
    }
    if (bookAuthor.value === '') {
        UI.showMessage('msg2', 'This field is required', 'red');
    } else {
        UI.showMessage('msg2', 'This field is required', 'green');
    }
    if (bookPages.value === '') {
        UI.showMessage('msg3', 'This field is required', 'red');
    } else {
        UI.showMessage('msg3', 'This field is required', 'green');
    }

    // check all fields
    if (bookName.value && bookAuthor.value && bookPages.value) {
        UI.showMessage('msg1', '', '');
        UI.showMessage('msg2', '', '');
        UI.showMessage('msg3', '', '');

        const book = new Book(
            bookName.value.split(' ').join(''),
            bookAuthor.value.split(' ').join(''),
            bookPages.value.split(' ').join(''),
        );

        // show book list
        UI.showBookList(book);

        // add book to book store
        BookStore.addBook(book);

        UI.clearFields();

        // small delay before closing the modal
        setTimeout(() => {
            Modal.close('modal1');
        }, 300);
    }

});

// remove books
document.querySelector('.book-list').addEventListener('click', event => {
    UI.removeBook(event);
});

// toggle read/not read mod
document.querySelector('.book-list').addEventListener('click', e => {
    UI.toggleBookMode(e);
});

// search books
document.querySelector('.search-book').addEventListener('click', () => {
    BookStore.searchBook();
});

document.addEventListener('DOMContentLoaded', () => {
    UI.displayAppBgColor();
    UI.displayAppTextColor();
    UI.renderBooks();
});

export { UI };