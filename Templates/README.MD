# Wordly Dictionary

## Overview

**Wordly Dictionary** is a simple and interactive web-based dictionary application that allows users to search for English words and instantly view their meanings, pronunciation, examples, and synonyms. The application uses the free Dictionary API to retrieve word definitions and provides additional features such as saving favorite words and switching between light and dark themes.

The project was developed using **HTML**, **CSS**, and **JavaScript**, making it lightweight, responsive, and easy to use without requiring any backend server.

---

## Features

 *Search for English words
 *View word definitions
 *Display phonetic pronunciation (when available)
 *Show example sentences
 *Display up to five synonyms
 *Save and remove favorite words
 *Store favorites using the browser's Local Storage
 *Toggle between Light Mode and Dark Mode
 *Display friendly error messages when a word cannot be found

---

## Technologies Used

*HTML5
*CSS3
*JavaScript (ES6)
*Dictionary API (https://dictionaryapi.dev)

---

## Project Structure

```
Wordly-Dictionary/
│
├── index.html      # Main webpage
├── style.css       # Application styling
├── script.js       # Application logic
└── README.md       # Project documentation
```

---

How the Application Works

 1. Searching for a Word

The user enters an English word into the search box and clicks the **Search** button or presses **Enter**. JavaScript captures the form submission and prevents the page from refreshing.

The application sends a request to the Dictionary API using the `fetch()` method. While waiting for the response, a **Loading...** message is displayed.

---

2. Displaying Results

When the API returns a successful response, the application displays:

* Word
* Pronunciation
* Part of speech
* Definitions
* Example sentences
* Synonyms
* Source URL

If the word does not exist, a user-friendly error message is displayed.

---

3. Favorite Words

Users can save words by clicking the **Save** button.

Saved words are stored in the browser using **Local Storage**, allowing them to remain available even after the browser is closed.

Users can:

* View saved words
* Click a saved word to search it again
* Remove saved words from the favorites list

---

4. Theme Toggle

The application includes a Dark Mode feature.

Clicking the **Dark Mode** button adds or removes the `dark` CSS class from the page, changing the application's appearance between light and dark themes.

---

## API Used

This project uses the free Dictionary API.

**API Endpoint**

```
https://api.dictionaryapi.dev/api/v2/entries/en/{word}
```

Example:

```
https://api.dictionaryapi.dev/api/v2/entries/en/computer
```

The API returns:

* Definitions
* Phonetics
* Meanings
* Examples
* Synonyms
* Source URLs

---

## How to Run the Project

1. Download or clone the repository.

```
git clone https://github.com/yourusername/wordly-dictionary.git
```

2. Open the project folder.

3. Open **index.html** in any modern web browser.

No installation or additional software is required.

---

## User Interface

The application consists of four main sections:

* Application title
* Search form
* Dictionary results
* Favorites list

The interface is intentionally simple to provide a clean and easy user experience.

---

## JavaScript Concepts Demonstrated

This project demonstrates several important JavaScript concepts, including:

* DOM Manipulation
* Event Listeners
* Functions
* Async/Await
* Fetch API
* Error Handling using Try/Catch
* Local Storage
* JSON Parsing
* Template Literals
* Array Methods (`map`, `filter`, `forEach`, `includes`, `slice`, and `join`)
* Conditional (Ternary) Operator
* Optional Chaining
* Dynamic HTML Rendering

---

## Future Improvements

Possible future enhancements include:

* Pronunciation audio playback
* Search history
* Recently searched words
* Word of the Day feature
* Multiple language support
* Offline dictionary support
* Search suggestions and autocomplete
* Responsive design improvements for mobile device

---

## Screenshots

Add screenshots of the application here.

Example:

```
screenshots/
│
├── home.png
├── search-result.png
├── favorites.png
└── dark-mode.png
```

---

## Author

**catherine kyalo**

Student | Web Developer

GitHub: https://github.com/cutecate

---

## License

This project is intended for educational purposes.

You are free to use, modify, and improve the project for learning and personal development.
