// all code runs inside here
document.addEventListener('DOMContentLoaded', () => {

  //grab all elements we need to manipulate
const input = document.getElementById('wordInput');
const result = document.getElementById('result');
const favList = document.getElementById('favList');
const themeBtn = document.getElementById('themeBtn');

// Load favorite words from localStorage. If none exist, use an empty array.
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// ----- Search -----
document.getElementById('searchForm').addEventListener('submit', event => {
  event.preventDefault();
  if (input.value.trim()) lookupWord(input.value.trim());
    result.innerHTML = '<p>Loading...</p>';

});

async function lookupWord(word) {
  try {
    const result= await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
    if (!result.ok) throw new Error('not found');
    const [entry] = await result.json();
    showResult(entry);
  } catch {
    result.innerHTML = `<p class="error">❌ "${word}" was not found. Net failure or Server failure.</p>`;
  }
}

// ----- Display definition -----
function showResult(entry) {
  const isFav = favorites.includes(entry.word);
  let html = `
    <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${entry.word}')">
      ${isFav ? '★ Saved' : '☆ Save'}
    </button>
    <h2>${entry.word}</h2> <em>${entry.phonetic || ''}</em>`;

  entry.meanings.forEach(m => {
    html += `<div class="pos">${m.partOfSpeech}</div><ol>`;
    m.definitions.slice(0, 3).forEach(d => {
      html += `<li>${d.definition}${d.example ? `<br><em>"${d.example}"</em>` : ''}</li>`;
    });
    html += `</ol>`;
    if (m.synonyms.length) {
      html += `<p class="synonyms">Synonyms: ${m.synonyms.slice(0, 5).join(', ')}</p>`;
    }
  });

  if (entry.sourceUrls?.length) {
    html += `<span class="source">Source: ${entry.sourceUrls[0]}</span>`;
  }
  result.innerHTML = html;
}

// ----- Favorites (saved in localStorage) -----
function toggleFavorite(word) {
  favorites = favorites.includes(word) ? favorites.filter(w => w !== word) : [...favorites, word];
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
  lookupWord(word);
}

function removeFavorite(word) {
  favorites = favorites.filter(w => w !== word);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

function renderFavorites() {
  favList.innerHTML = favorites.length
    ? favorites.map(word=> `<li><span style="cursor:pointer" onclick="lookupWord('${word}')">${word}</span>
        <button onclick="removeFavorite('${word}')">Remove</button></li>`).join('')
    : '<li>No favorites yet.</li>';
}

// ----- Theme toggle (JS updates CSS by adding/removing a class) -----
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeBtn.textContent = isDark ? ' Light Mode' : 'Dark Mode';
});

renderFavorites();
});