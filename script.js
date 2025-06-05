// TAB MANAGEMENT
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-tab');
    if (!target) return;

    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.style.display = 'none');

    button.classList.add('active');
    const content = document.getElementById(target);
    if (content) content.style.display = 'block';
  });
});

function openSubTab(evt, subTabId) {
  const subtabs = document.querySelectorAll('.subtab-content');
  const buttons = document.querySelectorAll('.subtab-button');

  subtabs.forEach(tab => tab.style.display = 'none');
  buttons.forEach(btn => btn.classList.remove('active'));

  const targetSubtab = document.getElementById(subTabId);
  if (targetSubtab) targetSubtab.style.display = 'block';

  if (evt?.currentTarget) {
    evt.currentTarget.classList.add('active');
  }
}

// SPEECH RECOGNITION
function startRecognition() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = event => {
    const userSpeech = event.results[0][0].transcript.trim().toLowerCase();
    const expected = "hello, how are you?";
    const resultado = document.getElementById("resultado");
    const mensajeError = document.getElementById("mensajeError");
    const reintentar = document.getElementById("reintentar");

    resultado.innerHTML = "Dijiste: " + userSpeech;

    if (userSpeech === expected) {
      resultado.innerHTML += " ✅ ¡Correcto!";
      mensajeError.style.display = "none";
      reintentar.style.display = "none";
    } else {
      mensajeError.style.display = "block";
      reintentar.style.display = "block";
    }
  };

  recognition.onerror = event => {
    document.getElementById("resultado").innerHTML = "❗ Error al reconocer la voz: " + event.error;
  };

  recognition.start();
}

// AUDIO PRONUNCIATION
const sharedAudio = new Audio();

document.querySelectorAll('.play-word').forEach(word => {
  word.addEventListener('click', () => {
    const audioSrc = word.getAttribute('data-audio');
    if (!audioSrc) return;

    sharedAudio.src = audioSrc;
    sharedAudio.play();
  });
});

// MULTIPLE CHOICE ANSWERS
function checkAnswer(button, isCorrect) {
  const article = button.closest('article');
  const buttons = article.querySelectorAll('button:not(.retry-btn)');
  const retryButton = article.querySelector('.retry-btn');
  const messageId = article.querySelector('.message-result');

  buttons.forEach(btn => btn.disabled = true);

  if (isCorrect) {
    button.style.backgroundColor = '#4CAF50';
    messageId.textContent = '🎉 Great job!';
    retryButton.style.display = 'none';
  } else {
    button.style.backgroundColor = '#f44336';
    retryButton.style.display = 'inline-block';
  }
}

function resetCard(retryBtn) {
  const article = retryBtn.closest('article');
  const buttons = article.querySelectorAll('button:not(.retry-btn)');
  const messageId = article.querySelector('.message-result');

  buttons.forEach(btn => {
    btn.disabled = false;
    btn.style.backgroundColor = '';
  });

  retryBtn.style.display = 'none';
  if (messageId) messageId.textContent = '';
}

// DRAG & DROP ORDER
const correctSentence = ["I", "go", "to", "school", "every", "day"];
const initialOrder = ["go", "school", "I", "day", "to", "every"];

function setupDragWords() {
  const container = document.getElementById("dragContainer");
  const result = document.getElementById("dragResult");
  const retryBtn = document.getElementById("retryBtn");

  if (!container || !result || !retryBtn) return;

  result.textContent = "";
  retryBtn.style.display = "none";
  container.innerHTML = "";

  initialOrder.forEach((word, index) => {
    const btn = document.createElement("div");
    btn.className = "draggable";
    btn.textContent = word;
    btn.draggable = true;
    btn.id = `word-${index}`;

    btn.addEventListener("dragstart", dragStart);
    btn.addEventListener("dragover", dragOver);
    btn.addEventListener("drop", drop);

    container.appendChild(btn);
  });
}

let dragged;

function dragStart(e) {
  dragged = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const container = document.getElementById("dragContainer");

  if (e.target.classList.contains("draggable") && dragged !== e.target) {
    const draggedIndex = [...container.children].indexOf(dragged);
    const targetIndex = [...container.children].indexOf(e.target);

    if (draggedIndex < targetIndex) {
      container.insertBefore(dragged, e.target.nextSibling);
    } else {
      container.insertBefore(dragged, e.target);
    }
  }
}

function checkDragOrder() {
  const container = document.getElementById("dragContainer");
  const result = document.getElementById("dragResult");
  const retryBtn = document.getElementById("retryBtn");

  const userWords = [...container.children].map(el => el.textContent.trim());

  if (userWords.join(" ") === correctSentence.join(" ")) {
    result.textContent = "✅ Correct!";
    result.style.color = "green";
    retryBtn.style.display = "none";
  } else {
    result.textContent = "❌ Incorrect order. Try again!";
    result.style.color = "red";
    retryBtn.style.display = "inline-block";
  }
}

// RESET ALL IN SUBTAB
function resetAllInSubtab(subtabId) {
  const subtab = document.getElementById(subtabId);
  if (!subtab) return;

  const cards = subtab.querySelectorAll('article.activity-card');
  cards.forEach(card => {
    const buttons = card.querySelectorAll('button:not(.retry-btn)');
    const retryBtn = card.querySelector('.retry-btn');
    const message = card.querySelector('.message-result');

    buttons.forEach(btn => {
      btn.disabled = false;
      btn.style.backgroundColor = '';
    });

    if (retryBtn) retryBtn.style.display = 'none';
    if (message) message.textContent = '';
  });
}

// READING COMPREHENSION
function checkReadingAnswer(button, isCorrect) {
  const article = button.closest('article');
  const message = article.querySelector('.message-result');
  const retryBtn = article.querySelector('.retry-btn');

  const buttons = article.querySelectorAll('button:not(.retry-btn)');
  buttons.forEach(btn => btn.disabled = true);

  if (isCorrect) {
    message.textContent = '✅ Correct!';
    message.style.color = 'green';
    retryBtn.style.display = 'none';
  } else {
    message.textContent = '❌ Try again.';
    message.style.color = 'red';
    retryBtn.style.display = 'inline-block';
  }
}

function playReading(src) {
  sharedAudio.src = src;
  sharedAudio.play();
}

// INIT
window.onload = () => {
  setupDragWords();
};
