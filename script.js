const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('resetBtn');
const startBtn = document.getElementById('startBtn');

let jogoAtivo = false;

const img = {
    bird: new Image(), 
    pipe: new Image(),
    bg: new Image()
}

img.bird.src = "img/bird.png";
img.pipe.src = "img/cano.jpg";
img.bg.src = "img/fundo.png";

let fundoX = 0;
const speed = 1;

Object.values(img).forEach(img => {
    img.onload = () => {
        fundoX++;
        if(fundoX===speed){
            desenharTelaInicial();
        }
    }
});

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

function startGame() {
    gameStarted = true;
    startTime = Date.now();

    timerInterval = setInterval(updateTimer, 1000);
}

function renderizar() {
    bgLoop();
    if(jogoAtivo) {
        //atualizar();
        requestAnimationFrame(renderizar);
    }
}

function desenharTelaInicial(){
    bgLoop();
    requestAnimationFrame(desenharTelaInicial);
}
