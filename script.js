document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('wordInput');
  const result = document.getElementById('result');
  const favList = document.getElementById('favList');
  const themeBtn = document.getElementById('themeBtn');

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  document.getElementById('searchForm').addEventListener('submit', event => {
    event.preventDefault();
    if (input.value.trim()) {
      result.innerHTML = '<p>Loading...</p>';
      lookupWord(input.value.trim());
    }
  });

  async function lookupWord(word) {
    try {
      const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
      if (!response.ok) throw new Error('not found');
      const [entry] = await response.json();
      showResult(entry);
    } catch {
      result.innerHTML = `<p class="error">❌ "${word}" was not found. Net failure or Server failure.</p>`;
    }
  }

  function showResult(entry) {
    const isFav = favorites.includes(entry.word);
    let html = `
      <button class="fav-btn ${isFav ? 'active' : ''}" data-word="${entry.word}" id="favToggleBtn">
        ${isFav ? '★ Saved' : '☆ Save'}
      </button>
      <h2>${entry.word}</h2> <em>${entry.phonetic || ''}</em>`;

    entry.meanings.forEach(m => {
      html += `<div class="pos">${m.partOfSpeech}</div><ol>`;
      m.definitions.slice(0, 3).forEach(d => {
        html += `<li>${d.definition}${d.example ? `<br><em>"${d.example}"</em>` : ''}</li>`;
      });
      html += `</ol>`;
      if (m.synonyms?.length) {
        html += `<p class="synonyms">Synonyms: ${m.synonyms.slice(0, 5).join(', ')}</p>`;
      }
    });

    if (entry.sourceUrls?.length) {
      html += `<span class="source">Source: ${entry.sourceUrls[0]}</span>`;
    }
    result.innerHTML = html;

    document.getElementById('favToggleBtn')
      .addEventListener('click', () => toggleFavorite(entry.word));
  }

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
      ? favorites.map(word => `<li><span style="cursor:pointer" data-word="${word}">${word}</span>
          <button data-word="${word}" class="removeBtn">Remove</button></li>`).join('')
      : '<li>No favorites yet.</li>';

    favList.querySelectorAll('span[data-word]').forEach(el =>
      el.addEventListener('click', () => lookupWord(el.dataset.word))
    );
    favList.querySelectorAll('.removeBtn').forEach(el =>
      el.addEventListener('click', () => removeFavorite(el.dataset.word))
    );
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  });

  renderFavorites();
});