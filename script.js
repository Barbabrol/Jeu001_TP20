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

// Sauvegarde des verbes
function saveData() {
  localStorage.setItem('verbsData', JSON.stringify(verbs));
  localStorage.setItem('verbScore', currentScore);
  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
    localStorage.setItem('bestStreak', bestStreak);
  }
}

// Mise à jour de la maîtrise
function updateMastery(base, correct) {
  const verb = verbs.find(v => v.base === base);
  if (!verb) return;
  if (correct) {
    verb.mastery = Math.min(5, (verb.mastery || 0) + 1);
  } else {
    verb.mastery = Math.max(0, (verb.mastery || 0) - 1);
  }
  saveData();
}

// Mise à jour affichage score/streak
function updateStats() {
  document.getElementById('totalScore').textContent = currentScore;
  document.getElementById('streak').textContent = currentStreak;
}

// Prononciation
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
  }
}

// Recherche
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
      <strong>${v.base}</strong> → ${v.past} / ${v.pp}
      <span class="fr">(${v.fr})</span>
      <span class="mastery">Maîtrise : ${v.mastery}/5</span>
      <button onclick="event.stopImmediatePropagation(); speak('${v.base}')">🔊</button>
    `;
    container.appendChild(div);
  });
}

// Flashcards
function showFlashcard() {
  currentVerb = verbs[Math.floor(Math.random() * verbs.length)];
  document.getElementById('flashcard').innerHTML = `
    <div class="card" onclick="this.classList.toggle('flipped')">
      <div class="card-inner">
        <div class="front">
          <h2>${currentVerb.base}</h2>
          <p>Clique pour voir la réponse</p>
        </div>
        <div class="back">
          <h2>${currentVerb.past} / ${currentVerb.pp}</h2>
          <p>${currentVerb.fr}</p>
          <button onclick="event.stopImmediatePropagation(); speak('${currentVerb.base}')">🔊 Prononcer</button>
        </div>
      </div>
    </div>
  `;
}

// Quiz Multiple Choice
function startQuiz() {
  currentVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const correctAnswer = `${currentVerb.past} / ${currentVerb.pp}`;
  let options = [correctAnswer];

  while (options.length < 4) {
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    const wrong = `${randomVerb.past} / ${randomVerb.pp}`;
    if (!options.includes(wrong)) options.push(wrong);
  }
  options.sort(() => Math.random() - 0.5);

  let html = `<h3>${currentVerb.base} (${currentVerb.fr})</h3>`;
  options.forEach(opt => {
    html += `<button class="option" onclick="checkQuizAnswer(this, '${opt}', '${correctAnswer}')">${opt}</button>`;
  });

  document.getElementById('quizContent').innerHTML = html;
}

function checkQuizAnswer(btn, selected, correct) {
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

// Exercices à trous réalistes
const fillSentences = [
  {q: "Yesterday I ___ to school by bus.", a: "went", verb: "go"},
  {q: "She has ___ a beautiful song.", a: "sung", verb: "sing"}, // même si pas dans 20, on peut adapter
  {q: "We ___ a lot of fun last weekend.", a: "had", verb: "have"},
  {q: "He ___ me a wonderful present.", a: "gave", verb: "give"},
  {q: "I ___ my keys this morning.", a: "lost", verb: "lose"}, // adapté
  {q: "They ___ the match yesterday.", a: "won", verb: "win"}
];

function startFillExercise() {
  const item = fillSentences[Math.floor(Math.random() * fillSentences.length)];
  document.getElementById('fillContent').innerHTML = `
    <p><strong>${item.q}</strong></p>
    <input type="text" id="fillInput" placeholder="Ta réponse...">
    <button onclick="checkFill('${item.a}', '${item.verb}')">Vérifier</button>
    <p id="fillFeedback"></p>
  `;
}

function checkFill(correct, verbBase) {
  const input = document.getElementById('fillInput').value.trim().toLowerCase();
  const feedback = document.getElementById('fillFeedback');
  const isCorrect = input === correct.toLowerCase();

  if (isCorrect) {
    feedback.innerHTML = "✅ Excellent !";
    feedback.style.color = "#4ade80";
    currentScore += 15;
    currentStreak++;
  } else {
    feedback.innerHTML = `❌ C'était <strong>${correct}</strong>`;
    feedback.style.color = "#f87171";
    currentStreak = 0;
  }
  updateMastery(verbBase, isCorrect);
  updateStats();
  saveData();
}

// Matching (simplifié)
function startMatching() {
  // Version simple : 4 verbes à associer
  document.getElementById('matchingContent').innerHTML = `
    <p>Matching en cours de développement...</p>
    <p>Pour l'instant utilise les autres modes 😉</p>
    <button onclick="startMatching()">Nouvelle partie</button>
  `;
}

// Quiz Audio
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
      if (correct) {
        currentScore += 12;
        currentStreak++;
      } else {
        currentStreak = 0;
      }
      updateStats();
      saveData();
      setTimeout(startAudioQuiz, 1500);
    };
    container.appendChild(btn);
  });
}

// Afficher une section
function showSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section).classList.add('active');

  if (section === 'list') searchVerbs();
  if (section === 'flashcards') showFlashcard();
  if (section === 'quiz') startQuiz();
  if (section === 'fill') startFillExercise();
  if (section === 'audioquiz') startAudioQuiz();
  if (section === 'stats') showStats();
}

// Statistiques
function showStats() {
  const total = verbs.length;
  const mastered = verbs.filter(v => (v.mastery || 0) >= 4).length;
  const avg = (verbs.reduce((sum, v) => sum + (v.mastery || 0), 0) / total).toFixed(1);

  document.getElementById('statsContent').innerHTML = `
    <h3>Progression</h3>
    <p>Verbes maîtrisés : <strong>${mastered} / ${total}</strong> (${Math.round(mastered/total * 100)}%)</p>
    <div style="height:25px; background:#e2e8f0; border-radius:12px; overflow:hidden; margin:15px 0;">
      <div style="height:100%; width:${Math.round(mastered/total * 100)}%; background:#2563eb;"></div>
    </div>
    <p>Niveau moyen : <strong>${avg} / 5</strong></p>
    <p>Score total : <strong>${currentScore}</strong> points</p>
    <p>Meilleur streak : <strong>${bestStreak}</strong> 🔥</p>
  `;
}

// Initialisation
window.onload = () => {
  if (!localStorage.getItem('verbsData')) saveData();
  updateStats();
  showSection('list');
  document.getElementById('versionTitle').textContent = "20 verbes irréguliers les plus utilisés";
};