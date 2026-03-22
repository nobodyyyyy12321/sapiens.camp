<?php
// 支援 URL 參數 subject=xxx 來載入不同題庫，預設 quote.json
$subject = $_GET['subject'] ?? 'quote';
$json_file = $subject . '.json';
if (!file_exists($json_file)) {
    die('題庫不存在');
}
$json_data = file_get_contents($json_file);
$questions_all = json_decode($json_data, true);
shuffle($questions_all);
$questions = $questions_all;
?>
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo ($subject === 'english') ? '2000單' : '測驗'; ?> - 智人題庫</title>
    <link rel="stylesheet" href="theme.css">
    <link rel="icon" type="image/png" href="favicon.png">
    <style>
        body { background-color: var(--bg); margin: 0; font-family: 'Noto Serif TC', serif; color: var(--fg); transition: background 0.3s, color 0.3s; overflow: hidden; }
        .container { max-width: 800px; margin: 60px auto; padding: 20px; position: relative; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .header-left .brand { font-size: 2rem; font-weight: 500; margin: 0; color: var(--fg); font-family: 'Noto Serif TC', serif; }
        .header-left .qid { font-size: 0.95rem; color: var(--subtitle); margin: 8px 0 0 0; }
        .header-right { display: flex; gap: 12px; align-items: center; }
        .nav-circle-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border); background: var(--btn-bg); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 1.3rem; color: var(--fg); font-family: 'Inter', 'Noto Serif TC', serif; }
        .nav-circle-btn:hover { background: var(--btn-hover-bg); border-color: var(--btn-hover-border); }
        .submit-btn { padding: 8px 18px; border-radius: 20px; border: 1px solid var(--border); background: var(--btn-bg); color: var(--fg); cursor: pointer; font-weight: bold; font-size: 0.95rem; transition: all 0.2s; font-family: 'Inter', 'Noto Serif TC', serif; }
        .submit-btn:hover { background: var(--btn-hover-bg); border-color: var(--btn-hover-border); }
        .word-card { background: var(--btn-bg); border: 1px solid var(--border); border-radius: 8px; padding: 25px 30px; margin-bottom: 25px; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.15); color: var(--fg); display: flex; align-items: center; min-height: 80px; box-sizing: border-box; }
        #word-text { font-size: 1.25rem; font-weight: 400; text-align: left; }
        .options-list { display: flex; flex-direction: column; gap: 14px; }
        .option-item { background: var(--btn-bg); border: 1px solid var(--border); border-radius: 6px; padding: 22px 30px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; font-size: 1.25rem; font-weight: 400; color: var(--fg); font-family: 'Inter', 'Noto Serif TC', serif; }
        .option-item.selected { border-color: var(--btn-hover-border); border-width: 1px; background: var(--btn-hover-bg); }
        .option-label { font-weight: 900; margin-right: 22px; width: 24px; }
        .result-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--bg); z-index: 100; flex-direction: column; align-items: center; justify-content: flex-start; color: var(--fg); overflow: hidden; padding-bottom: 40px; }
        .result-overlay > h2, .result-overlay > #score-details, .result-overlay > #answer-details, .result-overlay > div[style*="margin-top: 25px"] { margin-top: 48px !important; }
        #answer-details { width: 100%; max-width: 700px; margin: 0 auto 20px auto; max-height: 60vh; overflow-y: auto; }
    </style>
</head>
<body>
    <a href="index.php" style="display:inline-block;width:48px;height:48px;background:transparent;position:absolute;top:12px;left:18px;z-index:20;">
        <img src="logo-removebg-preview.png" alt="logo" id="logo-img" style="width:60px;height:60px;display:block;margin:4px auto;background:transparent;border-radius:0;object-fit:contain;" />
    </a>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <h1 class="brand"><?php echo ($subject === 'english') ? '2000單' : '測驗'; ?></h1>
                <p class="qid" id="question-id">題號 0</p>
            </div>
            <div class="header-right">
                <button class="nav-circle-btn" id="prev-btn" title="鍵盤左鍵">←</button>
                <button class="nav-circle-btn" id="next-btn" title="鍵盤右鍵">→</button>
                <button class="submit-btn" id="submit-btn">交卷</button>
            </div>
        </div>
        <div class="word-card">
            <span id="word-text">Loading...</span>
        </div>
        <div class="options-list" id="options-list">
            <!-- Options will be injected here -->
        </div>
    </div>
    <div class="result-overlay" id="result-overlay">
        <a href="index.php" style="display:inline-block;width:48px;height:48px;background:transparent;position:absolute;top:12px;left:18px;z-index:120;">
            <img src="logo-removebg-preview.png" alt="logo" style="width:60px;height:60px;display:block;margin:4px auto;background:transparent;border-radius:0;object-fit:contain;" />
        </a>
        <h2 style="margin-top:72px;font-family:'Noto Serif TC',serif;">測驗結果</h2>
        <p id="score-details" style="font-size:1.5rem;font-weight:bold;margin:32px 0 0 0;font-family:'Noto Serif TC',serif;"> </p>
        <div id="answer-details"></div>
        <div style="margin-top: 25px; display: flex; justify-content: center;">
            <button class="submit-btn" style="font-family:'Noto Serif TC',serif;" onclick="location.reload()">再試一次</button>
        </div>
    </div>
    <script>
        const questions = <?php echo json_encode($questions); ?>;
        let currentIndex = 0;
        // userAnswers: 單選存字串，多選存陣列
        let userAnswers = questions.map(q => q.type === 'multi' ? [] : null);
        const wordText = document.getElementById('word-text');
        const questionId = document.getElementById('question-id');
        const optionsList = document.getElementById('options-list');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        function loadQuestion(index) {
            const q = questions[index];
            wordText.textContent = q.title;
            questionId.textContent = `題號 ${q.number}`;
            optionsList.innerHTML = '';
            // 將 options 物件轉為陣列 [{label, text}]
            const opts = Array.isArray(q.options) ? q.options : Object.entries(q.options).map(([label, text]) => ({ label, text }));
            if (q.type === 'multi') {
                for (const opt of opts) {
                    const item = document.createElement('div');
                    item.className = 'option-item' + (userAnswers[index].includes(opt.label) ? ' selected' : '');
                    item.innerHTML = `<span class=\"option-label\">${opt.label}</span> ${opt.text}`;
                    item.onclick = () => selectMultiOption(opt.label);
                    optionsList.appendChild(item);
                }
            } else {
                for (const opt of opts) {
                    const item = document.createElement('div');
                    item.className = 'option-item' + (userAnswers[index] === opt.label ? ' selected' : '');
                    item.innerHTML = `<span class=\"option-label\">${opt.label}</span> ${opt.text}`;
                    item.onclick = () => selectSingleOption(opt.label);
                    optionsList.appendChild(item);
                }
            }
        }
        function selectSingleOption(label) {
            userAnswers[currentIndex] = label;
            const items = optionsList.querySelectorAll('.option-item');
            const options = questions[currentIndex].options.map(opt => opt.label);
            items.forEach((item, i) => {
                if (options[i] === label) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
            setTimeout(() => {
                if (currentIndex < questions.length - 1) {
                    currentIndex++;
                    loadQuestion(currentIndex);
                }
            }, 50);
        }
        function selectMultiOption(label) {
            const arr = userAnswers[currentIndex];
            const idx = arr.indexOf(label);
            if (idx === -1) arr.push(label); else arr.splice(idx, 1);
            loadQuestion(currentIndex);
        }
        function navigate(direction) {
            if (direction === 'next' && currentIndex < questions.length - 1) {
                currentIndex++;
                loadQuestion(currentIndex);
            } else if (direction === 'prev' && currentIndex > 0) {
                currentIndex--;
                loadQuestion(currentIndex);
            }
        }
        prevBtn.onclick = () => navigate('prev');
        nextBtn.onclick = () => navigate('next');
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') navigate('next');
            if (e.key === 'ArrowLeft') navigate('prev');
            let key = e.key.toUpperCase();
            // 支援 1/2/3/4 對應 A/B/C/D
            if (['1','2','3','4'].includes(key)) {
                key = String.fromCharCode('A'.charCodeAt(0) + parseInt(key) - 1);
            }
            if (questions[currentIndex].type === 'multi') {
                if (['A', 'B', 'C', 'D'].includes(key)) selectMultiOption(key);
            } else {
                if (['A', 'B', 'C', 'D'].includes(key)) selectSingleOption(key);
            }
        });
        submitBtn.onclick = () => {
            let correct = 0;
            let html = '';
            let answeredCount = 0;
            questions.forEach((q, i) => {
                const userAns = userAnswers[i];
                if (q.type === 'multi') {
                    if (!userAns.length) return;
                    answeredCount++;
                    const isCorrect = Array.isArray(q.answer) && q.answer.length === userAns.length && q.answer.every(a => userAns.includes(a));
                    if (isCorrect) correct++;
                    let userAnsText = userAns.map(l => `${l} ${(q.options.find(opt => opt.label === l) || {}).text || ''}`).join(', ');
                    if (isCorrect) {
                        html += `<div style=\"border:2px solid #1a4d1a;background:#1a4d1a;margin-bottom:18px;border-radius:10px;padding:12px 18px;\">
                            <div style=\"font-weight:bold;font-size:1.1rem;margin-bottom:4px;\">題號${q.number}: ${q.title}</div>
                            <div style=\"margin-bottom:2px;\">你的答案：<span style=\"background:#388e3c;color:#fff;padding:2px 8px;border-radius:6px;\">${userAnsText}</span></div>
                        </div>`;
                    } else {
                        let correctAnsText = q.answer.map(l => `${l} ${(q.options.find(opt => opt.label === l) || {}).text || ''}`).join(', ');
                        html += `<div style=\"border:2px solid #a00;background:#220a0a;margin-bottom:18px;border-radius:10px;padding:12px 18px;\">
                            <div style=\"font-weight:bold;font-size:1.1rem;margin-bottom:4px;\">題號${q.number}: ${q.title}</div>
                            <div style=\"margin-bottom:2px;\">你的答案：<span style=\"background:#a00;color:#fff;padding:2px 8px;border-radius:6px;\">${userAnsText}</span></div>
                            <div>正確答案：<span style=\"background:#1a4d1a;color:#fff;padding:2px 8px;border-radius:6px;\">${correctAnsText}</span></div>
                        </div>`;
                    }
                } else {
                    if (!userAns) return;
                    answeredCount++;
                    const isCorrect = userAns === q.answer;
                    if (isCorrect) correct++;
                    let userAnsText = `${userAns} ${(q.options.find(opt => opt.label === userAns) || {}).text || ''}`;
                    if (isCorrect) {
                        html += `<div style=\"border:2px solid #1a4d1a;background:#1a4d1a;margin-bottom:18px;border-radius:10px;padding:12px 18px;\">
                            <div style=\"font-weight:bold;font-size:1.1rem;margin-bottom:4px;\">題號${q.number}: ${q.title}</div>
                            <div style=\"margin-bottom:2px;\">你的答案：<span style=\"background:#388e3c;color:#fff;padding:2px 8px;border-radius:6px;\">${userAnsText}</span></div>
                        </div>`;
                    } else {
                        let correctAnsText = `${q.answer} ${(q.options.find(opt => opt.label === q.answer) || {}).text || ''}`;
                        html += `<div style=\"border:2px solid #a00;background:#220a0a;margin-bottom:18px;border-radius:10px;padding:12px 18px;\">
                            <div style=\"font-weight:bold;font-size:1.1rem;margin-bottom:4px;\">題號${q.number}: ${q.title}</div>
                            <div style=\"margin-bottom:2px;\">你的答案：<span style=\"background:#a00;color:#fff;padding:2px 8px;border-radius:6px;\">${userAnsText}</span></div>
                            <div>正確答案：<span style=\"background:#1a4d1a;color:#fff;padding:2px 8px;border-radius:6px;\">${correctAnsText}</span></div>
                        </div>`;
                    }
                }
            });
            document.getElementById('answer-details').innerHTML = html;
            document.getElementById('score-details').textContent = `對 ${correct} 題 / 寫 ${answeredCount} 題`;
            document.getElementById('result-overlay').style.display = 'flex';
        };
        if (localStorage.getItem('themeMode') === 'light') {
            document.body.classList.add('light');
        }
        loadQuestion(0);
        // Set logo color based on mode
        const logoImg = document.getElementById('logo-img');
        if (document.body.classList.contains('light')) {
            logoImg.style.filter = 'invert(0) brightness(0)';
        }
    </script>
</body>
</html>
