// 游戏状态变量
let score = 0;
let remainingQuestions = 20;
let currentQuestionIndex = 0;
let questionBank = [];
let shuffledQuestions = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有DOM元素
    const scoreElement = document.getElementById('score');
    const remainingElement = document.getElementById('remaining');
    const instrumentImage = document.getElementById('instrument-image');
    const answerInput = document.getElementById('answer-input');
    const submitBtn = document.getElementById('submit-btn');
    const feedbackElement = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-btn');
    const gameContainer = document.getElementById('game-container');
    const resultScreen = document.getElementById('result-screen');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const restartBtn = document.getElementById('restart-btn');

    // 默认题库（png格式）- 修正后的正确图片路径
    const defaultQuestionBank = [
        { id: 1, name: '试管', image: '../../images/yiqi/shiguan.png' },
        { id: 2, name: '烧杯', image: '../../images/yiqi/shaobei.png' },
        { id: 3, name: '量筒', image: '../../images/yiqi/liangtong.png' },
        { id: 4, name: '酒精灯', image: '../../images/yiqi/jiujingdeng.png' },
        { id: 5, name: '普通漏斗', image: '../../images/yiqi/sloudou.png' },
        { id: 6, name: '玻璃棒', image: '../../images/yiqi/bolibang.png' },
        { id: 7, name: '托盘天平', image: '../../images/yiqi/tuopantianping.png' },
        { id: 8, name: '试管夹', image: '../../images/yiqi/shiguanjia.png' },
        { id: 9, name: '铁架台', image: '../../images/yiqi/tiejiatai.png' },
        { id: 10, name: '锥形瓶', image: '../../images/yiqi/zhuixingping.png' },
        { id: 11, name: '胶头滴管', image: '../../images/yiqi/jiaotoudiguan.png' },
        { id: 12, name: '蒸发皿', image: '../../images/yiqi/zhengfami.png' },
        { id: 13, name: '坩埚', image: '../../images/yiqi/ganguo.png' },
        { id: 14, name: '水槽', image: '../../images/yiqi/shuicao.png' },
        { id: 15, name: '球形冷凝管', image: '../../images/yiqi/qiuxinglengningguan.png' },
        { id: 16, name: '分液漏斗', image: '../../images/yiqi/fenyeloudou.png' },
        { id: 17, name: '直形冷凝管', image: '../../images/yiqi/zhixinglengningguan.png' },
        { id: 18, name: '长颈漏斗', image: '../../images/yiqi/changjingloudou.png' },
        { id: 19, name: '圆底烧瓶', image: '../../images/yiqi/yuandishaoping.png' },
        { id: 20, name: '酸式滴定管', image: '../../images/yiqi/suanshididingguan.png' },
        { id: 21, name: '三颈烧瓶', image: '../../images/yiqi/sanjingshaoping.png' },
        { id: 22, name: '容量瓶', image: '../../images/yiqi/rongliangping.png' },
        { id: 23, name: '圆底烧瓶', image: '../../images/yiqi/yuandishaoping.png' },
        { id: 24, name: '温度计', image: '../../images/yiqi/wenduji.png' },
        { id: 25, name: '碱式滴定管', image: '../../images/yiqi/jianshididingguan.png' },
        { id: 26, name: '干燥管', image: '../../images/yiqi/ganzaoguan.png' },
        { id: 27, name: '恒压滴液漏斗', image: '../../images/yiqi/hengyadiyeloudou.png' },
        { id: 28, name: '蒸馏烧瓶', image: '../../images/yiqi/zhengliushaoping.png' },
        { id: 29, name: '布氏漏斗', image: '../../images/yiqi/bushiloudou.png' },
        { id: 30, name: '抽滤瓶', image: '../../images/yiqi/choulvping.png' },
        { id: 31, name: '三脚架', image: '../../images/yiqi/sanjiaojia.png' },
        { id: 32, name: '泥三角', image: '../../images/yiqi/nisanjiao.png' }
    ];

    // 初始化游戏
    function initGame() {
        questionBank = defaultQuestionBank;
        shuffleQuestions();
        loadQuestion();
        
        // 绑定按钮事件
        submitBtn.onclick = function() { checkAnswer(); };
        nextBtn.onclick = function() { nextQuestion(); };
        restartBtn.onclick = restartGame;

        // ========== 新增：键盘事件绑定 ==========
        // 监听Enter键：提交答案 或 切换下一题
        document.addEventListener('keydown', function(e) {
            // 按下Enter键（keyCode 13 或 key 'Enter'）
            if (e.key === 'Enter' || e.keyCode === 13) {
                // 阻止默认行为（避免页面刷新）
                e.preventDefault();
                
                // 如果下一题按钮显示，则按Enter触发下一题
                if (nextBtn.style.display !== 'none') {
                    nextQuestion();
                } 
                // 否则触发提交答案（且提交按钮未禁用）
                else if (!submitBtn.disabled) {
                    checkAnswer();
                }
            }
        });
    }

    // 打乱题目顺序
    function shuffleQuestions() {
        shuffledQuestions = [...questionBank]
            .sort(() => Math.random() - 0.5)
            .slice(0, 20);
    }

    // 加载题目
    function loadQuestion() {
        if (currentQuestionIndex >= shuffledQuestions.length || remainingQuestions <= 0) {
            showResult();
            return;
        }
        
        const question = shuffledQuestions[currentQuestionIndex];
        instrumentImage.src = question.image;
        instrumentImage.alt = question.name;
        instrumentImage.onerror = function() {
            instrumentImage.src = '';
            instrumentImage.alt = '图片加载失败，请检查图片路径';
        };
        
        answerInput.value = '';
        answerInput.className = '';
        feedbackElement.textContent = '';
        feedbackElement.className = '';
        nextBtn.style.display = 'none';
        submitBtn.disabled = false;
        
        // 自动聚焦输入框，提升体验
        answerInput.focus();
    }

    // 检查答案
    function checkAnswer() {
        const userAnswer = answerInput.value.trim();
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        
        if (userAnswer === currentQuestion.name) {
            // 答案正确
            score += 8;
            scoreElement.textContent = score;
            answerInput.className = 'correct';
            feedbackElement.textContent = '回答正确！+8分';
            feedbackElement.className = 'correct';
        } else {
            // 答案错误
            answerInput.className = 'incorrect';
            feedbackElement.textContent = `回答错误！正确答案是：${currentQuestion.name}`;
            feedbackElement.className = 'incorrect';
        }
        
        submitBtn.disabled = true;
        nextBtn.style.display = 'block';
    }

    // 下一题
    function nextQuestion() {
        currentQuestionIndex++;
        remainingQuestions--;
        remainingElement.textContent = remainingQuestions;
        loadQuestion();
    }

    // 显示结果
    function showResult() {
        gameContainer.style.display = 'none';
        resultScreen.style.display = 'block';
        
        if (score >= 100) {
            resultTitle.textContent = '闯关成功！🎉';
            resultMessage.textContent = `恭喜你！你获得了 ${score} 分，成功完成了挑战。`;
        } else {
            resultTitle.textContent = '闯关失败！💔';
            resultMessage.textContent = `很遗憾，你获得了 ${score} 分，未达到 100 分的要求。`;
        }
    }

    // 重新开始游戏
    function restartGame() {
        // 重置所有状态
        score = 0;
        remainingQuestions = 20;
        currentQuestionIndex = 0;
        scoreElement.textContent = score;
        remainingElement.textContent = remainingQuestions;
        
        // 重新打乱题目
        shuffleQuestions();
        
        // 显示游戏界面，隐藏结果界面
        gameContainer.style.display = 'block';
        resultScreen.style.display = 'none';
        
        // 加载新的第一题
        loadQuestion();
    }

    // 启动游戏
    initGame();
});