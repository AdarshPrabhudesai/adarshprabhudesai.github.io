// === Canvas-Based Background Animation ===
const neuronCanvas = document.getElementById('neuron-canvas');
const neuronCtx = neuronCanvas.getContext('2d');
neuronCanvas.width = window.innerWidth;
neuronCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    neuronCanvas.width = window.innerWidth;
    neuronCanvas.height = window.innerHeight;
});

const formulas = [
    'J(θ) = (1/2m) Σ (h_θ(xᵢ) - yᵢ)²',                            // Linear regression cost
    'h_θ(x) = 1 / (1 + e^(−θᵀx))',                                // Logistic regression
    'L = -Σ y log(ŷ) + (1 - y) log(1 - ŷ)',                        // Binary cross-entropy
    'y = Wx + b',                                                  // Linear transformation
    'a = ReLU(z) = max(0, z)',                                     // ReLU activation
    '∇J(θ) = (1/m) Xᵀ(h_θ(X) - y)',                                // Gradient of cost
    'H(X) = -Σ p(x) log p(x)',                                     // Entropy
    'r = ln(P_t / P_{t-1})',                                       // Log return
    'σ² = Σ (rᵢ - μ)² / (n - 1)',                                  // Variance of returns
    'S_t = S_0 e^{(μ - σ²/2)t + σW_t}',                            // GBM (Black-Scholes)
    'P = Σ [C_t / (1 + r)^t]',                                     // Present value
    'VaR_α = μ + z_α * σ',                                         // Value at Risk (normal)
    'Sharpe = (R_p - R_f) / σ_p',                                  // Sharpe ratio
    'β = Cov(R_i, R_m) / Var(R_m)',                                // CAPM beta
    'Δ = ∂V/∂S',                                                   // Option delta
    'L = Σ (xᵢ - μ)² / σ²',
];

const neurons = [];
const movingFormulas = [];

function createCanvasNeuron() {
    return {
        x: Math.random() * neuronCanvas.width,
        y: Math.random() * neuronCanvas.height,
        radius: 2 + Math.random() * 2,
        opacity: 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
    };
}

function createFormulaObject() {
    const text = formulas[Math.floor(Math.random() * formulas.length)];
    const x = Math.random() * neuronCanvas.width;
    const y = -20;
    return { text, x, y, speed: 0.3 + Math.random() * 0.5 };
}

for (let i = 0; i < 60; i++) {
    neurons.push(createCanvasNeuron());
}

function draw() {
    neuronCtx.clearRect(0, 0, neuronCanvas.width, neuronCanvas.height);

    neurons.forEach(n => {
        neuronCtx.beginPath();
        neuronCtx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        neuronCtx.fillStyle = `rgba(255, 215, 0, ${n.opacity})`;
        neuronCtx.shadowColor = '#ffd700';
        neuronCtx.shadowBlur = 15;
        neuronCtx.fill();
        neuronCtx.shadowBlur = 0;

        n.x += n.dx;
        n.y += n.dy;

        if (n.x < 0 || n.x > neuronCanvas.width) n.dx *= -1;
        if (n.y < 0 || n.y > neuronCanvas.height) n.dy *= -1;
    });

    for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
            const a = neurons[i];
            const b = neurons[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                neuronCtx.beginPath();
                neuronCtx.moveTo(a.x, a.y);
                neuronCtx.lineTo(b.x, b.y);
                neuronCtx.strokeStyle = 'rgba(255, 217, 0, 0.22)';
                neuronCtx.stroke();
            }
        }
    }

    movingFormulas.forEach(f => {
        neuronCtx.font = '16px monospace';
        neuronCtx.fillStyle = 'rgba(100, 255, 218, 0.7)';
        neuronCtx.fillText(f.text, f.x, f.y);
        f.y += f.speed;
    });

    for (let i = movingFormulas.length - 1; i >= 0; i--) {
        if (movingFormulas[i].y > neuronCanvas.height + 50) {
            movingFormulas.splice(i, 1);
        }
    }

    requestAnimationFrame(draw);
}

setInterval(() => {
    if (movingFormulas.length < 10) {
        movingFormulas.push(createFormulaObject());
    }
}, 2500);

draw();

// === Math Challenge Game ===
const gameDisplay = document.getElementById('game-display');
const startGameBtn = document.getElementById('start-game');
const answerBtn = document.getElementById('answer-btn');
const answerInput = document.getElementById('answer-input');
const gameScore = document.getElementById('game-score');

let currentAnswer = 0;
let score = 0;

if (startGameBtn && answerBtn && answerInput) {
    startGameBtn.addEventListener('click', () => startGame());
    answerBtn.addEventListener('click', () => checkAnswer());
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
}

function startGame() {
    startGameBtn.textContent = 'New Problem';
    answerInput.style.display = 'block';
    answerBtn.disabled = false;
    generateProblem();
}

function generateProblem() {
    const operations = ['+', '-', '*'];
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = operations[Math.floor(Math.random() * operations.length)];
    gameDisplay.textContent = `${num1} ${operation} ${num2} = ?`;
    currentAnswer = eval(`${num1}${operation}${num2}`);
    answerInput.value = '';
    answerInput.focus();
}

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === currentAnswer) {
        score++;
        gameScore.textContent = `Score: ${score}`;
        gameDisplay.textContent = "Correct! 🎉";
        setTimeout(generateProblem, 1000);
    } else {
        gameDisplay.textContent = `Wrong! Correct answer: ${currentAnswer}`;
        setTimeout(generateProblem, 2000);
    }
}

// === Captcha Game ===
const checkbox = document.getElementById('captcha-checkbox');
const challenge = document.getElementById('robot-challenge');
const targetBox = document.getElementById('target-box');
const result = document.getElementById('robot-result');

checkbox?.addEventListener('change', () => {
    if (checkbox.checked) {
        challenge.style.display = 'block';

        setTimeout(() => {
            result.textContent = "⏱️ Too slow. Try again.";
            result.style.color = "orange";
        }, 3000);
    }
});

targetBox?.addEventListener('click', (e) => {
    const rect = targetBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dist = Math.hypot(centerX - x, centerY - y);

    if (dist > 3   ) {
        result.textContent = "❌ Missed. Try again.";
        result.style.color = "red";
    } else {
        result.textContent = "✅ Correct you are a robot!";
        result.style.color = "limegreen";
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // === Utility Function ===
    function getCanvasCoords(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    // === Regression Game ===
    const regressionCanvas = document.getElementById('regression-canvas');
    const regressionResult = document.getElementById('regression-result');
    const resetBtn = document.getElementById('regression-clear');

    if (regressionCanvas && regressionResult && resetBtn) {
        const ctx = regressionCanvas.getContext('2d');
        const data = Array.from({ length: 30 }, (_, i) => {
            const x = i + 1;
            const noise = (Math.random() - 0.5) * 5;
            const y = 2 * x + 5 + noise;
            return { x, y };
        });

        function drawPoints() {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.clearRect(0, 0, regressionCanvas.width, regressionCanvas.height);
            ctx.fillStyle = '#ff6b6b';
            data.forEach(pt => {
                ctx.beginPath();
                ctx.arc(pt.x * 15, regressionCanvas.height - pt.y * 5, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        let userLine = [];

        function startRegressionDraw(e) {
            userLine = [getCanvasCoords(e, regressionCanvas)];
        }

        function endRegressionDraw(e) {
            userLine.push(getCanvasCoords(e, regressionCanvas));

            if (userLine.length === 2) {
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(userLine[0].x, userLine[0].y);
                ctx.lineTo(userLine[1].x, userLine[1].y);
                ctx.stroke();
                evaluateLine();
            }
        }

        function evaluateLine() {
            const [p1, p2] = userLine;
            const m = (p2.y - p1.y) / (p2.x - p1.x);
            const c = p1.y - m * p1.x;

            let mse = 0;
            data.forEach(pt => {
                const px = pt.x * 15;
                const trueY = regressionCanvas.height - pt.y * 5;
                const predictedY = m * px + c;
                mse += Math.pow(trueY - predictedY, 2);
            });
            mse = (mse / data.length).toFixed(2);

            regressionResult.textContent = `📉 MSE from true line: ${mse} (lower is better)`;
        }

        resetBtn.addEventListener('click', () => {
            userLine = [];
            drawPoints();
            regressionResult.textContent = '';
        });

        // Mouse events
        regressionCanvas.addEventListener('mousedown', startRegressionDraw);
        regressionCanvas.addEventListener('mouseup', endRegressionDraw);
        // Touch events
        regressionCanvas.addEventListener('touchstart', e => {
            startRegressionDraw(e);
            e.preventDefault();
        });
        regressionCanvas.addEventListener('touchend', e => {
            endRegressionDraw(e);
            e.preventDefault();
        });

        drawPoints();
    }

    // === Classification Game ===
    const canvas = document.getElementById('classification-canvas');
    const classificationResult = document.getElementById('classification-result');
    const classificationReset = document.getElementById('classification-clear');

    const ctx = canvas.getContext('2d');
    const points = Array.from({ length: 70 }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const dx = x - 150, dy = y - 150;
        const label = Math.sqrt(dx * dx + dy * dy) < 100 ? '#ff6b6b' : '#0AF71C';
        return { x, y, label };
    });

    function drawClassificationPoints() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = p.label;
            ctx.fill();
        });
    }

    let freeformPath = new Path2D();
    let isDrawing = false;

    function startFreeformDraw(e) {
        const { x, y } = getCanvasCoords(e, canvas);
        freeformPath = new Path2D();
        freeformPath.moveTo(x, y);
        isDrawing = true;
    }

    function continueFreeformDraw(e) {
        if (!isDrawing) return;
        const { x, y } = getCanvasCoords(e, canvas);
        freeformPath.lineTo(x, y);
        drawClassificationPoints();
        ctx.strokeStyle = 'yellow';
        ctx.stroke(freeformPath);
    }

    function endFreeformDraw() {
        isDrawing = false;
        ctx.strokeStyle = 'yellow';
        ctx.stroke(freeformPath);
        evaluateFreeform(freeformPath);
    }

    function evaluateFreeform(path) {
        let correct = 0;
        points.forEach(pt => {
            const predicted = ctx.isPointInPath(path, pt.x, pt.y) ? '#ff6b6b' : '#0AF71C';
            if (predicted === pt.label) correct++;
        });
        classificationResult.textContent = `🧠 Accuracy: ${(correct / points.length * 100).toFixed(1)}%`;
    }

    classificationReset.addEventListener('click', () => {
        drawClassificationPoints();
        freeformPath = new Path2D();
        classificationResult.textContent = '';
    });

    // Mouse events
    canvas.addEventListener('mousedown', startFreeformDraw);
    canvas.addEventListener('mousemove', continueFreeformDraw);
    canvas.addEventListener('mouseup', endFreeformDraw);

    // Touch events
    canvas.addEventListener('touchstart', e => {
        startFreeformDraw(e);
        e.preventDefault();
    });
    canvas.addEventListener('touchmove', e => {
        continueFreeformDraw(e);
        e.preventDefault();
    });
    canvas.addEventListener('touchend', e => {
        endFreeformDraw(e);
        e.preventDefault();
    });

    drawClassificationPoints();
});
