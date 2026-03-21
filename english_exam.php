<?php
// Load english.json
$json_data = file_get_contents('english.json');
$questions_all = json_decode($json_data, true);

// Select 10 random questions for the test session
shuffle($questions_all);
$questions = array_slice($questions_all, 0, 10);
?>
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>英文 - 智人題庫</title>
    <link rel="stylesheet" href="theme.css">
    <style>
        body {
            background-color: var(--bg);
            margin: 0;
            font-family: 'Noto Sans TC', Arial, sans-serif;
            color: var(--fg);
            transition: background 0.3s, color 0.3s;
        }

        .container {
            max-width: 800px;
            margin: 60px auto;
            padding: 20px;
            position: relative;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .header-left .brand {
            font-size: 2rem;
            font-weight: bold;
            margin: 0;
            color: var(--fg);
        }

        .header-left .qid {
            font-size: 0.95rem;
            color: var(--subtitle);
            margin: 8px 0 0 0;
        }

        .header-right {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .nav-circle-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid var(--border);
            background: var(--btn-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 1.3rem;
            color: var(--fg);
        }
        
        .nav-circle-btn:hover {
            background: var(--btn-hover-bg);
            border-color: var(--btn-hover-border);
        }

        .submit-btn {
            padding: 8px 18px;
            border-radius: 20px;
            border: 1px solid var(--border);
            background: var(--btn-bg);
            color: var(--fg);
            cursor: pointer;
            font-weight: bold;
            font-size: 0.95rem;
            transition: all 0.2s;
        }

        .submit-btn:hover {
            background: var(--btn-hover-bg);
            border-color: var(--btn-hover-border);
        }

        .word-card {
            background: var(--btn-bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 50px 40px;
            text-align: center;
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 25px;
            position: relative;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            color: var(--fg);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .speaker-icon {
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            width: 24px;
            height: 24px;
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s;
            filter: var(--speaker-filter);
        }

        .speaker-icon:hover {
            opacity: 1;
        }

        .options-list {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .option-item {
            background: var(--btn-bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 18px 25px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            font-size: 1.15rem;
            color: var(--fg);
        }

        .option-item.selected {
            border-color: var(--btn-hover-border);
            border-width: 2px;
            padding: 17px 24px;
            background: var(--btn-hover-bg);
        }

        .option-label {
            font-weight: bold;
            margin-right: 18px;
            width: 20px;
        }

        .result-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: var(--bg);
            z-index: 100;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--fg);
        }

        .score-circle {
            width: 160px;
            height: 160px;
            border-radius: 50%;
            border: 12px solid var(--btn-hover-border);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3.5rem;
            font-weight: 900;
            margin-bottom: 25px;
        }

        @media (max-width: 600px) {
            .container { margin: 30px auto; padding: 15px; }
            .word-card { font-size: 2rem; padding: 40px 20px; }
            .option-item { font-size: 1rem; padding: 14px 20px; }
            .option-item.selected { padding: 13px 19px; }
            .brand { font-size: 1.5rem; }
        }

        body:not(.light) {
            --speaker-filter: invert(1);
        }
        body.light {
            --speaker-filter: none;
        }
    </style>
</head>
<body>
    <a href="index.php" style="display:inline-block;width:48px;height:48px;background:transparent;position:absolute;top:12px;left:18px;z-index:20;">
        <img src="logo-removebg-preview.png" alt="logo" id="logo-img" style="width:60px;height:60px;display:block;margin:4px auto;background:transparent;border-radius:0;object-fit:contain;" />
    </a>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <h1 class="brand">英文</h1>
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
            <img src="speaker.png" alt="Play" class="speaker-icon" id="speaker-btn">
        </div>

        <div class="options-list" id="options-list">
            <!-- Options will be injected here -->
        </div>
    </div>

    <div class="result-overlay" id="result-overlay">
        <h2>測驗成果</h2>
        <div class="score-circle" id="final-score">0</div>
        <p id="score-details"></p>
        <div style="margin-top: 25px; display: flex; gap: 15px;">
            <button class="submit-btn" onclick="location.reload()">再試一次</button>
            <a href="english.php" class="submit-btn" style="text-decoration:none;">返回</a>
        </div>
    </div>

    <script>
        const questions = <?php echo json_encode($questions); ?>;
        let currentIndex = 0;
        let userAnswers = new Array(questions.length).fill(null);

        const wordText = document.getElementById('word-text');
        const questionId = document.getElementById('question-id');
        const optionsList = document.getElementById('options-list');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        const speakerBtn = document.getElementById('speaker-btn');

        function loadQuestion(index) {
            const q = questions[index];
            wordText.textContent = q.title;
            questionId.textContent = `題號 ${q.number}`;

            optionsList.innerHTML = '';
            for (const [key, value] of Object.entries(q.options)) {
                const item = document.createElement('div');
                item.className = 'option-item' + (userAnswers[index] === key ? ' selected' : '');
                item.innerHTML = `<span class="option-label">${key}</span> ${value}`;
                item.onclick = () => selectOption(key);
                optionsList.appendChild(item);
            }
        }

        function selectOption(key) {
            userAnswers[currentIndex] = key;
            const items = optionsList.querySelectorAll('.option-item');
            const options = Object.keys(questions[currentIndex].options);
            items.forEach((item, i) => {
                if (options[i] === key) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });

            // Auto-jump to next question after a short delay
            setTimeout(() => {
                if (currentIndex < questions.length - 1) {
                    currentIndex++;
                    loadQuestion(currentIndex);
                }
            }, 400); // 400ms delay for visual feedback
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
            
            const key = e.key.toLowerCase();
            if (['a', 'b', 'c', 'd'].includes(key)) {
                selectOption(key.toUpperCase());
            } else if (['1', '2', '3', '4'].includes(key)) {
                const index = parseInt(key) - 1;
                const options = ['A', 'B', 'C', 'D'];
                selectOption(options[index]);
            }
        });

        speakerBtn.onclick = () => {
            const utterance = new SpeechSynthesisUtterance(questions[currentIndex].title);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        };

        submitBtn.onclick = () => {
            let correct = 0;
            questions.forEach((q, i) => {
                if (userAnswers[i] === q.answer) correct++;
            });
            const score = Math.round((correct / questions.length) * 100);
            document.getElementById('final-score').textContent = score;
            document.getElementById('score-details').textContent = `答對 ${correct} 題 / 共 ${questions.length} 題`;
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
