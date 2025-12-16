/* script.js - V3.1 最终版：学习模式自动播放语音 */

// ================================
// 配置常量
// ================================
const CONFIG = {
  CELEBRATION_THRESHOLD: 10,
  AUTO_NEXT_DELAY: 2000,
  GIVEUP_DELAY: 4000,
  SPEECH_RATE: 0.8,
  STORAGE_WARNING_SIZE: 4 * 1024 * 1024,
  AUTO_SPEECH_DELAY: 300  // 🔥 新增：自动播放延迟(ms)
};

// ================================
// 0. 初始化 & 词库加载
// ================================
const currentBookId = localStorage.getItem("current_book");
if (!currentBookId) {
  alert("请先选择一本单词书 🐹");
  window.location.href = "books.html";
}

const rawBookData = localStorage.getItem("wordbook_" + currentBookId);
let bookData = null;
try {
  bookData = JSON.parse(rawBookData);
} catch (error) {
  console.error("词库解析失败:", error);
  alert("词库损坏，请重新导入 🤕");
  window.location.href = "books.html";
}

if (!bookData || !Array.isArray(bookData.words) || bookData.words.length === 0) {
  alert("词库无效 🤕");
  window.location.href = "books.html";
}

const wordList = bookData.words;

// ================================
// 1. 进度管理
// ================================
const PROGRESS_KEY = "hamster_progress_v3_" + currentBookId;

function loadProgress() {
  const saved = localStorage.getItem(PROGRESS_KEY);
  if (saved) {
    try {
      const unlearnedWords = JSON.parse(saved);
      if (Array.isArray(unlearnedWords) && unlearnedWords.length > 0) {
        return unlearnedWords.filter(word => 
          wordList.some(w => w.word === word)
        );
      }
    } catch (error) {
      console.warn('进度数据解析失败:', error);
    }
  }
  
  return wordList.map(w => w.word);
}

function saveProgress() {
  try {
    const data = JSON.stringify(appState.unlearnedWords);
    if (data.length > CONFIG.STORAGE_WARNING_SIZE) {
      console.warn('进度数据接近存储限制');
    }
    localStorage.setItem(PROGRESS_KEY, data);
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('存储空间不足 🐹');
    }
    console.error('保存进度失败:', e);
  }
}

function getWordIndex(wordText) {
  return wordList.findIndex(w => w.word === wordText);
}

// ================================
// 2. 状态管理
// ================================
const appState = {
  unlearnedWords: loadProgress(),
  examDeck: [],
  currentWordIndex: 0,
  browsingIndex: 0,
  isExamMode: false,
  isSpeaking: false,
  consecutiveCorrectCount: 0
};

let autoNextTimer = null;
let autoSpeechTimer = null; // 🔥 新增：自动播放定时器

// ================================
// 3. DOM 元素获取与验证
// ================================
const DOM = {
  currentWordEl: document.getElementById('current-word'),
  definitionSectionEl: document.getElementById('definition-section'),
  chineseDefinitionEl: document.getElementById('chinese-definition'),
  exampleSentenceEl: document.getElementById('example-sentence'),
  exampleBox: document.getElementById('example-box'),
  phoneticsEl: document.getElementById('phonetics'),
  modeToggleBtn: document.getElementById('mode-toggle-btn'),
  modeText: document.getElementById('mode-text'),
  progressInfoEl: document.getElementById('progress-info'),
  playAudioBtn: document.getElementById('play-audio-btn'),
  celebrationOverlay: document.getElementById('celebration-overlay'),
  typingSection: document.getElementById('typing-section'),
  slotsContainer: document.getElementById('slots-container'),
  examInput: document.getElementById('exam-input'),
  showHideBtn: document.getElementById('show-hide-btn'),
  checkBtn: document.getElementById('check-btn'),
  feedbackMessage: document.getElementById('feedback-message'),
  learningControls: document.getElementById('learning-controls'),
  resetBtn: document.getElementById('reset-btn'),
  flashcardNav: document.getElementById('flashcard-nav'),
  prevBtn: document.getElementById('prev-btn'),
  nextBtn: document.getElementById('next-btn')
};

(function validateDOM() {
  const missing = Object.entries(DOM).filter(([key, el]) => !el).map(([key]) => key);
  if (missing.length > 0) {
    console.error('缺少必需DOM元素:', missing);
  }
})();

const h1 = document.querySelector('h1');
if (h1) h1.textContent = `🐹 ${bookData.name}`;

// ================================
// 4. 发音功能
// ================================
let voicesLoaded = false;

function initSpeech() {
  if (!('speechSynthesis' in window)) {
    console.warn('浏览器不支持语音合成');
    return;
  }
  
  const loadVoices = () => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0 && !voicesLoaded) {
      voicesLoaded = true;
      console.log('语音引擎已就绪');
    }
  };
  
  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

// 🔥 修改：添加autoPlay参数，支持自动播放
function playAudio(autoPlay = false) {
  if (!('speechSynthesis' in window)) {
    if (!autoPlay) { // 手动点击时才提示
      showToast('当前浏览器不支持语音播放 🔇');
    }
    return;
  }
  
  if (appState.isSpeaking) return;
  
  const word = wordList[appState.currentWordIndex]?.word;
  if (!word) return;
  
  DOM.playAudioBtn.classList.add('playing');
  
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = CONFIG.SPEECH_RATE;
  
  const voices = speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith('en'));
  if (enVoice) utterance.voice = enVoice;
  
  utterance.onstart = () => appState.isSpeaking = true;
  utterance.onend = () => {
    appState.isSpeaking = false;
    DOM.playAudioBtn.classList.remove('playing');
  };
  utterance.onerror = (e) => {
    appState.isSpeaking = false;
    DOM.playAudioBtn.classList.remove('playing');
    console.error('语音播放失败:', e);
    if (!autoPlay) { // 手动点击时才提示错误
      showToast('语音播放失败，请检查音量设置 🔇');
    }
  };
  
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ================================
// 5. UI状态管理
// ================================
function updateUIVisibility(config) {
  if (config.showWord) {
    DOM.currentWordEl.style.display = 'block';
  } else {
    DOM.currentWordEl.style.display = 'none';
    DOM.currentWordEl.textContent = '';
  }
  
  DOM.phoneticsEl.style.visibility = config.showPhonetics ? 'visible' : 'hidden';
  DOM.playAudioBtn.style.visibility = config.showAudio ? 'visible' : 'hidden';
  DOM.exampleBox.classList.toggle('hidden', !config.showExample);
  DOM.definitionSectionEl.classList.toggle('hidden', !config.showDefinition);
  DOM.slotsContainer.classList.toggle('hidden', !config.showSlots);
  
  if (config.wordClass !== undefined) {
    if (config.wordClass === 'study') {
      DOM.currentWordEl.classList.add('study-word-display');
    } else {
      DOM.currentWordEl.classList.remove('study-word-display');
    }
  }
}

// ================================
// 6. 模式切换
// ================================
function toggleMode() {
  appState.isExamMode = !appState.isExamMode;
  DOM.feedbackMessage.textContent = '';
  appState.consecutiveCorrectCount = 0;
  clearTimeout(autoNextTimer);
  clearTimeout(autoSpeechTimer); // 🔥 清理自动播放定时器
  
  if (appState.isExamMode) {
    DOM.modeToggleBtn.classList.replace('study-active', 'exam-active');
    DOM.modeText.textContent = "📝 考试模式";
    DOM.typingSection.classList.remove('hidden');
    DOM.flashcardNav.classList.add('hidden');
    DOM.learningControls.classList.add('hidden');
    loadExamWord();
  } else {
    DOM.modeToggleBtn.classList.replace('exam-active', 'study-active');
    DOM.modeText.textContent = "📚 学习模式";
    DOM.typingSection.classList.add('hidden');
    DOM.learningControls.classList.add('hidden');
    DOM.resetBtn.classList.add('hidden');
    DOM.flashcardNav.classList.remove('hidden');
    loadFlashcard();
  }
}

// ================================
// 7. 学习模式逻辑 (🔥 添加自动播放)
// ================================
function loadFlashcard() {
  if (appState.browsingIndex < 0) appState.browsingIndex = 0;
  if (appState.browsingIndex >= wordList.length) appState.browsingIndex = wordList.length - 1;
  
  appState.currentWordIndex = appState.browsingIndex;
  const word = wordList[appState.currentWordIndex];
  
  DOM.progressInfoEl.textContent = `🐹 卡片: ${appState.browsingIndex + 1} / ${wordList.length}`;
  
  updateUIVisibility({
    showWord: true,
    showPhonetics: true,
    showAudio: true,
    showExample: true,
    showDefinition: true,
    showSlots: false,
    wordClass: 'study'
  });
  
  DOM.currentWordEl.textContent = word.word;
  DOM.phoneticsEl.textContent = word.phonetics || '/ ... /';
  DOM.chineseDefinitionEl.textContent = word.chinese;
  DOM.exampleSentenceEl.textContent = word.example || '';
  
  DOM.prevBtn.disabled = (appState.browsingIndex === 0);
  DOM.nextBtn.disabled = (appState.browsingIndex === wordList.length - 1);
  
  // 🔥 新增：自动播放语音
  clearTimeout(autoSpeechTimer);
  autoSpeechTimer = setTimeout(() => {
    playAudio(true); // 传入true表示自动播放
  }, CONFIG.AUTO_SPEECH_DELAY);
}

function prevCard() {
  if (appState.browsingIndex > 0) {
    appState.browsingIndex--;
    loadFlashcard();
  }
}

function nextCard() {
  if (appState.browsingIndex < wordList.length - 1) {
    appState.browsingIndex++;
    loadFlashcard();
  }
}

// ================================
// 8. 考试模式逻辑
// ================================
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function refreshExamDeck() {
  appState.examDeck = shuffleArray(appState.unlearnedWords);
  console.log('考试队列已刷新，剩余:', appState.examDeck.length);
}

function pickNextExamWord() {
  if (appState.examDeck.length === 0) {
    refreshExamDeck();
  }
  
  const wordText = appState.examDeck.shift();
  return getWordIndex(wordText);
}

function loadExamWord() {
  if (appState.unlearnedWords.length === 0) {
    finishLearning();
    return;
  }
  
  clearTimeout(autoNextTimer);
  clearTimeout(autoSpeechTimer); // 🔥 考试模式清理自动播放
  appState.currentWordIndex = pickNextExamWord();
  const word = wordList[appState.currentWordIndex];
  
  const learnedCount = wordList.length - appState.unlearnedWords.length;
  DOM.progressInfoEl.textContent = `🐹 进度: ${learnedCount + 1} / ${wordList.length}`;
  
  DOM.feedbackMessage.textContent = '';
  DOM.examInput.value = '';
  
  updateUIVisibility({
    showWord: false,
    showPhonetics: false,
    showAudio: false,
    showExample: false,
    showDefinition: true,
    showSlots: true,
    wordClass: null
  });
  
  DOM.chineseDefinitionEl.textContent = word.chinese;
  DOM.exampleSentenceEl.textContent = word.example || '';
  DOM.showHideBtn.textContent = "🔑 看答案";
  DOM.learningControls.classList.add('hidden');
  
  renderSlots();
  setTimeout(() => DOM.examInput.focus(), 50);
}

function renderSlots() {
  const input = DOM.examInput;
  DOM.slotsContainer.innerHTML = '';
  DOM.slotsContainer.appendChild(input);
  
  for (const ch of wordList[appState.currentWordIndex].word) {
    const span = document.createElement('span');
    span.className = ch === ' ' ? 'space-slot' : 'char-slot';
    DOM.slotsContainer.appendChild(span);
  }
}

function updateSlotsUI(val) {
  const slots = DOM.slotsContainer.querySelectorAll('.char-slot');
  const displayVal = val.replace(/\s+/g, '');
  slots.forEach((s, i) => s.textContent = displayVal[i] || '');
}

function checkTyping() {
  if (!appState.isExamMode) return;
  
  const correct = wordList[appState.currentWordIndex].word.toLowerCase().replace(/\s+/g, '');
  const user = DOM.examInput.value.toLowerCase().replace(/\s+/g, '');
  
  if (user === correct) {
    DOM.feedbackMessage.textContent = "✨ 答对啦！";
    playAudio();
    
    appState.consecutiveCorrectCount++;
    if (appState.consecutiveCorrectCount === CONFIG.CELEBRATION_THRESHOLD) {
      triggerCelebration();
      appState.consecutiveCorrectCount = 0;
    }
    
    clearTimeout(autoNextTimer);
    autoNextTimer = setTimeout(handleKnow, CONFIG.AUTO_NEXT_DELAY);
  } else {
    DOM.feedbackMessage.textContent = "💨 不对哦，再试一次！";
    DOM.examInput.focus();
    appState.consecutiveCorrectCount = 0;
  }
}

function giveUpInExamMode() {
  const word = wordList[appState.currentWordIndex];
  
  updateUIVisibility({
    showWord: true,
    showPhonetics: true,
    showAudio: true,
    showExample: false,
    showDefinition: true,
    showSlots: false
  });
  
  DOM.currentWordEl.textContent = word.word;
  DOM.phoneticsEl.textContent = word.phonetics || '/ ... /';
  DOM.feedbackMessage.textContent = "📖 看一下答案，下次一定行！";
  appState.consecutiveCorrectCount = 0;
  
  playAudio();
  
  clearTimeout(autoNextTimer);
  autoNextTimer = setTimeout(handleDontKnow, CONFIG.GIVEUP_DELAY);
}

function handleKnow() {
  const currentWord = wordList[appState.currentWordIndex].word;
  appState.unlearnedWords = appState.unlearnedWords.filter(w => w !== currentWord);
  appState.examDeck = appState.examDeck.filter(w => w !== currentWord);
  
  saveProgress();
  loadExamWord();
}

function handleDontKnow() {
  const currentWord = wordList[appState.currentWordIndex].word;
  if (!appState.examDeck.includes(currentWord)) {
    appState.examDeck.push(currentWord);
  }
  loadExamWord();
}

function finishLearning() {
  DOM.currentWordEl.style.display = 'block';
  DOM.currentWordEl.textContent = "🎉 通关！";
  DOM.phoneticsEl.textContent = "当前词书考试已完成";
  DOM.phoneticsEl.style.visibility = 'visible';
  DOM.definitionSectionEl.classList.add('hidden');
  DOM.slotsContainer.classList.add('hidden');
  DOM.typingSection.classList.add('hidden');
  DOM.learningControls.classList.add('hidden');
  DOM.resetBtn.classList.remove('hidden');
}

function resetLearning() {
  appState.unlearnedWords = wordList.map(w => w.word);
  appState.examDeck = [];
  appState.consecutiveCorrectCount = 0;
  saveProgress();
  loadExamWord();
}

function triggerCelebration() {
  DOM.celebrationOverlay.classList.remove('hidden');
  setTimeout(() => DOM.celebrationOverlay.classList.add('show'), 10);
  setTimeout(() => {
    DOM.celebrationOverlay.classList.remove('show');
    setTimeout(() => DOM.celebrationOverlay.classList.add('hidden'), 500);
  }, 3000);
  
  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }
}

// ================================
// 9. 事件绑定
// ================================
DOM.modeToggleBtn.addEventListener('click', toggleMode);
DOM.prevBtn.addEventListener('click', prevCard);
DOM.nextBtn.addEventListener('click', nextCard);
DOM.showHideBtn.addEventListener('click', () => { 
  if (appState.isExamMode) giveUpInExamMode(); 
});
DOM.checkBtn.addEventListener('click', checkTyping);
DOM.examInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') checkTyping();
});

let inputDebounceTimer;
DOM.examInput.addEventListener('input', e => {
  clearTimeout(inputDebounceTimer);
  inputDebounceTimer = setTimeout(() => updateSlotsUI(e.target.value), 16);
});

DOM.playAudioBtn.addEventListener('click', () => playAudio(false)); // 🔥 手动点击播放

DOM.resetBtn.addEventListener('click', resetLearning);

window.addEventListener('resize', () => {
  if (appState.isExamMode && document.activeElement === DOM.examInput) {
    setTimeout(() => {
      DOM.examInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
});

// ================================
// 10. 启动应用
// ================================
document.addEventListener('DOMContentLoaded', () => {
  initSpeech();
  appState.isExamMode = false;
  DOM.modeText.textContent = "📚 学习模式";
  DOM.typingSection.classList.add('hidden');
  DOM.flashcardNav.classList.remove('hidden');
  loadFlashcard(); // 🔥 初次加载也会自动播放
});
