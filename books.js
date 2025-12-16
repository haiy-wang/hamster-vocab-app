/* books.js - V3 优化版：兼容新旧进度格式 */

const BOOK_PREFIX = "wordbook_";
const PROGRESS_PREFIX = "hamster_progress_";
const PROGRESS_PREFIX_V3 = "hamster_progress_v3_"; // 🔥 新版本前缀
const STORAGE_WARNING_SIZE = 4 * 1024 * 1024;

function openImport() {
  const input = document.getElementById("importInput");
  if (input) input.click();
}

function loadAllBooks() {
  const books = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(BOOK_PREFIX)) {
      try {
        const book = JSON.parse(localStorage.getItem(key));
        if (book && book.id && Array.isArray(book.words)) {
          books.push(book);
        }
      } catch (e) {
        console.warn("词书解析失败:", key, e);
      }
    }
  }
  
  books.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  return books;
}

// 🔥 优化：兼容新旧进度格式
function calcProgress(book) {
  const progressKeyV3 = PROGRESS_PREFIX_V3 + book.id;
  const progressKeyOld = PROGRESS_PREFIX + book.id;
  const total = book.words.length;
  
  // 优先读取V3版本（单词文本数组）
  let savedV3 = localStorage.getItem(progressKeyV3);
  if (savedV3) {
    try {
      const unlearnedWords = JSON.parse(savedV3);
      if (Array.isArray(unlearnedWords)) {
        const learned = total - unlearnedWords.length;
        const safeLearned = Math.max(0, Math.min(learned, total));
        const percent = total === 0 ? 0 : Math.round((safeLearned / total) * 100);
        
        let status = "未开始";
        if (safeLearned === total && total > 0) status = "已完成";
        else if (safeLearned > 0) status = "学习中";
        
        return { learned: safeLearned, total, percent, status };
      }
    } catch(e) {
      console.warn("V3进度数据解析失败:", e);
    }
  }
  
  // 降级读取旧版本（索引数组）
  let savedOld = localStorage.getItem(progressKeyOld);
  if (savedOld) {
    try {
      const unlearned = JSON.parse(savedOld);
      if (Array.isArray(unlearned)) {
        const learned = total - unlearned.length;
        const safeLearned = Math.max(0, Math.min(learned, total));
        const percent = total === 0 ? 0 : Math.round((safeLearned / total) * 100);
        
        let status = "未开始";
        if (safeLearned === total && total > 0) status = "已完成";
        else if (safeLearned > 0) status = "学习中";
        
        return { learned: safeLearned, total, percent, status };
      }
    } catch(e) {
      console.warn("旧进度数据解析失败:", e);
    }
  }
  
  return { learned: 0, total, percent: 0, status: "未开始" };
}

function renderBookList() {
  const container = document.getElementById("bookList");
  if (!container) {
    console.error("找不到bookList容器");
    return;
  }
  
  container.innerHTML = "";
  const books = loadAllBooks();
  
  if (books.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <div class="empty-text">还没有词库哦</div>
        <div class="empty-subtext">点击下方按钮导入第一本单词书吧 🐹</div>
      </div>
    `;
    return;
  }
  
  books.forEach(book => {
    const progress = calcProgress(book);
    
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <div class="book-main">
        <div class="book-icon">📖</div>
        <div class="book-info">
          <h2>${escapeHtml(book.name)}</h2>
          <p>
            数量：${progress.total}
            ${progress.learned > 0 ? `<span class="status">${progress.status}</span>` : ""}
          </p>
        </div>
        <div class="arrow">→</div>
      </div>
      ${progress.total > 0 ? `
        <div class="progress-bar">
          <div class="progress" style="width: ${progress.percent}%"></div>
        </div>
      ` : ''}
      <button class="delete-btn" onclick="deleteBook('${book.id}', event)" title="删除词库">🗑️</button>
    `;
    
    card.addEventListener("click", (e) => {
      if (e.target.closest('.delete-btn')) return;
      selectBook(book.id);
    });
    
    container.appendChild(card);
  });
}

function selectBook(bookId) {
  localStorage.setItem("current_book", bookId);
  window.location.href = "index.html";
}

function deleteBook(bookId, event) {
  event.stopPropagation();
  
  const bookKey = BOOK_PREFIX + bookId;
  const book = JSON.parse(localStorage.getItem(bookKey) || '{}');
  const bookName = book.name || '此词库';
  
  if (confirm(`确定要删除「${bookName}」吗？\n学习进度也会一并删除 🐹`)) {
    try {
      localStorage.removeItem(bookKey);
      localStorage.removeItem(PROGRESS_PREFIX + bookId);
      localStorage.removeItem(PROGRESS_PREFIX_V3 + bookId); // 🔥 删除V3进度
      
      if (localStorage.getItem("current_book") === bookId) {
        localStorage.removeItem("current_book");
      }
      
      renderBookList();
    } catch (e) {
      console.error("删除失败:", e);
      alert("删除失败，请重试 🤕");
    }
  }
}

function validateBook(book) {
  if (!book || typeof book !== 'object') {
    return '词库格式错误：不是有效的JSON对象';
  }
  
  if (!book.id || typeof book.id !== 'string') {
    return '词库格式错误：缺少有效的id字段';
  }
  
  if (!book.name || typeof book.name !== 'string') {
    return '词库格式错误：缺少有效的name字段';
  }
  
  if (!Array.isArray(book.words)) {
    return '词库格式错误：words必须是数组';
  }
  
  if (book.words.length === 0) {
    return '词库不能为空';
  }
  
  for (let i = 0; i < book.words.length; i++) {
    const word = book.words[i];
    if (!word || typeof word !== 'object') {
      return `第${i+1}个单词格式错误`;
    }
    if (!word.word || typeof word.word !== 'string') {
      return `第${i+1}个单词缺少word字段`;
    }
    if (!word.chinese || typeof word.chinese !== 'string') {
      return `第${i+1}个单词缺少chinese字段`;
    }
  }
  
  return null;
}

function safeStorageSave(key, data) {
  try {
    const serialized = JSON.stringify(data);
    
    if (serialized.length > STORAGE_WARNING_SIZE) {
      console.warn('词库数据较大，接近存储限制');
      if (!confirm('词库数据较大，可能影响性能，是否继续导入？')) {
        return false;
      }
    }
    
    localStorage.setItem(key, serialized);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('存储空间不足，请删除部分词库后重试 🐹');
    } else {
      alert('保存失败：' + e.message);
    }
    console.error('存储失败:', e);
    return false;
  }
}

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const book = JSON.parse(e.target.result);
      
      const error = validateBook(book);
      if (error) {
        alert(error + ' 🤕');
        return;
      }
      
      const bookKey = BOOK_PREFIX + book.id;
      const existing = localStorage.getItem(bookKey);
      if (existing) {
        if (!confirm(`词库「${book.name}」已存在，是否覆盖？\n覆盖后原学习进度会保留`)) {
          return;
        }
      }
      
      if (safeStorageSave(bookKey, book)) {
        alert(`✨ 成功导入「${book.name}」\n共${book.words.length}个单词`);
        renderBookList();
      }
      
    } catch (e) {
      console.error("导入失败:", e);
      alert("文件格式错误，请检查JSON格式 🤕");
    }
  };
  
  reader.onerror = function() {
    alert("文件读取失败 🤕");
  };
  
  reader.readAsText(file);
  event.target.value = '';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  renderBookList();
  
  const importInput = document.getElementById("importInput");
  if (importInput) {
    importInput.addEventListener("change", handleImport);
  }
});
