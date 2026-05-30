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

// Variables pour le module Matching
let selectedBaseItem = null;
let selectedFrItem = null;
let matchingPairsLeft = 0;

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
      <div style="display:flex; align-items:center; gap:12px;">
        <span class="mastery">Maîtrise : ${v.mastery || 0}/5</span>
        <button onclick="event.stopImmediatePropagation(); speakAll('${v.base}', '${v.past}', '${v.pp}')">🔊 Écouter</button>
      </div>
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
    <div class="card-inner" onclick="this.parentElement.classList.toggle('flipped')">
      <div class="front">
        <h2>${currentVerb.base}</h2>
        <p>Cliquez pour retourner la carte</p>
      </div>
      <div class="back">
        <h2>${currentVerb.past} / ${currentVerb.pp}</h2>
        <p>${currentVerb.fr}</p>
        <button class="btn-primary" onclick="event.stopImmediatePropagation(); speakAll('${currentVerb.base}', '${currentVerb.past}', '${currentVerb.pp}')">
          🔊 Prononcer les 3 formes
        </button>
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
  btn.style.background = isCorrect ? 'var(--success)' : 'var(--error)';
  btn.style.color = 'white';
  btn.style.borderColor = isCorrect ? 'var(--success)' : 'var(--error)';

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

  let html = `<h3 style="margin-bottom:10px;">Quel verbe entendez-vous ?</h3>
              <button class="btn-primary" style="margin-bottom:20px;" onclick="speak('${currentVerb.base}')">🔊 Réécouter</button>
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
      btn.style.background = correct ? 'var(--success)' : 'var(--error)';
      btn.style.color = 'white';
      btn.style.borderColor = correct ? 'var(--success)' : 'var(--error)';
      updateMastery(currentVerb.base, correct);
      if (correct) { currentScore += 12; currentStreak++; } else { currentStreak = 0; }
      updateStats();
      saveData();
      setTimeout(startAudioQuiz, 1500);
    };
    container.appendChild(btn);
  });
}

// ===================== MATCHING =====================
function startMatching() {
  selectedBaseItem = null;
  selectedFrItem = null;

  // Prendre 5 verbes aléatoires
  const shuffledVerbs = [...verbs].sort(() => Math.random() - 0.5);
  const selectedVerbs = shuffledVerbs.slice(0, 5);
  matchingPairsLeft = selectedVerbs.length;

  // Séparer et mélanger les listes (gauche et droite)
  const bases = selectedVerbs.map(v => ({ text: v.base, id: v.base }));
  const frs = selectedVerbs.map(v => ({ text: v.fr, id: v.base }));

  bases.sort(() => Math.random() - 0.5);
  frs.sort(() => Math.random() - 0.5);

  let html = `<div class="matching-board">
                <div class="matching-column" id="matchingBases"></div>
                <div class="matching-column" id="matchingFrs"></div>
              </div>`;
  
  document.getElementById('matchingContent').innerHTML = html;

  const basesCol = document.getElementById('matchingBases');
  const frsCol = document.getElementById('matchingFrs');

  // Injecter la colonne des Bases verbales
  bases.forEach(b => {
    const div = document.createElement('div');
    div.className = 'matching-item';
    div.textContent = b.text;
    div.dataset.id = b.id;
    div.onclick = () => selectMatchingItem(div, 'base');
    basesCol.appendChild(div);
  });

  // Injecter la colonne des traductions en Français
  frs.forEach(f => {
    const div = document.createElement('div');
    div.className = 'matching-item';
    div.textContent = f.text;
    div.dataset.id = f.id;
    div.onclick = () => selectMatchingItem(div, 'fr');
    frsCol.appendChild(div);
  });
}

function selectMatchingItem(element, type) {
  if (element.classList.contains('matched')) return;

  if (type === 'base') {
    if (selectedBaseItem) selectedBaseItem.classList.remove('selected');
    selectedBaseItem = element;
    selectedBaseItem.classList.add('selected');
  } else {
    if (selectedFrItem) selectedFrItem.classList.remove('selected');
    selectedFrItem = element;
    selectedFrItem.classList.add('selected');
  }

  // Vérification de la paire sélectionnée
  if (selectedBaseItem && selectedFrItem) {
    const baseId = selectedBaseItem.dataset.id;
    const frId = selectedFrItem.dataset.id;

    if (baseId === frId) {
      // Succès (Match correct)
      selectedBaseItem.className = 'matching-item matched';
      selectedFrItem.className = 'matching-item matched';
      
      updateMastery(baseId, true);
      currentScore += 5;
      currentStreak++;
      updateStats();
      
      selectedBaseItem = null;
      selectedFrItem = null;
      matchingPairsLeft--;

      // Fin de partie Matching
      if (matchingPairsLeft === 0) {
        setTimeout(() => {
          document.getElementById('matchingContent').innerHTML = `
            <div class="status-message">
              🎉 Félicitations ! Toutes les paires ont été correctement associées.<br>
              <strong>+25 points bonus de fin de série !</strong>
            </div>`;
          currentScore += 25;
          updateStats();
          saveData();
        }, 1000);
      }
    } else {
      // Erreur
      const item1 = selectedBaseItem;
      const item2 = selectedFrItem;
      
      item1.className = 'matching-item error';
      item2.className = 'matching-item error';
      
      updateMastery(baseId, false);
      currentStreak = 0;
      updateStats();
      
      selectedBaseItem = null;
      selectedFrItem = null;

      // Réinitialiser l'état visuel après l'erreur
      setTimeout(() => {
        if (item1.className.includes('error')) item1.className = 'matching-item';
        if (item2.className.includes('error')) item2.className = 'matching-item';
      }, 1000);
    }
    saveData();
  }
}

// ===================== STATS =====================
function showStats() {
  const total = verbs.length;
  const mastered = verbs.filter(v => (v.mastery || 0) >= 4).length;
  const percentage = Math.round(mastered/total*100);
  const avg = (verbs.reduce((s, v) => s + (v.mastery || 0), 0) / total).toFixed(1);

  document.getElementById('statsContent').innerHTML = `
    <p>Verbes maîtrisés (Niveau 4+) : <strong>${mastered}/${total}</strong> (${percentage}%)</p>
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentage}%;"></div>
    </div>
    <div class="stats-grid">
      <div class="stat-box"><span>Niveau moyen</span><strong>${avg} / 5</strong></div>
      <div class="stat-box"><span>Score global</span><strong>${currentScore}</strong></div>
      <div class="stat-box"><span>Meilleure série</span><strong>${bestStreak} 🔥</strong></div>
    </div>
  `;
}

// ===================== NAVIGATION =====================
function showSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section).classList.add('active');

  // Mettre à jour l'état actif sur les boutons de navigation
  document.querySelectorAll('nav button').forEach(btn => {
    btn.classList.remove('active');
    if(btn.getAttribute('onclick').includes(section)) {
      btn.classList.add('active');
    }
  });

  if (section === 'list') searchVerbs();
  if (section === 'flashcards') showFlashcard();
  if (section === 'quiz') startQuiz();
  if (section === 'matching') startMatching();
  if (section === 'audioquiz') startAudioQuiz();
  if (section === 'stats') showStats();
}

// ===================== INIT =====================
window.onload = () => {
  // Charger les données sauvegardées si existantes
  const savedVerbs = localStorage.getItem('verbsData');
  if (savedVerbs) {
    try {
      const parsed = JSON.parse(savedVerbs);
      parsed.forEach(sv => {
        const v = verbs.find(v => v.base === sv.base);
        if(v) v.mastery = sv.mastery;
      });
    } catch(e) { console.error("Erreur de chargement", e); }
  }

  updateStats();
  showSection('list');

  // Dark mode toggle
  document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeToggle').textContent = isDark ? '🌙' : '☀️';
  });
};