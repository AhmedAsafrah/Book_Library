const bookList = () => {
  console.log("Fetching book list from API...");
  return fetch("https://mocki.io/v1/443f4adf-3c7b-4187-bad1-0a83dc05c571")
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

// Global arrays to store books
const BOOKs = [];
const personalBooks = [];
let selectedFilter = "All"; // Single filter variable for simplicity

// Load data from localStorage or API
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

// Update the filter and render books accordingly
const updateFilter = (filter) => {
  console.log("Filter updated to:", filter);
  selectedFilter = filter;
  renderBooks(); // Re-render books based on the selected filter
};

// Add event listeners to the filter checkboxes
const filterCheckboxes = document.querySelectorAll(".filter");
filterCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    filterCheckboxes.forEach((cb) => (cb.checked = false)); // Uncheck all checkboxes
    event.target.checked = true; // Check the clicked checkbox
    updateFilter(event.target.value); // Update filter based on the selected checkbox
  });
});

// Render books based on the current filter
const renderBooks = () => {
  console.log("Rendering books with filter:", selectedFilter);
  bookContent.innerHTML = "";

  // Filter books based on selected filter using `genre`
  const filteredBooks = BOOKs.filter((book) => {
    return selectedFilter === "All" || book.genre === selectedFilter;
  });

  console.log("Filtered books:", filteredBooks);

  // Render filtered books
  filteredBooks.forEach((book, index) => {
    bookContent.insertAdjacentHTML(
      "beforeend",
      `
      <div class="book">
        <img src="${book.img}" alt="book" />
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p>${book.type}</p>
        <p>${book.genre}</p>
        <div>
          <button id="toggle" onclick="toggleBook(${index})">${
        book.read ? "Unread" : "Read"
      }</button>
          <button id="plus" onclick="addBookToPersonalLibrary(${index})">+</button>
          <button id="minus" onclick="removeBook(${index})">-</button>
        </div>
      </div>
      `
    );
  });
};

// Add a book to the personal library
const addBookToPersonalLibrary = (index) => {
  const bookToAdd = BOOKs[index]; // Get the book from the BOOKs array
  if (!personalBooks.some((book) => book.title === bookToAdd.title)) {
    // Check if book is already in personalBooks
    personalBooks.push(bookToAdd); // Add the book to the personalBooks array
    saveData(); // Save the updated personalBooks to localStorage
    alert(`${bookToAdd.title} has been added to your personal library!`);
  } else {
    alert(`${bookToAdd.title} is already in your personal library.`);
  }
};

// Add a new book to the book list
const addBook = () => {
  const bookTitle = document.getElementById("book-title").value;
  const bookAuthor = document.getElementById("book-author").value;
  const bookGenre = document.getElementById("book-type").value;
  const bookImg = document.getElementById("book-img").value;

  // Validate input fields
  if (!bookTitle || !bookAuthor || !bookGenre || !bookImg) {
    alert("Please fill out all fields before adding a book.");
    return;
  }
  const newBook = {
    title: bookTitle,
    author: bookAuthor,
    type: bookGenre,
    genre: bookGenre, // Ensure genre matches API property
    img: bookImg,
    read: false, // Default read status
  };

  BOOKs.push(newBook);
  saveData();
  renderBooks();
  closeForm();
};

// Toggle the read status of a book
const toggleBook = (index) => {
  console.log("Toggling read status for book at index:", index);
  BOOKs[index].read = !BOOKs[index].read;
  renderBooks();
  saveData();
};

// Remove a book from the list
const removeBook = (index) => {
  console.log("Removing book at index:", index);
  BOOKs.splice(index, 1);
  saveData();
  renderBooks();
};

// Save data to localStorage
const saveData = () => {
  localStorage.setItem("books", JSON.stringify(BOOKs));
  localStorage.setItem("personalBooks", JSON.stringify(personalBooks)); // Make sure to save personalBooks
};

// Open/close form functions
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

// Load personal books from localStorage
const loadPersonalBooks = () => {
  const savedBooks = JSON.parse(localStorage.getItem("personalBooks"));
  if (savedBooks && savedBooks.length) {
    personalBooks.push(...savedBooks);
    renderPersonalBooks();
  }
};

// Load data on page load
if (bookContent) {
  loadData();
}

// Log when the window loads
window.onload = () => {
  loadPersonalBooks();
  console.log("Window loaded, loading personal books...");
};
