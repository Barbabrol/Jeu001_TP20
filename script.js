// ==================== script.js - 20 VERBES ====================
const verbs = [
  {base: "be", past: "was/were", pp: "been", fr: "être", mastery: 0},
  {base: "have", past: "had", pp: "had", fr: "avoir", mastery: 0},
  {base: "do", past: "did", pp: "done", fr: "faire", mastery: 0},
  {base: "go", past: "went", pp: "gone", fr: "aller", mastery: 0},
  {base: "say", past: "said", pp: "said", fr: "dire", mastery: 0},
  {base: "make", past: "made", pp: "made", fr: "faire", mastery: 0},
  {base: "take", past: "took", pp: "taken", fr: "prendre", mastery: 0},
  {base: "come", past: "came", pp: "come", fr: "venir", mastery: 0},
  {base: "see", past: "saw", pp: "seen", fr: "voir", mastery: 0},
  {base: "get", past: "got", pp: "got/gotten", fr: "obtenir", mastery: 0},
  {base: "know", past: "knew", pp: "known", fr: "savoir", mastery: 0},
  {base: "give", past: "gave", pp: "given", fr: "donner", mastery: 0},
  {base: "find", past: "found", pp: "found", fr: "trouver", mastery: 0},
  {base: "think", past: "thought", pp: "thought", fr: "penser", mastery: 0},
  {base: "tell", past: "told", pp: "told", fr: "dire", mastery: 0},
  {base: "become", past: "became", pp: "become", fr: "devenir", mastery: 0},
  {base: "show", past: "showed", pp: "shown", fr: "montrer", mastery: 0},
  {base: "leave", past: "left", pp: "left", fr: "partir", mastery: 0},
  {base: "feel", past: "felt", pp: "felt", fr: "ressentir", mastery: 0},
  {base: "put", past: "put", pp: "put", fr: "mettre", mastery: 0}
];

let currentScore = parseInt(localStorage.getItem('verbScore')) || 0;
let currentStreak = 0;
let currentVerb = null;
let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;

function saveData() {
  localStorage.setItem('verbsData', JSON.stringify(verbs));
  localStorage.setItem('verbScore', currentScore);
  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
    localStorage.setItem('bestStreak', bestStreak);
  }
}

function updateMastery(base, correct) {
  const verb = verbs.find(v => v.base === base);
  if (!verb) return;
  verb.mastery = correct ? Math.min(5, (verb.mastery || 0) + 1) : Math.max(0, (verb.mastery || 0) - 1);
  saveData();
}

function updateStats() {
  document.getElementById('totalScore').textContent = currentScore;
  document.getElementById('streak').textContent = currentStreak;
}

function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }
}

// ===================== LISTE =====================
function searchVerbs() {
  const term = document.getElementById('search').value.toLowerCase();
  const container = document.getElementById('listContent');
  container.innerHTML = '';

  const filtered = verbs.filter(v => 
    v.base.toLowerCase().includes(term) || v.fr.toLowerCase().includes(term)
  );

  filtered.forEach(v => {
    const div = document.createElement('div');
    div.className = 'verb-card';
    div.innerHTML = `
      <div>
        <strong>${v.base}</strong> → ${v.past} / ${v.pp}<br>
        <small>${v.fr}</small>
      </div>
      <span class="mastery">Maîtrise : ${v.mastery}/5</span>
      <button onclick="event.stopImmediatePropagation(); speakAll('${v.base}', '${v.past}', '${v.pp}')">🔊 3 formes</button>
    `;
    container.appendChild(div);
  });
}

function speakAll(base, past, pp) {
  speak(base);
  setTimeout(() => speak(past), 800);
  setTimeout(() => speak(pp), 1600);
}

// ===================== FLASHCARDS =====================
function showFlashcard() {
  currentVerb = verbs[Math.floor(Math.random() * verbs.length)];
  document.getElementById('flashcard').innerHTML = `
    <div class="card" onclick="this.classList.toggle('flipped')">
      <div class="card-inner">
        <div class="front">
          <h2>${currentVerb.base}</h2>
          <p>Clique pour retourner</p>
        </div>
        <div class="back">
          <h2>${currentVerb.past} / ${currentVerb.pp}</h2>
          <p>${currentVerb.fr}</p>
          <button onclick="event.stopImmediatePropagation(); speakAll('${currentVerb.base}', '${currentVerb.past}', '${currentVerb.pp}')">
            🔊 Prononcer les 3 formes
          </button>
        </div>
      </div>
    </div>
  `;
}

// ===================== QUIZ =====================
function startQuiz() {
  currentVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const correct = `${currentVerb.past} / ${currentVerb.pp}`;
  let options = [correct];
  while (options.length < 4) {
    const rand = verbs[Math.floor(Math.random() * verbs.length)];
    const wrong = `${rand.past} / ${rand.pp}`;
    if (!options.includes(wrong)) options.push(wrong);
  }
  options.sort(() => Math.random() - 0.5);

  let html = `<h3>${currentVerb.base} (${currentVerb.fr})</h3>`;
  options.forEach(opt => {
    html += `<button class="option" onclick="checkQuiz(this, '${opt}', '${correct}')">${opt}</button>`;
  });
  document.getElementById('quizContent').innerHTML = html;
}

function checkQuiz(btn, selected, correct) {
  const isCorrect = selected === correct;
  btn.style.background = isCorrect ? '#4ade80' : '#f87171';
  btn.style.color = 'white';

  updateMastery(currentVerb.base, isCorrect);
  if (isCorrect) {
    currentScore += 10;
    currentStreak++;
  } else {
    currentStreak = 0;
  }
  updateStats();
  saveData();
  setTimeout(startQuiz, 1400);
}

// ===================== QUIZ AUDIO =====================
function startAudioQuiz() {
  currentVerb = verbs[Math.floor(Math.random() * verbs.length)];
  speak(currentVerb.base);

  let html = `<h3>Quel verbe as-tu entendu ?</h3>
              <button onclick="speak('${currentVerb.base}')">🔊 Réécouter</button>
              <div id="audioOptions"></div>`;

  document.getElementById('audioQuizContent').innerHTML = html;
  const container = document.getElementById('audioOptions');

  let options = [currentVerb.base];
  while (options.length < 4) {
    const rand = verbs[Math.floor(Math.random() * verbs.length)].base;
    if (!options.includes(rand)) options.push(rand);
  }
  options.sort(() => Math.random() - 0.5);

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = opt;
    btn.onclick = () => {
      const correct = opt === currentVerb.base;
      btn.style.background = correct ? '#4ade80' : '#f87171';
      btn.style.color = 'white';
      updateMastery(currentVerb.base, correct);
      if (correct) { currentScore += 12; currentStreak++; } else { currentStreak = 0; }
      updateStats();
      saveData();
      setTimeout(startAudioQuiz, 1500);
    };
    container.appendChild(btn);
  });
}

// ===================== MATCHING (simple) =====================
function startMatching() {
  document.getElementById('matchingContent').innerHTML = `<p>🔄 Matching en développement...</p>`;
}

// ===================== STATS =====================
function showStats() {
  const total = verbs.length;
  const mastered = verbs.filter(v => (v.mastery || 0) >= 4).length;
  const avg = (verbs.reduce((s, v) => s + (v.mastery || 0), 0) / total).toFixed(1);

  document.getElementById('statsContent').innerHTML = `
    <p>Verbes maîtrisés : <strong>${mastered}/${total}</strong> (${Math.round(mastered/total*100)}%)</p>
    <div style="height:25px;background:#e2e8f0;border-radius:12px;overflow:hidden;margin:15px 0;">
      <div style="height:100%;width:${Math.round(mastered/total*100)}%;background:#2563eb;"></div>
    </div>
    <p>Niveau moyen : <strong>${avg}/5</strong></p>
    <p>Score total : <strong>${currentScore}</strong></p>
    <p>Meilleur streak : <strong>${bestStreak}</strong> 🔥</p>
  `;
}

// ===================== NAVIGATION =====================
function showSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section).classList.add('active');

  if (section === 'list') searchVerbs();
  if (section === 'flashcards') showFlashcard();
  if (section === 'quiz') startQuiz();
  if (section === 'audioquiz') startAudioQuiz();
  if (section === 'stats') showStats();
}

// ===================== INIT =====================
window.onload = () => {
  updateStats();
  showSection('list');
  document.getElementById('versionTitle').textContent = "Version 20 verbes";

  // Dark mode toggle
  document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeToggle').textContent = isDark ? '🌙' : '☀️';
  });
};