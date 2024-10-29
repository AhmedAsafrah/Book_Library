const bookList = () => {
  return fetch("https://mocki.io/v1/443f4adf-3c7b-4187-bad1-0a83dc05c571").then(
    (response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("An error occurred: " + response.status);
      }
    }
  );
};

const BOOKs = [];
const personalBooks = [];

const loadData = () => {
  const savedBooks = JSON.parse(localStorage.getItem("books"));
  if (savedBooks && savedBooks.length) {
    BOOKs.push(...savedBooks);
    renderBooks();
  } else {
    bookList()
      .then((data) => {
        BOOKs.push(...data);
        renderBooks();
        saveData();
      })
      .catch((error) => {
        console.error("Failed to load data:", error);
      });
  }
};

const bookContent = document.getElementById("book-content");
const renderBooks = () => {
  bookContent.innerHTML = "";
  BOOKs.forEach((book, index) => {
    bookContent.insertAdjacentHTML(
      "beforeend",
      `
      <div class="book">
        <img src="${book.img}" alt="book" />
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p>${book.type}</p>
        <div>
          <button id="toggle" onclick="toggleBook(${index})">${
        book.read ? "Unread" : "Read"
      }</button>
          <button id="plus" onclick="addBookToPersonalLibrary(${index})">+</button>
          <button id="minus" onclick="removeBook(${index})">-</button
        </div>
      </div>
      `
    );
  });
};

const addBook = () => {
  const bookTitle = document.getElementById("book-title").value;
  const bookAuthor = document.getElementById("book-author").value;
  const bookGenre = document.getElementById("book-type").value;
  const bookImg = document.getElementById("book-img").value;

  const newBook = {
    title: bookTitle,
    author: bookAuthor,
    type: bookGenre,
    img: bookImg,
  };

  BOOKs.push(newBook);
  renderBooks();
  saveData();
  closeForm();
};

const removeBook = (index) => {
  BOOKs.splice(index, 1);
  saveData();
  renderBooks();
};

const toggleBook = (index) => {
  const book = BOOKs[index];
  book.read = !book.read;

  saveData();
  renderBooks();
};

const openForm = () => {
  document.getElementById("book-title").value = "";
  document.getElementById("book-author").value = "";
  document.getElementById("book-type").value = "";
  document.getElementById("book-img").value = "";

  const bookFormModal = document.getElementById("book-form-modal");
  bookFormModal.style.display = "block";
  document.body.style.overflow = "hidden";
};

const closeForm = () => {
  const bookFormModal = document.getElementById("book-form-modal");
  bookFormModal.style.display = "none";
  document.body.style.overflow = "auto";
};

/*********************************************** */

const personalContainer = document.getElementById("personal-library");

const renderPersonalBooks = () => {
  if (personalContainer) {
    personalContainer.innerHTML = "";
    personalBooks.forEach((book, index) => {
      personalContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="book">
          <img src="${book.img}" alt="book" />
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <p>${book.type}</p>
          <div>
            <button id="toggle" onclick="togglePersonalBook(${index})">${
          book.read ? "Unread" : "Read"
        }</button>
            <button id="minus" onclick="removePersonalBook(${index})">-</button
          </div>
        </div>
        `
      );
    });
  }
};

const addBookToPersonalLibrary = (index) => {
  const book = BOOKs[index];

  // Check for duplicate by looping through personalBooks
  for (let i = 0; i < personalBooks.length; i++) {
    if (personalBooks[i].title === book.title) {
      alert("Book already added to personal library");
      return;
    }
  }

  // Add the book if not a duplicate
  personalBooks.push(book);
  saveData();
  renderPersonalBooks();
};

const removePersonalBook = (index) => {
  if (index >= 0 && index < personalBooks.length) {
    personalBooks.splice(index, 1);
    saveData();
    renderPersonalBooks();
  } else {
    console.log("Invalid index:", index);
  }
};

const togglePersonalBook = (index) => {
  const book = personalBooks[index];
  book.read = !book.read;

  saveData();
  renderPersonalBooks();
};

const loadPersonalBooks = () => {
  const savedBooks = JSON.parse(localStorage.getItem("personalBooks"));
  if (savedBooks && savedBooks.length) {
    personalBooks.push(...savedBooks);
    renderPersonalBooks();
  }
};

const saveData = () => {
  localStorage.setItem("books", JSON.stringify(BOOKs));
  localStorage.setItem("personalBooks", JSON.stringify(personalBooks) || []);
};

if (bookContent) {
  loadData();
}

window.onload = () => {
  loadPersonalBooks();
};
