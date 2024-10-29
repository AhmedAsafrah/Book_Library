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

const loadData = () => {
  bookList()
    .then((data) => {
      data.forEach((book) => {
        BOOKs.push(book);
      });
      renderBooks();
    })
    .catch((error) => {
      console.error("Failed to load data:", error);
    });
};

const renderBooks = () => {
  const container = document.querySelector(".container");
  container.innerHTML = ""; // Clear the container
  BOOKs.forEach((book) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
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
  closeForm();
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

loadData();
