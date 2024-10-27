const bookContainer = document.querySelector(".container");
const books = [];
const defaultBook = {
  title: "",
  author: "",
  type: "",
  img: "",
};
const bookFormModal = document.getElementById("book-form-modal");
const addBookButton = document.getElementById("add-book-button");

const openForm = () => {
  document.getElementById("book-title").value = "";
  document.getElementById("book-author").value = "";
  document.getElementById("book-type").value = "";
  document.getElementById("book-img").value = "";

  bookFormModal.style.display = "block";
  document.body.style.overflow = "hidden";
};

const closeForm = () => {
  bookFormModal.style.display = "none";
  document.body.style.overflow = "auto";
};

const renderBook = (book = defaultBook) => {
  const bookHtml = `
        <div class="book">
            <img src="${book.img}" alt="book" />
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p>${book.type}</p>
            <div>
                <button id="toggle">Read</button>
                <button id="plus">+</button>
            </div>
        </div>
    `;
  bookContainer.innerHTML += bookHtml;
};

const addBook = () => {
  const title = document.getElementById("book-title").value;
  const author = document.getElementById("book-author").value;
  const type = document.getElementById("book-type").value;
  const img = document.getElementById("book-img").value;

  const newBook = { title, author, type, img };
  books.push(newBook);
  renderBook(newBook);
  closeForm();
};

addBookButton.onclick = addBook;

const addBookIcon = document.querySelector(".add-book");
addBookIcon.onclick = openForm;
