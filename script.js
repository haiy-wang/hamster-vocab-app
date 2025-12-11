// 1. 单词库 (这里只放几个作为示例，请把你的147个单词完整列表放进去)
const wordList = [
    { word: "ask", chinese: "问", example: "I want to ask you a question.", phonetics: "/ɑːsk/" },
    { word: "sir", chinese: "(对男子的礼貌称呼)先生", example: "Excuse me, sir, where is the bank?", phonetics: "/səː(r)/" },
    { word: "interesting", chinese: "有趣的", example: "This book is very interesting.", phonetics: "/ˈɪntrəstɪŋ/" },
    { word: "Italian", chinese: "意大利的", example: "My friend cooks delicious Italian food.", phonetics: "/ɪˈtæliən/" },
    { word: "restaurant", chinese: "餐馆", example: "Let’s have dinner at that new restaurant.", phonetics: "/ˈrestərɒnt/" },
    { word: "pizza", chinese: "比萨饼", example: "We ate a big pizza for lunch.", phonetics: "/ˈpiːtsə/" },
    { word: "street", chinese: "大街；街道", example: "There are many trees on this street.", phonetics: "/striːt/" },
    { word: "get", chinese: "得到；到达", example: "Did you get my email yesterday?", phonetics: "/ɡet/" },
    { word: "GPS", chinese: "全球（卫星）定位系统", example: "I used the GPS to find the hotel.", phonetics: "/ˌdʒiː piː ˈes/" },
    { word: "turn", chinese: "转弯", example: "Turn right at the next corner, please.", phonetics: "/tɜːn/" },
    { word: "left", chinese: "左", example: "The supermarket is on the left.", phonetics: "/left/" },
    { word: "straight", chinese: "笔直地", example: "Walk straight for five minutes and you will see it.", phonetics: "/streɪt/" },
    { word: "right", chinese: "右", example: "Your answer is right, well done.", phonetics: "/raɪt/" },
    { word: "science", chinese: "科学", example: "Science is my favorite subject at school.", phonetics: "/ˈsaɪəns/" },
    { word: "museum", chinese: "博物馆", example: "We visited a history museum last Sunday.", phonetics: "/mjuːˈziːəm/" },
    { word: "post office", chinese: "邮局", example: "I went to the post office to send a letter.", phonetics: "/pəʊst ˈɒfɪs/" },
    { word: "bookstore", chinese: "书店", example: "There is a big bookstore near my home.", phonetics: "/ˈbʊkstɔː(r)/" },
    { word: "cinema", chinese: "电影院", example: "Let’s go to the cinema this weekend.", phonetics: "/ˈsɪnəmɑː/" },
    { word: "hospital", chinese: "医院", example: "He is sick and must go to the hospital.", phonetics: "/ˈhɒspɪtl/" },
    { word: "crossing", chinese: "十字路口", example: "Be careful when you walk across the crossing.", phonetics: "/ˈkrɒsɪŋ/" },
    { word: "gave", chinese: "(give 的过去式)提供；交给", example: "She gave me a beautiful postcard.", phonetics: "/ɡeɪv/" },
    { word: "feature", chinese: "特点", example: "The big window is a special feature of this house.", phonetics: "/ˈfiːtʃə(r)/" },
    { word: "follow", chinese: "沿着", example: "Please follow me to the classroom.", phonetics: "/ˈfɒləʊ/" },
    { word: "far", chinese: "远的", example: "My school is not far from my home.", phonetics: "/fɑː(r)/" },
    { word: "tell", chinese: "告诉", example: "Can you tell me your name?", phonetics: "/tel/" },
    { word: "Mrs", chinese: "夫人", example: "Mrs Wang is our English teacher.", phonetics: "/ˈmɪsɪz/" },
    { word: "early", chinese: "早期的", example: "He gets up very early every morning.", phonetics: "/ˈɜːli/" },
    { word: "on foot", chinese: "步行", example: "We went to the park on foot.", phonetics: "/ɒn fʊt/" },
    { word: "by bus", chinese: "(表示方式)乘", example: "My father goes to work by bus.", phonetics: "/baɪ bʌs/" }, // 注意：这里将 /bai/ 结合了 bus 
    { word: "bus", chinese: "公共汽车", example: "The bus is full of people.", phonetics: "/bʌs/" },
    { word: "plane", chinese: "飞机", example: "They took a plane to Germany.", phonetics: "/pleɪn/" },
    { word: "taxi", chinese: "出租汽车", example: "We took a taxi to the hotel.", phonetics: "/ˈtæksi/" },
    { word: "ship", chinese: "(大)船", example: "The ship is sailing across the sea.", phonetics: "/ʃɪp/" },
    { word: "subway", chinese: "地铁", example: "I go to the city center by subway.", phonetics: "/ˈsʌbweɪ/" },
    { word: "train", chinese: "火车", example: "The train leaves at seven o’clock.", phonetics: "/treɪn/" },
    { word: "helmet", chinese: "头盔", example: "You must wear a helmet when you ride a bike.", phonetics: "/ˈhelmɪt/" },
    { word: "must", chinese: "必须", example: "You must do your homework every day.", phonetics: "/mʌst/" },
    { word: "wear", chinese: "戴", example: "He always wears a hat in winter.", phonetics: "/weə(r)/" },
    { word: "attention", chinese: "注意", example: "The teacher asked us to pay attention.", phonetics: "/əˈtenʃən/" },
    { word: "pay attention to", chinese: "注意", example: "Please pay attention to the traffic lights.", phonetics: "/peɪ əˈtenʃən tuː/" },
    { word: "traffic", chinese: "交通", example: "There is heavy traffic in the morning.", phonetics: "/ˈtræfɪk/" },
    { word: "traffic lights", chinese: "交通信号灯", example: "Wait for the green traffic lights.", phonetics: "/ˈtræfɪk laɪts/" },
    { word: "slow", chinese: "慢的", example: "The car is too slow on this road.", phonetics: "/sləʊ/" },
    { word: "down", chinese: "减少；降低", example: "The price of apples is going down.", phonetics: "/daʊn/" },
    { word: "slow down", chinese: "减速", example: "Please slow down near the school.", phonetics: "/sləʊ daʊn/" },
    { word: "stop", chinese: "停下", example: "The bus will stop at the next crossing.", phonetics: "/stɒp/" },
    { word: "Munich", chinese: "慕尼黑（德国城市）", example: "They live in Munich with their family.", phonetics: "/ˈmjuːnɪk/" },
    { word: "Germany", chinese: "德国", example: "Germany is a country in Europe.", phonetics: "/ˈdʒɜːməni/" },
    { word: "Alaska", chinese: "阿拉斯加州（美国）", example: "Alaska is very cold in winter.", phonetics: "/əˈlæskə/" },
    { word: "sled", chinese: "雪橇", example: "The children are riding a sled in the snow.", phonetics: "/sled/" },
    { word: "fast", chinese: "快的", example: "That car is very fast.", phonetics: "/fɑːst/" },
    { word: "ferry", chinese: "渡船", example: "We took a ferry to the island.", phonetics: "/ˈferi/" },
    { word: "Papa Westray", chinese: "帕帕韦斯特雷岛", example: "The flight to Papa Westray is very short.", phonetics: "/ˈpæpə ˈwestreɪ/" },
    { word: "Scotland", chinese: "苏格兰", example: "Scotland is famous for its beautiful lakes.", phonetics: "/ˈskɒtlənd/" },
    { word: "travel", chinese: "(长途或多次)旅行", example: "I like to travel to different countries.", phonetics: "/ˈtrævl/" },
    { word: "half", chinese: "一半", example: "I ate half the cake.", phonetics: "/hɑːf/" },
    { word: "price", chinese: "价格", example: "The price of this jacket is too high.", phonetics: "/praɪs/" },
    { word: "lesson", chinese: "课", example: "Our English lesson starts at eight.", phonetics: "/ˈlesn/" },
    { word: "visit", chinese: "拜访", example: "We will visit our grandparents this weekend.", phonetics: "/ˈvɪzɪt/" },
    { word: "film", chinese: "电影", example: "That film was funny and exciting.", phonetics: "/fɪlm/" },
    { word: "see a film", chinese: "看电影", example: "I want to see a film tonight.", phonetics: "/siː ə fɪlm/" },
    { word: "trip", chinese: "旅行", example: "Our school trip was great fun.", phonetics: "/trɪp/" },
    { word: "take a trip", chinese: "去旅行", example: "Let’s take a trip to the beach.", phonetics: "/teɪk ə trɪp/" },
    { word: "supermarket", chinese: "超级市场", example: "My mother buys food at the supermarket.", phonetics: "/ˈsuːpəmɑːkɪt/" },
    { word: "evening", chinese: "晚上；傍晚", example: "I usually do my homework in the evening.", phonetics: "/ˈiːvnɪŋ/" },
    { word: "tonight", chinese: "在今晚", example: "What are you going to do tonight?", phonetics: "/təˈnaɪt/" },
    { word: "tomorrow", chinese: "明天", example: "I have a test tomorrow.", phonetics: "/təˈmɒrəʊ/" },
    { word: "next week", chinese: "下周", example: "We will start a new lesson next week.", phonetics: "/nekst wiːk/" },
    { word: "space", chinese: "太空", example: "He wants to learn more about space.", phonetics: "/speɪs/" },
    { word: "dictionary", chinese: "词典", example: "Look up the word in the dictionary.", phonetics: "/ˈdɪkʃənəri/" },
    { word: "comic", chinese: "漫画的", example: "He likes reading comic stories.", phonetics: "/ˈkɒmɪk/" },
    { word: "comic book", chinese: "(儿童的)连环画册", example: "I bought a new comic book yesterday.", phonetics: "/ˈkɒmɪk bʊk/" },
    { word: "word", chinese: "单词", example: "This word is difficult for me.", phonetics: "/wɜːd/" },
    { word: "word book", chinese: "字帖", example: "I write new words in my word book.", phonetics: "/wɜːd bʊk/" },
    { word: "postcard", chinese: "明信片", example: "She sent me a postcard from Beijing.", phonetics: "/ˈpəʊstkɑːd/" },
    { word: "Mid-Autumn Festival", chinese: "中秋节", example: "We eat mooncakes at Mid-Autumn Festival.", phonetics: "/mɪd ˈɔːtəm ˈfestɪvəl/" },
    { word: "together", chinese: "一起", example: "Let’s do our homework together.", phonetics: "/təˈɡeðə(r)/" },
    { word: "get together", chinese: "聚会", example: "We will get together this Saturday.", phonetics: "/ɡet təˈɡeðə(r)/" },
    { word: "mooncake", chinese: "月饼", example: "The mooncake tastes sweet and delicious.", phonetics: "/ˈmuːnkeɪk/" },
    { word: "poem", chinese: "诗", example: "He wrote a poem about the moon.", phonetics: "/ˈpəʊɪm/" },
    { word: "moon", chinese: "月亮", example: "The moon is very bright tonight.", phonetics: "/muːn/" },
    { word: "share", chinese: "分享", example: "I want to share this cake with you.", phonetics: "/ʃeə(r)/" },
    { word: "pen pal", chinese: "笔友", example: "I have a pen pal in Canada.", phonetics: "/ˈpen pæl/" },
    { word: "hobby", chinese: "业余爱好", example: "My hobby is playing basketball.", phonetics: "/ˈhɒbi/" },
    { word: "jasmine", chinese: "茉莉", example: "Jasmine has a very nice smell.", phonetics: "/ˈdʒæzmɪn/" },
    { word: "idea", chinese: "想法；主意", example: "That is a great idea.", phonetics: "/aɪˈdɪə/" },
    { word: "Canberra", chinese: "堪培拉（澳大利亚首都）", example: "Canberra is the capital of Australia.", phonetics: "/ˈkænbərə/" },
    { word: "amazing", chinese: "令人吃惊的", example: "The view from the mountain is amazing.", phonetics: "/əˈmeɪzɪŋ/" },
    { word: "studies", chinese: "(study 的复数)学习", example: "He works hard at his studies.", phonetics: "/ˈstʌdiz/" },
    { word: "puzzle", chinese: "谜", example: "This puzzle is difficult but fun.", phonetics: "/ˈpʌzl/" },
    { word: "hiking", chinese: "远足", example: "We went hiking in the mountains.", phonetics: "/ˈhaɪkɪŋ/" },
    { word: "shall", chinese: "(表示征求意见)应该", example: "Shall we go for a walk?", phonetics: "/ʃæl/" },
    { word: "goal", chinese: "目标", example: "My goal is to speak English well.", phonetics: "/ɡəʊl/" },
    { word: "join", chinese: "加入", example: "Would you like to join our club?", phonetics: "/dʒɔɪn/" },
    { word: "club", chinese: "俱乐部", example: "I am in the school music club.", phonetics: "/klʌb/" },
    { word: "factory", chinese: "工厂", example: "My uncle works in a factory.", phonetics: "/ˈfæktəri/" },
    { word: "worker", chinese: "工人", example: "The worker is very busy today.", phonetics: "/ˈwɜːkə(r)/" },
    { word: "postman", chinese: "邮递员", example: "The postman brings letters every morning.", phonetics: "/ˈpəʊstmən/" },
    { word: "businessman", chinese: "商人；企业家", example: "He is a successful businessman.", phonetics: "/ˈbɪznəsmən/" },
    { word: "police officer", chinese: "警察", example: "The police officer helped the lost child.", phonetics: "/pəˈliːs ˈɒfɪsə(r)/" },
    { word: "country", chinese: "国家", example: "China is a big country.", phonetics: "/ˈkʌntri/" },
    { word: "head teacher", chinese: "校长", example: "Our head teacher is very kind.", phonetics: "/hed ˈtiːtʃə(r)/" },
    { word: "fisherman", chinese: "渔民", example: "The fisherman caught many fish.", phonetics: "/ˈfɪʃəmən/" },
    { word: "scientist", chinese: "科学家", example: "She wants to be a scientist in the future.", phonetics: "/ˈsaɪəntɪst/" },
    { word: "pilot", chinese: "飞行员", example: "The pilot flies the plane safely.", phonetics: "/ˈpaɪlət/" },
    { word: "coach", chinese: "教练", example: "Our football coach is very strict.", phonetics: "/kəʊtʃ/" },
    { word: "sea", chinese: "大海", example: "The sea looks blue and beautiful.", phonetics: "/siː/" },
    { word: "stay", chinese: "保持", example: "We will stay here for two days.", phonetics: "/steɪ/" },
    { word: "university", chinese: "大学", example: "She studies English at a university.", phonetics: "/ˌjuːnɪˈvɜːsəti/" },
    { word: "gym", chinese: "体育馆", example: "I often exercise in the gym.", phonetics: "/dʒɪm/" },
    { word: "if", chinese: "如果", example: "If it rains, we will stay at home.", phonetics: "/ɪf/" },
    { word: "reporter", chinese: "记者", example: "The reporter is talking to the head teacher.", phonetics: "/rɪˈpɔːtə(r)/" },
    { word: "use", chinese: "使用", example: "You can use my pen.", phonetics: "/juːz/" },
    { word: "type", chinese: "打字", example: "She can type very fast.", phonetics: "/taɪp/" },
    { word: "quickly", chinese: "迅速地", example: "He ran quickly to catch the bus.", phonetics: "/ˈkwɪkli/" },
    { word: "secretary", chinese: "秘书", example: "The secretary answered the phone politely.", phonetics: "/ˈsekrətri/" },
    { word: "mice", chinese: "(mouse 的复数) 老鼠", example: "The cats are chasing the mice.", phonetics: "/maɪs/" },
    { word: "chase", chinese: "追赶", example: "The dog likes to chase the ball.", phonetics: "/tʃeɪs/" },
    { word: "bad", chinese: "邪恶的；坏的", example: "Smoking is bad for your health.", phonetics: "/bæd/" },
    { word: "hurt", chinese: "(使)受伤", example: "Did you hurt your hand?", phonetics: "/hɜːt/" },
    { word: "ill", chinese: "有病的；不好服", example: "She is ill and stays in bed.", phonetics: "/ɪl/" },
    { word: "wrong", chinese: "有毛病", example: "Something is wrong with my computer.", phonetics: "/rɒŋ/" },
    { word: "should", chinese: "应该", example: "You should drink more water.", phonetics: "/ʃʊd/" },
    { word: "feel", chinese: "觉得；感到", example: "I feel happy today.", phonetics: "/fiːl/" },
    { word: "well", chinese: "健康；身体好", example: "I don’t feel very well today.", phonetics: "/wel/" },
    { word: "sit", chinese: "坐", example: "Please sit on this chair.", phonetics: "/sɪt/" },
    { word: "wear", chinese: "穿", example: "She likes to wear red dresses.", phonetics: "/weə(r)/" },
    { word: "more", chinese: "更多的", example: "I need more time to finish this.", phonetics: "/mɔː(r)/" },
    { word: "deep", chinese: "深的", example: "The lake is very deep.", phonetics: "/diːp/" },
    { word: "breath", chinese: "呼吸", example: "Take a slow, gentle breath.", phonetics: "/breθ/" },
    { word: "take a deep breath", chinese: "深深吸一口气", example: "Close your eyes and take a deep breath.", phonetics: "/teɪk ə diːp breθ/" },
    { word: "count", chinese: "数数", example: "Can you count from one to ten?", phonetics: "/kaʊnt/" },
    { word: "count to ten", chinese: "数到十", example: "When you are angry, count to ten first.", phonetics: "/kaʊnt tə ten/" },
    { word: "grass", chinese: "草坪", example: "The children are playing on the grass.", phonetics: "/ɡrɑːs/" },
    { word: "hear", chinese: "听见", example: "I can hear birds outside the window.", phonetics: "/hɪə(r)/" },
    { word: "ant", chinese: "蚂蚁", example: "There is an ant on the table.", phonetics: "/ænt/" },
    { word: "worry", chinese: "担心；担忧", example: "Don’t worry, everything will be fine.", phonetics: "/ˈwʌri/" },
    { word: "stuck", chinese: "陷住；无法移动", example: "My shoe got stuck in the mud.", phonetics: "/stʌk/" },
    { word: "mud", chinese: "泥", example: "The road is full of mud after the rain.", phonetics: "/mʌd/" },
    { word: "pull", chinese: "拉；拽", example: "He tried to pull the door open.", phonetics: "/pʊl/" },
    { word: "everyone", chinese: "每人", example: "Everyone in the class likes this game.", phonetics: "/ˈevriwʌn/" },
    { word: "angry", chinese: "生气的", example: "She was angry because he was late again.", phonetics: "/ˈæŋɡri/" },
    { word: "afraid", chinese: "害怕", example: "The little boy is afraid of the dark.", phonetics: "/əˈfreɪd/" },
    { word: "sad", chinese: "难过的", example: "He felt sad when his dog was lost.", phonetics: "/sæd/" },
    { word: "worried", chinese: "担心的；发愁的", example: "I am worried about the exam.", phonetics: "/ˈwʌrɪd/" },
    { word: "happy", chinese: "高兴的", example: "They are very happy at the party.", phonetics: "/ˈhæpi/" },
    { word: "see a doctor", chinese: "看病", example: "You should see a doctor soon.", phonetics: "/siː ə ˈdɒktə(r)/" }
];

// 2. 状态变量
let currentWordIndex = 0;
let unlearnedIndices = Array.from(Array(wordList.length).keys());
const totalWords = wordList.length;
let isExamMode = false;

// 3. 获取 DOM 元素
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
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const feedbackMessage = document.getElementById('feedback-message');
const learningControls = document.getElementById('learning-controls');
const typingSection = document.getElementById('typing-section');
const feedbackBtns = document.getElementById('feedback-btns');
const exampleBox = document.getElementById('example-box');
const slotsContainer = document.getElementById('slots-container');
const modeToggleBtn = document.getElementById('mode-toggle-btn');
const modeText = document.getElementById('mode-text');

// --- ⚙️ 模式切换功能 ---
function toggleMode() {
    isExamMode = !isExamMode;
    userInput.value = ''; // 切换时清空输入

    if (isExamMode) {
        modeToggleBtn.classList.remove('study-active');
        modeToggleBtn.classList.add('exam-active');
        modeText.textContent = "📝 考试模式";
        showHideBtn.textContent = "🏳️ 我放弃 (看答案)";
        
        // 给输入区添加特殊样式类 (透明覆盖)
        typingSection.classList.add('exam-mode-input');
    } else {
        modeToggleBtn.classList.remove('exam-active');
        modeToggleBtn.classList.add('study-active');
        modeText.textContent = "📚 学习模式";
        showHideBtn.textContent = "👀 偷看答案";
        
        // 移除特殊样式类
        typingSection.classList.remove('exam-mode-input');
    }

    loadWord();
}

// --- 🔊 音频播放 ---
function playAudio() {
    if (unlearnedIndices.length > 0 || isExamMode) {
        const wordToSpeak = wordList[currentWordIndex].word;
        const utterance = new SpeechSynthesisUtterance(wordToSpeak);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }
}

// --- 🔡 渲染下划线 ---
function renderSlots() {
    slotsContainer.innerHTML = ''; // 清空旧的
    const targetWord = wordList[currentWordIndex].word;

    // 遍历单词的每个字符
    for (let i = 0; i < targetWord.length; i++) {
        const char = targetWord[i];
        const span = document.createElement('span');

        if (char === ' ') {
            span.className = 'space-slot'; // 空格
        } else {
            span.className = 'char-slot'; // 字母下划线
        }
        slotsContainer.appendChild(span);
    }
}

// --- ⌨️ 核心修复：监听输入、解决手机端问题、跳过空格 ---
userInput.addEventListener('input', function(e) {
    if (!isExamMode) return;

    const targetWord = wordList[currentWordIndex].word;
    let currentVal = this.value;

    // 1. 获取输入类型 (是打字还是删除?)
    // inputType 在安卓/iOS 上通常能获取到 'insertText' 或 'deleteContentBackward'
    const isDeleting = e.inputType && e.inputType.includes('delete');

    // 2. 自动跳过空格逻辑
    // 只有在“非删除”状态下，才执行自动补全空格
    if (!isDeleting && currentVal.length < targetWord.length) {
        // 如果当前需要输入的字符(targetWord对应位置)是空格
        if (targetWord[currentVal.length] === ' ') {
            currentVal += ' '; // 自动追加空格
            this.value = currentVal; // 更新输入框
        }
    }
    
    // 3. 强制光标移动到最后 (解决手机端输入反转问题)
    // 手机端光标容易跳回0，这里强制设为 value.length
    try {
        this.setSelectionRange(currentVal.length, currentVal.length);
    } catch (err) {
        // 部分旧浏览器可能不支持，忽略错误
    }

    // 4. 同步更新下划线显示
    const allSlots = slotsContainer.children;
    for (let i = 0; i < allSlots.length; i++) {
        const slot = allSlots[i];
        
        // 确保只处理字符格子，跳过空格格子
        if (slot.classList.contains('char-slot')) {
            const inputChar = currentVal[i] || ''; // 获取对应位置字符
            
            // 显示小写 (如果你想强制小写，可以用 .toLowerCase())
            slot.textContent = inputChar; 
            
            // 样式处理：光标位置高亮
            if (i === currentVal.length) {
                slot.classList.add('active');
            } else {
                slot.classList.remove('active');
            }
        }
    }
});


// --- 📝 检查答案 ---
function checkTyping() {
    const correctWord = wordList[currentWordIndex].word.toLowerCase().trim();
    const userAnswer = userInput.value.toLowerCase().trim();

    if (userAnswer === correctWord) {
        // --- 答对了 ---
        feedbackMessage.textContent = "✨ 答对啦！太棒了！ ✨";
        feedbackMessage.className = 'feedback correct';
        
        if (isExamMode) {
            // 答对后，把下划线换成正确的绿色单词显示
            renderSlots(); // 刷新一下布局
            const allSlots = slotsContainer.children;
            
            // 填满正确答案并变绿
            for(let i=0; i<allSlots.length; i++) {
                if(allSlots[i].classList.contains('char-slot')) {
                   allSlots[i].textContent = correctWord[i]; // 显示正确字母
                   allSlots[i].style.borderColor = '#66bb6a';
                   allSlots[i].style.color = '#66bb6a';
                }
            }
            
            phoneticsEl.style.visibility = 'visible';
            playAudioBtn.style.visibility = 'visible';
            playAudio();
        } else {
            playAudio();
        }
        
        setTimeout(() => {
            handleKnow();
        }, 1200);
        
    } else {
        // --- 答错了 ---
        feedbackMessage.textContent = "💨 不对哦，再试一次！";
        feedbackMessage.className = 'feedback incorrect';
        
        if(isExamMode) {
             const slots = slotsContainer.querySelectorAll('.char-slot');
             slots.forEach(s => s.style.borderColor = '#ef5350');
             setTimeout(() => {
                 slots.forEach(s => s.style.borderColor = '');
             }, 500);
        }
        userInput.focus();
    }
}

// --- 核心逻辑：加载单词 ---
function loadWord() {
    userInput.value = '';
    feedbackMessage.textContent = '';
    feedbackMessage.className = 'feedback';
    
    if (unlearnedIndices.length === 0) {
        finishLearning();
        return;
    }
    
    learningControls.classList.remove('hidden');
    typingSection.classList.remove('hidden');
    resetBtn.classList.add('hidden');

    const currentWordData = wordList[currentWordIndex];

    // 更新共有内容
    chineseDefinitionEl.textContent = currentWordData.chinese;
    exampleSentenceEl.textContent = currentWordData.example;
    
    const learnedCount = totalWords - unlearnedIndices.length;
    progressInfoEl.textContent = `🐹 进度: ${learnedCount} / ${totalWords} (剩余: ${unlearnedIndices.length})`;

    if (isExamMode) {
        // 📝 考试模式逻辑
        currentWordEl.style.display = 'none';
        
        // 显示下划线
        slotsContainer.classList.remove('hidden');
        renderSlots();

        // 隐藏音标和音频
        phoneticsEl.style.visibility = 'hidden';
        playAudioBtn.style.visibility = 'hidden';

        // 显示中文，隐藏例句和反馈按钮
        definitionSectionEl.classList.remove('hidden');
        exampleBox.classList.add('hidden');
        feedbackBtns.classList.add('hidden');
        
        // 自动聚焦输入框
        setTimeout(() => {
            userInput.focus();
            // 强制光标归零
            userInput.setSelectionRange(0, 0); 
        }, 100);

    } else {
        // 📚 学习模式逻辑
        currentWordEl.style.display = 'block';
        currentWordEl.textContent = currentWordData.word;
        phoneticsEl.textContent = currentWordData.phonetics;
        
        slotsContainer.classList.add('hidden');

        phoneticsEl.style.visibility = 'visible';
        playAudioBtn.style.visibility = 'visible';
        definitionSectionEl.classList.add('hidden');
        exampleBox.classList.remove('hidden');
        feedbackBtns.classList.remove('hidden');
    }
}

function finishLearning() {
    currentWordEl.style.display = 'block';
    currentWordEl.textContent = "🎉 通关！";
    slotsContainer.classList.add('hidden');
    phoneticsEl.textContent = "所有单词都消灭啦！";
    definitionSectionEl.classList.add('hidden');
    learningControls.classList.add('hidden');
    typingSection.classList.add('hidden');
    playAudioBtn.classList.add('hidden');
    resetBtn.classList.remove('hidden');
    progressInfoEl.textContent = "100%";
}

function nextRandomWord() {
    if (unlearnedIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * unlearnedIndices.length);
        currentWordIndex = unlearnedIndices[randomIndex];
    }
    loadWord();
}

function toggleDefinition() {
    if (isExamMode) {
        // 放弃：显示答案
        currentWordEl.style.display = 'block';
        currentWordEl.textContent = wordList[currentWordIndex].word;
        slotsContainer.classList.add('hidden');
        phoneticsEl.style.visibility = 'visible';
        playAudioBtn.style.visibility = 'visible';
        feedbackMessage.textContent = "下次一定行！";
        
        setTimeout(() => {
            handleDontKnow();
        }, 2000);
    } else {
        definitionSectionEl.classList.toggle('hidden');
    }
}

function handleKnow() {
    if (unlearnedIndices.length > 0) {
        const indexToRemove = unlearnedIndices.indexOf(currentWordIndex);
        if (indexToRemove > -1) {
            unlearnedIndices.splice(indexToRemove, 1);
        }
    }
    nextRandomWord();
}

function handleDontKnow() {
    if (!isExamMode) {
        definitionSectionEl.classList.remove('hidden');
    }
    nextRandomWord();
}

function resetLearning() {
    unlearnedIndices = Array.from(Array(totalWords).keys());
    const randomIndex = Math.floor(Math.random() * unlearnedIndices.length);
    currentWordIndex = unlearnedIndices[randomIndex];
    loadWord();
}

// 事件监听
modeToggleBtn.addEventListener('click', toggleMode);
showHideBtn.addEventListener('click', toggleDefinition);
knowBtn.addEventListener('click', handleKnow);
dontKnowBtn.addEventListener('click', handleDontKnow);
resetBtn.addEventListener('click', resetLearning);
playAudioBtn.addEventListener('click', playAudio);
checkBtn.addEventListener('click', checkTyping);

userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkTyping();
    }
});

// 点击下划线区域也能聚焦输入框
slotsContainer.addEventListener('click', () => {
    userInput.focus();
});

document.addEventListener('DOMContentLoaded', () => {
    const randomIndex = Math.floor(Math.random() * unlearnedIndices.length);
    currentWordIndex = unlearnedIndices[randomIndex];
    loadWord();
});
