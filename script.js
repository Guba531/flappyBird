const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('resetBtn');
const startBtn = document.getElementById('startBtn');
const score = document.getElementById('scores');
const records = document.getElementById('records');

let jogoAtivo = true;
let points = 0;
let record = localStorage.getItem('records') || 0;
records.textContent = record;

const img = {
    bird: new Image(),
    pipe: new Image(),
    bg: new Image()
}

img.bird.src = "img/bird.png";
img.pipe.src = "img/cano.png";
img.bg.src = "img/fundo.png";

let loadImg = 0;
const totalImg = 3;

Object.values(img).forEach(img => {
    img.onload = () => {
        loadImg++;
        if (loadImg===totalImg) {
            createPipe();
            renderizar();
        }
    }
});

let fundoX = 0;

const speed = 1;

const bird = {
    width: 50,
    height: 50,
    jump: -5,
    fall: 0.3,
    birdSpeed: 0,
    rotate: 0,
    x: 50,
    y: canvas.height / 2,
}

let pipe = [];
const pipeDistance = 640;
const pipeWidth = 60;
const pipeHeightDistance = 150;
let frameCount = 0;

function bgLoop() {
    if (img.bg.complete) {
        ctx.drawImage(img.bg, fundoX, 0, canvas.width, canvas.height);
        ctx.drawImage(img.bg, fundoX + canvas.width, 0, canvas.width, canvas.height);
        if (jogoAtivo) {
            fundoX -= speed;
            if (fundoX <= -canvas.width) {
                fundoX = 0;
            }
        }
    } else {
        ctx.fillStyle = "light-blue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawBird() {
    ctx.save();

    bird.rotate = Math.min(Math.max(bird.speed * 3, -25), 90);

    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate(bird.rotate * Math.PI / 180);

    if (img.bird.complete) {
        ctx.drawImage(
            img.bird,
            -bird.width / 2,
            -bird.height / 2,
            bird.width,
            bird.height
        );
    } else {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-bird.width / 2, -bird.height / 2, bird.width, bird.height);
    }

    ctx.restore();

}

function drawPipe() {
    pipe.forEach(p => {
        if (img.pipe.complete) {
            ctx.save();
            ctx.translate(p.x + pipeWidth / 2, p.top / 2);
            ctx.scale(1, -1);
            ctx.drawImage(
                img.pipe,
                -pipeWidth / 2,
                -p.top / 2,
                pipeWidth,
                p.top
            );
            ctx.restore();
            ctx.drawImage(
                img.pipe,
                p.x,
                p.bottom,
                pipeWidth,
                canvas.height - p.bottom
            );
        } else {
            // Fallback: retângulos verdes
            ctx.fillStyle = '#228B22';
            ctx.fillRect(p.x, 0, pipeWidth, p.top);
            ctx.fillRect(p.x, p.bottom, pipeWidth, canvas.height - p.bottom);
        }
    })
}

function createPipe() {
    const topHeight = Math.random() * (canvas.height - pipeHeightDistance - 100) + 100;
    const bottomY = topHeight + pipeHeightDistance;

    pipe.push({
        x: canvas.width,
        top: topHeight,
        bottom: bottomY,
        pass: false
    })

}

function atualizar() {
    if (!jogoAtivo) return;
    bird.birdSpeed += bird.fall;
    bird.y += bird.birdSpeed;

    pipe.forEach(pipe => {
        pipe.x -= 2;
        //contar pontos
    })
    pipe = pipe.filter(pipe => pipe.x + pipeWidth > 0);
    frameCount++;
    if (frameCount % 100 === 0) {
        createPipe();
    }

    collision();
}

function renderizar() {
    bgLoop();
    drawBird();
    drawPipe();
    if (jogoAtivo) {
        atualizar();
        requestAnimationFrame(renderizar);
    }
}

function desenharTelaInicial() {
    bgLoop();
    drawBird();
    drawPipe();
    requestAnimationFrame(desenharTelaInicial);
}

function jump() {
    bird.birdSpeed = bird.jump;
}

// 3. Adicione os ouvintes de eventos (Espaço e Clique)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); //Desativa o scroll do navegador
        jump();
    }
});

document.addEventListener('mousedown', jump);


function collision() {    
    if (bird.y <= 0 || bird.y + bird.height >= canvas.height) {
        gameOver();
        return;
    }
}

function gameOver() {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);

    ctx.fillStyle = 'black';
    ctx.font = 'bold 20px Jersey 10';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', canvas.height / 2, canvas.width / 2); 
}