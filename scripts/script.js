const bookList = () => {
  console.log("Fetching book list from API...");
  return fetch("https://d508d3a3bab44aecb5fed0f178cf38ca.api.mockbin.io/")
    .then((response) => {
      if (response.ok) {
        console.log("Response received:", response);
        return response.json();
      } else {
        console.error("Fetch error:", response.status);
        throw new Error("An error occurred: " + response.status);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch book list:", error);
    });
};

const BOOKs = [];
const personalBooks = [];
let selectedFilter = "All";

const loadData = () => {
  console.log("Loading data...");
  const savedBooks = JSON.parse(localStorage.getItem("books"));
  if (savedBooks && savedBooks.length) {
    console.log("Loaded books from localStorage:", savedBooks);
    BOOKs.push(...savedBooks);
    renderBooks();
  } else {
    bookList().then((data) => {
      console.log("Books fetched from API:", data);
      BOOKs.push(...data);
      renderBooks();
      saveData();
    });
  }
};

const bookContent = document.getElementById("book-content");

const updateFilter = (filter) => {
  console.log("Filter updated to:", filter);
  selectedFilter = filter.toLowerCase(); // Normalize to lowercase
  renderBooks();
};

const filterCheckboxes = document.querySelectorAll(".filter");
filterCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    filterCheckboxes.forEach((cb) => (cb.checked = false));
    event.target.checked = true;
    updateFilter(event.target.value);
  });
});

const renderBooks = (booksToRender = BOOKs) => {
  console.log("Rendering books with filter:", selectedFilter);
  bookContent.innerHTML = "";

  const normalizedFilter = selectedFilter.toLowerCase();

  const filteredBooks = booksToRender.filter((book) => {
    return (
      normalizedFilter === "all" ||
      book.genre.toLowerCase() === normalizedFilter
    );
  });

  filteredBooks.forEach((book, displayIndex) => {
    const actualIndex = BOOKs.indexOf(book);
    bookContent.insertAdjacentHTML(
      "beforeend",
      `
      <div class="book">
        <img src="${book.img}" alt="book" />
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p>${book.genre}</p>
        <div>
          <button id="toggle" onclick="toggleBook(${actualIndex})">${
        book.read ? "Unread" : "Read"
      }</button>
          <button id="plus" onclick="addBookToPersonalLibrary(${actualIndex})">+</button>
          <button id="minus" onclick="removeBook(${actualIndex})">-</button>
        </div>
      </div>
      `
    );
  });
};

const search = () => {
  const searchField = document
    .getElementById("search-input")
    .value.toLowerCase();
  const searchedBooks = BOOKs.filter(
    (book) =>
      book.title.toLowerCase().includes(searchField) ||
      book.author.toLowerCase().includes(searchField)
  );

  renderBooks(searchedBooks);
};

const addBookToPersonalLibrary = (index) => {
  const bookToAdd = BOOKs[index];
  if (!personalBooks.some((book) => book.title === bookToAdd.title)) {
    personalBooks.push(bookToAdd);
    saveData();
    alert(`${bookToAdd.title} has been added to your personal library!`);
    renderPersonalBooks(); // Call this to update the UI
  } else {
    alert(`${bookToAdd.title} is already in your personal library.`);
  }
};

const addBook = () => {
  const bookTitle = document.getElementById("book-title").value;
  const bookAuthor = document.getElementById("book-author").value;
  const bookGenre = document.getElementById("book-type").value;
  const bookImg = document.getElementById("book-img").value;

  if (!bookTitle || !bookAuthor || !bookGenre || !bookImg) {
    alert("Please fill out all fields before adding a book.");
    return;
  }

  const newBook = {
    title: bookTitle,
    author: bookAuthor,
    genre: bookGenre.toLowerCase(), // Normalize genre to lowercase
    img: bookImg,
    read: false,
  };

  BOOKs.push(newBook);
  saveData();
  renderBooks();
  closeForm();
};

const toggleBook = (index) => {
  console.log("Toggling read status for book at index:", index);
  BOOKs[index].read = !BOOKs[index].read;
  renderBooks();
  saveData();
};

const removeBook = (index) => {
  if (index >= 0 && index < BOOKs.length) {
    console.log("Removing book at index:", index);
    BOOKs.splice(index, 1);
    saveData();
    renderBooks();
  } else {
    console.log("Invalid index:", index);
  }
};

const saveData = () => {
  localStorage.setItem("books", JSON.stringify(BOOKs));
  localStorage.setItem("personalBooks", JSON.stringify(personalBooks));
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
          <p>${book.genre}</p>
          <div>
            <button id="toggle" onclick="togglePersonalBook(${index})">${
          book.read ? "Unread" : "Read"
        }</button>
            <button id="minus" onclick="removePersonalBook(${index})">-</button>
          </div>
        </div>
        `
      );
    });
  } else {
    console.log("personalContainer not found!");
  }
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

if (bookContent) {
  loadData();
}

window.onload = () => {
  loadPersonalBooks();
};
