/* script.js - Final Fixed Version with Celebration */

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
} catch {
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
const PROGRESS_KEY = "hamster_progress_" + currentBookId;

function loadProgress() {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
        try { return JSON.parse(saved); } catch {}
    }
    return Array.from({ length: wordList.length }, (_, i) => i);
}

function saveProgress() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(unlearnedIndices));
}

// ================================
// 2. 状态变量
// ================================
let unlearnedIndices = loadProgress();
let currentWordIndex = -1;
let isExamMode = false;
let isSpeaking = false;
// 🔥 新增：连续答对计数
let consecutiveCorrectCount = 0;

// ================================
// 3. DOM 元素
// ================================
const currentWordEl = document.getElementById('current-word');
const chineseDefinitionEl = document.getElementById('chinese-definition');
const exampleSentenceEl = document.getElementById('example-sentence');
const phoneticsEl = document.getElementById('phonetics');
const definitionSectionEl = document.getElementById('definition-section');
const showHideBtn = document.getElementById('show-hide-btn');
const knowBtn = document.getElementById('know-btn');
const dontKnowBtn = document.getElementById('dont-know-btn');
const resetBtn = document.getElementById('reset-btn');
const progressInfoEl = document.getElementById('progress-info');
const playAudioBtn = document.getElementById('play-audio-btn');
const checkBtn = document.getElementById('check-btn');
const feedbackMessage = document.getElementById('feedback-message');
const learningControls = document.getElementById('learning-controls');
const typingSection = document.getElementById('typing-section');
const feedbackBtns = document.getElementById('feedback-btns');
const exampleBox = document.getElementById('example-box');
const slotsContainer = document.getElementById('slots-container');
const modeToggleBtn = document.getElementById('mode-toggle-btn');
const modeText = document.getElementById('mode-text');
const examInput = document.getElementById('exam-input');
const studyInput = document.getElementById('study-input');
// 🔥 新增：庆祝遮罩层元素
const celebrationOverlay = document.getElementById('celebration-overlay');

document.querySelector('h1').textContent = `🐹 ${bookData.name}`;

// ================================
// 4. SpeechSynthesis 初始化
// ================================
function initSpeech() {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.getVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    }
}

// ================================
// 5. 安全朗读
// ================================
function playAudio() {
    if (isSpeaking || !('speechSynthesis' in window)) return;

    const word = wordList[currentWordIndex]?.word;
    if (!word) return;

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;

    const voices = speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;

    utterance.onstart = () => isSpeaking = true;
    utterance.onend = () => isSpeaking = false;
    utterance.onerror = () => isSpeaking = false;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

// ================================
// 6. 模式切换
// ================================
function toggleMode() {
    isExamMode = !isExamMode;
    examInput.value = '';
    studyInput.value = '';
    feedbackMessage.textContent = '';
    // 🔥 切换模式时重置连续答对计数
    consecutiveCorrectCount = 0;

    if (isExamMode) {
        modeToggleBtn.classList.replace('study-active', 'exam-active');
        modeText.textContent = "📝 考试模式";
        showHideBtn.textContent = "🔑 看答案";
        typingSection.classList.add('exam-mode-input');
    } else {
        modeToggleBtn.classList.replace('exam-active', 'study-active');
        modeText.textContent = "📚 学习模式";
        showHideBtn.textContent = "👀 偷看答案";
        typingSection.classList.remove('exam-mode-input');
    }
    loadWord();
}

// ================================
// 7. 渲染逻辑
// ================================
function pickNextWord() {
    return unlearnedIndices[Math.floor(Math.random() * unlearnedIndices.length)];
}

function loadWord() {
    if (unlearnedIndices.length === 0) {
        finishLearning();
        return;
    }

    currentWordIndex = pickNextWord();
    const word = wordList[currentWordIndex];

    chineseDefinitionEl.textContent = word.chinese;
    exampleSentenceEl.textContent = word.example || '';
    progressInfoEl.textContent = `🐹 进度: ${wordList.length - unlearnedIndices.length} / ${wordList.length}`;

    feedbackMessage.textContent = '';
    examInput.value = '';
    studyInput.value = '';

    isExamMode ? renderExamMode(word) : renderStudyMode(word);
}

function renderStudyMode(word) {
    currentWordEl.style.display = 'none';
    
    definitionSectionEl.classList.remove('hidden');
    exampleBox.classList.add('hidden');
    
    phoneticsEl.style.visibility = 'hidden';
    playAudioBtn.style.visibility = 'hidden';

    dshowHideBtn.textContent = "🔑 看答案"; // <-- 新增或确保
    
    slotsContainer.classList.remove('hidden');
    renderSlots();
    
    feedbackBtns.classList.add('hidden');
    setTimeout(() => examInput.focus(), 50);
}

function renderExamMode(word) {
    currentWordEl.style.display = 'none';

    definitionSectionEl.classList.remove('hidden'); 
    exampleBox.classList.add('hidden');

    phoneticsEl.style.visibility = 'hidden';
    playAudioBtn.style.visibility = 'hidden';

    slotsContainer.classList.remove('hidden');
    renderSlots();

    feedbackBtns.classList.add('hidden');
    setTimeout(() => examInput.focus(), 50);
}

// ================================
// 8. 考试输入 Slots
// ================================
function renderSlots() {
    slotsContainer.querySelectorAll('span').forEach(s => s.remove());
    if (!slotsContainer.contains(examInput)) slotsContainer.appendChild(examInput);

    for (const ch of wordList[currentWordIndex].word) {
        const span = document.createElement('span');
        span.className = ch === ' ' ? 'space-slot' : 'char-slot';
        slotsContainer.appendChild(span);
    }
}

function updateSlotsUI(val) {
    const slots = slotsContainer.querySelectorAll('.char-slot');
    slots.forEach((s, i) => s.textContent = val[i] || '');
}

// ================================
// 9. 判断输入 (核心逻辑修改)
// ================================
function checkTyping() {
    const correct = wordList[currentWordIndex].word.toLowerCase().replace(/\s+/g, '');
    const input = isExamMode ? examInput : studyInput;
    const user = input.value.toLowerCase().replace(/\s+/g, '');

    if (user === correct) {
        feedbackMessage.textContent = "✨ 答对啦！";
        playAudio();
        
        // 🔥🔥 核心修改：考试模式连续答对处理 🔥🔥
        if (isExamMode) {
            consecutiveCorrectCount++;
            console.log("当前连续答对:", consecutiveCorrectCount); // 用于调试

            if (consecutiveCorrectCount === 10) {
                triggerCelebration();
                // 触发后重置，以便进行下一个10连击
                consecutiveCorrectCount = 0;
            }
        }
        // 🔥🔥 结束核心修改 🔥🔥

        // 普通撒花
        if (typeof confetti === 'function' && consecutiveCorrectCount !== 10) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        setTimeout(handleKnow, 1000);
    } else {
        feedbackMessage.textContent = "💨 不对哦，再试一次！";
        input.focus();
        // 🔥 答错时，如果是考试模式，重置计数
        if (isExamMode) {
            consecutiveCorrectCount = 0;
        }
    }
}

// ================================
// 10. 🔥 新增：触发庆祝动画函数 🔥
// ================================
function triggerCelebration() {
    // 1. 显示遮罩层 (移除 hidden, 添加 show 来触发过渡)
    celebrationOverlay.classList.remove('hidden');
    // 使用 setTimeout 确保浏览器先移除 hidden，再添加 show，从而产生动画
    setTimeout(() => {
        celebrationOverlay.classList.add('show');
    }, 10);
    
    // 2. 触发更热烈的撒花
    if (typeof confetti === 'function') {
        var duration = 3000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
          var timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          var particleCount = 50 * (timeLeft / duration);
          confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
          confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // 3. 3秒后自动隐藏
    setTimeout(() => {
        celebrationOverlay.classList.remove('show');
        // 等待 CSS 过渡完成后再添加 hidden
        setTimeout(() => {
            celebrationOverlay.classList.add('hidden');
        }, 500); 
    }, 3000);
}


// ================================
// 11. 我放弃（考试模式专用）
// ================================
function giveUpInExamMode() {
    currentWordEl.style.display = 'block';
    currentWordEl.textContent = wordList[currentWordIndex].word;

    phoneticsEl.textContent = wordList[currentWordIndex].phonetics;
    phoneticsEl.style.visibility = 'visible';
    playAudioBtn.style.visibility = 'visible';

    slotsContainer.classList.add('hidden');
    feedbackMessage.textContent = "📖 看一下答案，下次一定行！";
    
    // 🔥 放弃也算中断连胜
    consecutiveCorrectCount = 0;

    playAudio();
    setTimeout(handleDontKnow, 3000);
}

// ================================
// 12. 学习状态
// ================================
function handleKnow() {
    unlearnedIndices = unlearnedIndices.filter(i => i !== currentWordIndex);
    saveProgress();
    loadWord();
}

function handleDontKnow() {
    loadWord();
}

function finishLearning() {
    currentWordEl.textContent = "🎉 通关！";
    phoneticsEl.textContent = "当前词书已完成";
    typingSection.classList.add('hidden');
    learningControls.classList.add('hidden');
    resetBtn.classList.remove('hidden');
}

// ================================
// 13. 重置
// ================================
function resetLearning() {
    unlearnedIndices = Array.from({ length: wordList.length }, (_, i) => i);
    // 🔥 重置时清空计数
    consecutiveCorrectCount = 0;
    saveProgress();
    loadWord();
}

// ================================
// 14. 事件绑定
// ================================
modeToggleBtn.addEventListener('click', toggleMode);

showHideBtn.addEventListener('click', () => {
    if (isExamMode) giveUpInExamMode();
    else definitionSectionEl.classList.toggle('hidden');
});

knowBtn.addEventListener('click', handleKnow);
dontKnowBtn.addEventListener('click', handleDontKnow);
resetBtn.addEventListener('click', resetLearning);
playAudioBtn.addEventListener('click', playAudio);
checkBtn.addEventListener('click', checkTyping);

examInput.addEventListener('input', e => {
    const val = e.target.value.replace(/\s+/g, '');
    if (e.target.value !== val) {
        e.target.value = val;
    }
    updateSlotsUI(val);
});

examInput.addEventListener('keydown', e => e.key === 'Enter' && checkTyping());
studyInput.addEventListener('keydown', e => e.key === 'Enter' && checkTyping());

// ================================
// 15. 启动
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initSpeech();
    loadWord();
});

