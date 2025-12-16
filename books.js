(() => {
'use strict';

/* books.js - 优化版 */
const BOOK_PREFIX = "wordbook_";
const PROGRESS_PREFIX = "hamster_progress_";

function openImport() {
  const input = document.getElementById("importInput");
  if (input) input.click();
}

function loadAllBooks() {
  const books = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(BOOK_PREFIX)) {
      try {
        const book = JSON.parse(localStorage.getItem(key));
        if (book && book.id && Array.isArray(book.words)) {
          books.push(book);
        }
      } catch (e) {
        console.warn("词书解析失败:", key);
      }
    }
  }
  books.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  return books;
}

function calcProgress(book) {
  const progressKey = PROGRESS_PREFIX + book.id;
  const saved = localStorage.getItem(progressKey);
  const total = book.words.length;

  if (!saved) {
    return { learned: 0, total, percent: 0, status: "未开始" };
  }

  let unlearned = [];
  try {
      unlearned = JSON.parse(saved);
  } catch(e) { unlearned = []; }
  
  const learned = total - unlearned.length;
  // 防止计算出负数（如果词库更新导致总数变少，旧进度可能会出问题）
  const safeLearned = Math.max(0, Math.min(learned, total));
  const percent = total === 0 ? 0 : Math.round((safeLearned / total) * 100);

  let status = "未开始";
  if (safeLearned === total && total > 0) status = "已完成";
  else if (safeLearned > 0) status = "学习中";

  return { learned: safeLearned, total, percent, status };
}

function renderBookList() {
  const container = document.getElementById("bookList");
  container.innerHTML = "";
  const books = loadAllBooks();

  if (books.length === 0) {
    container.innerHTML = `<div style="text-align:center;opacity:.7;">还没有词库，先导入一个吧 🐹</div>`;
    return;
  }

  books.forEach(book => {
    const progress = calcProgress(book);
    container.appendChild(createBookCard(book, progress));
  });
}

function createBookCard(book, progress) {
  const card = document.createElement("div");
  card.className = "book-card";
  card.onclick = () => enterBook(book.id);

  card.innerHTML = `
    <button class="delete-btn" title="删除词库">🗑️</button>
    <div class="book-main">
      <span class="book-icon">📘</span>
      <div class="book-info">
        <h2>${book.name}</h2>
        <p>数量：${progress.total} ${progress.learned > 0 ? `<span class="status">${progress.status}</span>` : ""}</p>
      </div>
      <span class="arrow">›</span>
    </div>
    ${progress.learned > 0 ? `<div class="progress-bar"><div class="progress" style="width:${progress.percent}%"></div></div>` : ""}
  `;

  card.querySelector(".delete-btn").onclick = (e) => {
    e.stopPropagation();
    confirmDelete(book.id);
  };
  return card;
}

function enterBook(bookId) {
  localStorage.setItem("current_book", bookId);
  window.location.href = "index.html";
}

function confirmDelete(bookId) {
  if (!confirm("确定要删除这个词库吗？\n\n⚠️ 学习进度也会一并删除")) return;
  localStorage.removeItem(BOOK_PREFIX + bookId);
  localStorage.removeItem(PROGRESS_PREFIX + bookId);
  if (localStorage.getItem("current_book") === bookId) {
    localStorage.removeItem("current_book");
  }
  renderBookList();
}

function handleImportFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      validateAndSaveBook(data);
      alert("✅ 导入成功！");
      renderBookList();
    } catch (err) {
      console.error(err);
      alert("❌ 导入失败，请检查文件格式");
    }
  };
  reader.readAsText(file, "utf-8");
  event.target.value = "";
}

function validateAndSaveBook(book) {
  if (!book || !book.id || !book.name || !Array.isArray(book.words)) {
    throw new Error("词库结构不完整");
  }

  const cleanedWords = [];
  const seen = new Set();

  book.words.forEach(w => {
    if (!w || !w.word || !w.chinese) return; // 增加空值检查
    const key = w.word.toLowerCase().trim();
    if (seen.has(key)) return;
    seen.add(key);

    cleanedWords.push({
      word: w.word.trim(),
      chinese: w.chinese.trim(),
      phonetics: w.phonetics || "",
      example: w.example || ""
    });
  });

  if (cleanedWords.length === 0) throw new Error("没有有效单词");

  const finalBook = {
    id: book.id,
    name: book.name,
    description: book.description || "",
    words: cleanedWords
  };

  const storageKey = BOOK_PREFIX + finalBook.id;
  const progressKey = PROGRESS_PREFIX + finalBook.id;

  // 🔥 关键修改：如果已存在，询问覆盖并重置进度
  if (localStorage.getItem(storageKey)) {
    if (!confirm(`已存在词库「${finalBook.name}」，是否覆盖？\n⚠️ 这将重置该书的学习进度！`)) return;
    localStorage.removeItem(progressKey); // 删除旧进度
  }

  localStorage.setItem(storageKey, JSON.stringify(finalBook));

  // 重新生成进度索引
  const allIndexes = Array.from({ length: finalBook.words.length }, (_, i) => i);
  localStorage.setItem(progressKey, JSON.stringify(allIndexes));
}

document.addEventListener("DOMContentLoaded", () => {
  renderBookList();
  const importInput = document.getElementById("importInput");
  if (importInput) importInput.addEventListener("change", handleImportFile);
});

})();
