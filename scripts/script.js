// Fetch book list from the API
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
    bookList()
      .then((data) => {
        console.log("Books fetched from API:", data);
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
        <img src="${book.img}" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p>${book.genre}</p>
        <div>
          <button id="toggle" onclick="toggleBook(${index})">${book.read ? "Unread" : "Read"}</button>
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
  if (!personalBooks.some(book => book.title === bookToAdd.title)) { // Check if book is already in personalBooks
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
    genre: bookGenre, // Ensure genre matches API property
    img: bookImg,
  };

  BOOKs.push(newBook);
  renderBooks();
  saveData();
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
  renderBooks();
  saveData();
};

// Save data to localStorage
const saveData = () => {
  localStorage.setItem("books", JSON.stringify(BOOKs));
  localStorage.setItem("personalBooks", JSON.stringify(personalBooks)); // Make sure to save personalBooks
};

// Open/close form functions
const openForm = () => {
  document.getElementById("book-form-modal").style.display = "block";
};

const closeForm = () => {
  document.getElementById("book-form-modal").style.display = "none";
};

// Load personal books from localStorage
const loadPersonalBooks = () => {
  const savedPersonalBooks = JSON.parse(localStorage.getItem("personalBooks"));
  if (savedPersonalBooks && savedPersonalBooks.length) {
    personalBooks.push(...savedPersonalBooks);
  }
};

// Load data on page load
if (bookContent) {
  loadData();
}

// Log when the window loads
window.onload = () => {
  console.log("Window loaded, loading personal books...");
  loadPersonalBooks(); // Load personal books after loading data
};
