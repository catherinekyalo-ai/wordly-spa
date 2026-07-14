// ===== Wordly SPA — dictionary lookup logic =====

const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const STORAGE_KEY = "wordly:savedWords";

const form = document.getElementById("searchForm");
const input = document.getElementById("wordInput");
const statusLine = document.getElementById("statusLine");
const resultArea = document.getElementById("resultArea");
const entryNumberEl = document.querySelector(".entry-number");
const savedList = document.getElementById("savedList");
const savedCount = document.getElementById("savedCount");
const themeBtn = document.getElementById("themeBtn");

let lookupCount = 0;
let savedWords = loadSavedWords();

// ===== Init =====
renderSavedList();
applyStoredTheme();

// ===== Search form =====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const word = input.value.trim();
  if (!word) return;
  lookupWord(word);
});

// ===== Theme toggle =====
themeBtn.addEventListener("click", () => {
  const isNight = document.documentElement.getAttribute("data-theme") === "night";
  setTheme(isNight ? "day" : "night");
});

function applyStoredTheme() {
  const stored = localStorage.getItem("wordly:theme");
  if (stored === "night") setTheme("night");
}

function setTheme(mode) {
  if (mode === "night") {
    document.documentElement.setAttribute("data-theme", "night");
    themeBtn.textContent = "Day reading";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeBtn.textContent = "Night reading";
  }
  localStorage.setItem("wordly:theme", mode);
}

// ===== Core lookup =====
async function lookupWord(word) {
  setStatus(`Looking up “${word}”…`, false);
  resultArea.innerHTML = `<div class="blank-page"><p class="blank-sub">Fetching entry…</p></div>`;

  try {
    const res = await fetch(API_BASE + encodeURIComponent(word));

    if (!res.ok) {
      if (res.status === 404) {
        showError(word, "No entry found for this word. Check the spelling, or try a related term.");
      } else {
        showError(word, `The dictionary service returned an error (status ${res.status}).`);
      }
      setStatus(`No result for “${word}”.`, true);
      return;
    }

    const data = await res.json();
    lookupCount += 1;
    entryNumberEl.textContent = String(lookupCount).padStart(2, "0");
    renderEntry(data[0]);
    setStatus(`Showing entry for “${word}”.`, false);
  } catch (err) {
    showError(word, "Couldn't reach the dictionary service. Check your connection and try again.");
    setStatus("Network error during lookup.", true);
  }
}

function setStatus(message, isError) {
  statusLine.textContent = message;
  statusLine.parentElement.classList.toggle("is-error", Boolean(isError));
}

function showError(word, message) {
  resultArea.innerHTML = `
    <div class="error-card">
      <h3>“${escapeHtml(word)}” — not found</h3>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

// ===== Render an entry =====
function renderEntry(entry) {
  const word = entry.word;
  const phonetic = entry.phonetic || (entry.phonetics.find(p => p.text)?.text ?? "");
  const audioSrc = entry.phonetics.find(p => p.audio)?.audio || "";
  const isSaved = savedWords.includes(word.toLowerCase());

  const posBlocks = entry.meanings.map(meaning => {
    const defs = meaning.definitions.slice(0, 3).map(d => `
      <li class="def-item">
        ${escapeHtml(d.definition)}
        ${d.example ? `<span class="def-example">${escapeHtml(d.example)}</span>` : ""}
      </li>
    `).join("");

    const synonyms = meaning.synonyms && meaning.synonyms.length
      ? `<p class="syn-line"><strong>Synonyms:</strong> ${meaning.synonyms.slice(0, 6).map(escapeHtml).join(", ")}</p>`
      : "";

    return `
      <div class="pos-block">
        <span class="pos-label">${escapeHtml(meaning.partOfSpeech)}</span>
        <ol class="def-list">${defs}</ol>
        ${synonyms}
      </div>
    `;
  }).join("");

  const sourceUrl = entry.sourceUrls && entry.sourceUrls[0] ? entry.sourceUrls[0] : "";

  resultArea.innerHTML = `
    <article class="entry">
      <div class="entry-head">
        <h2 class="entry-word">${escapeHtml(word)}</h2>
        ${phonetic ? `<span class="entry-phonetic">${escapeHtml(phonetic)}</span>` : ""}
        ${audioSrc ? `<button type="button" class="entry-audio" data-audio="${audioSrc}" aria-label="Play pronunciation">▶ listen</button>` : ""}
        <button type="button" class="save-star ${isSaved ? "is-saved" : ""}" data-word="${escapeHtml(word)}">
          ${isSaved ? "★ saved" : "☆ save word"}
        </button>
      </div>
      ${posBlocks}
      ${sourceUrl ? `<p class="entry-source">Source: <a href="${sourceUrl}" target="_blank" rel="noopener">${sourceUrl}</a></p>` : ""}
    </article>
  `;

  const audioBtn = resultArea.querySelector(".entry-audio");
  if (audioBtn) {
    audioBtn.addEventListener("click", () => {
      const audio = new Audio(audioBtn.dataset.audio);
      audio.play().catch(() => {});
    });
  }

  const starBtn = resultArea.querySelector(".save-star");
  starBtn.addEventListener("click", () => toggleSave(word, starBtn));
}

// ===== Saved words (localStorage) =====
function loadSavedWords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistSavedWords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedWords));
}

function toggleSave(word, starBtn) {
  const key = word.toLowerCase();
  const idx = savedWords.indexOf(key);

  if (idx === -1) {
    savedWords.push(key);
    starBtn.textContent = "★ saved";
    starBtn.classList.add("is-saved");
  } else {
    savedWords.splice(idx, 1);
    starBtn.textContent = "☆ save word";
    starBtn.classList.remove("is-saved");
  }

  persistSavedWords();
  renderSavedList();
}

function renderSavedList() {
  savedCount.textContent = String(savedWords.length);

  if (savedWords.length === 0) {
    savedList.innerHTML = `<li class="saved-empty">No words saved yet. Star an entry to keep it here.</li>`;
    return;
  }

  savedList.innerHTML = savedWords.map(word => `
    <li class="saved-item">
      <button type="button" class="saved-word-btn" data-word="${escapeHtml(word)}">${escapeHtml(word)}</button>
      <button type="button" class="saved-remove" data-word="${escapeHtml(word)}" aria-label="Remove ${escapeHtml(word)}">✕</button>
    </li>
  `).join("");

  savedList.querySelectorAll(".saved-word-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      input.value = btn.dataset.word;
      lookupWord(btn.dataset.word);
    });
  });

  savedList.querySelectorAll(".saved-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.word.toLowerCase();
      savedWords = savedWords.filter(w => w !== key);
      persistSavedWords();
      renderSavedList();
      // Update star state on current entry if it matches
      const currentStar = resultArea.querySelector(".save-star");
      if (currentStar && currentStar.dataset.word.toLowerCase() === key) {
        currentStar.textContent = "☆ save word";
        currentStar.classList.remove("is-saved");
      }
    });
  });
}

// ===== Utility =====
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}