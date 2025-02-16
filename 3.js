const words = [
    { french: "une heure", chinese: "小时" },
    { french: "Quelle heure est-il ?", chinese: "几点了？" },
    { french: "Excusez-moi.", chinese: "请原谅。" },
    { french: "Madame", chinese: "女士" },
    { french: "Mademoiselle", chinese: "小姐" },
    { french: "Dix", chinese: "十" },
    { french: "Déjà", chinese: "已经" },
    { french: "Avoir", chinese: "有" },
    { french: "Qui", chinese: "谁" },
    { french: "Chez", chinese: "在……家" },
    { french: "Mais", chinese: "但是" },
    { french: "Une valise", chinese: "行李箱" },
    { french: "Une chemise", chinese: "衬衣" },
    { french: "Où vas-tu ?", chinese: "你去哪？" },
    { french: "Une piscine", chinese: "游泳池" },
    { french: "Là-bas", chinese: "在那" },
    { french: "Avec", chinese: "和……一起" },
    { french: "Une gare", chinese: "火车站" },
    { french: "Pourquoi", chinese: "为什么" },
    { french: "une classe", chinese: "教室" },
    { french: "une tasse", chinese: "杯子" },
    { french: "une cassette", chinese: "磁带" },
    { french: "une revue", chinese: "杂志" },
    { french: "une casquette", chinese: "帽子" },
    { french: "un mur", chinese: "墙" },
    { french: "un livre", chinese: "书" },
    { french: "un disque", chinese: "唱片" },
    { french: "un journal", chinese: "报纸" },
    { french: "un professeur", chinese: "老师" },
    { french: "un élève", chinese: "男学生" },
    { french: "une élève", chinese: "女学生" },
    { french: "une salle de lecture", chinese: "阅览室" },
    { french: "une place", chinese: "广场" },
    { french: "Midi", chinese: "中午12点" },
    { french: "le soir", chinese: "晚上" },
    { french: "Minuit", chinese: "午夜12点" }
];

let selectedWord = null;
let startTime = null;
let timerInterval = null;
let mistakes = 0;
let bestTime = localStorage.getItem('bestTime') || Infinity;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createWordElement(word, isFrench) {
    const div = document.createElement('div');
    div.className = 'word';
    div.textContent = isFrench ? word.french : word.chinese;
    div.addEventListener('click', () => handleWordClick(word, isFrench, div));
    return div;
}

function handleWordClick(word, isFrench, element) {
    if (isFrench) {
        if (selectedWord) {
            selectedWord.classList.remove('selected');
        }
        selectedWord = element;
        element.classList.add('selected');
    } else {
        if (selectedWord && selectedWord.textContent === word.french) {
            element.style.backgroundColor = '#8BC34A';
            selectedWord.style.backgroundColor = '#8BC34A';
            selectedWord.removeEventListener('click', handleWordClick);
            element.removeEventListener('click', handleWordClick);
            selectedWord = null;
            checkCompletion();
        } else {
            mistakes++;
            alert('配对错误，请重试！');
        }
    }
}

function checkCompletion() {
    const remainingWords = document.querySelectorAll('.word:not([style*="background-color: rgb(139, 195, 74)"])');
    if (remainingWords.length === 0) {
        clearInterval(timerInterval);
        const endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000;
        const minutes = Math.floor(timeTaken / 60);
        const seconds = Math.floor(timeTaken % 60);
        const resultText = `Félicitations ! 恭喜完成所有配对！😊\n错误次数: ${mistakes}\n完成时间: ${minutes}分${seconds}秒`;
        document.getElementById('result').textContent = resultText;

        if (timeTaken < bestTime) {
            bestTime = timeTaken;
            localStorage.setItem('bestTime', bestTime);
        }

        document.getElementById('share-button').addEventListener('click', () => {
            const bestTimeMinutes = Math.floor(bestTime / 60);
            const bestTimeSeconds = Math.floor(bestTime % 60);
            const shareText = `单词消消乐成绩:\n错误次数: ${mistakes}\n完成时间: ${minutes}分${seconds}秒\n最佳成绩: ${bestTimeMinutes}分${bestTimeSeconds}秒`;
            alert(shareText);
        });
    }
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        document.getElementById('timer').textContent = `时间: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function initGame() {
    shuffleArray(words);
    const frenchWordsDiv = document.getElementById('french-words');
    const chineseMeaningsDiv = document.getElementById('chinese-meanings');

    words.forEach(word => {
        frenchWordsDiv.appendChild(createWordElement(word, true));
        chineseMeaningsDiv.appendChild(createWordElement(word, false));
    });

    startTimer();
}

initGame();