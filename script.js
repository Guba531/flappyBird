const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('resetBtn');
const startBtn = document.getElementById('startBtn');
const score = document.getElementById('scores');
const records = document.getElementById('records');

let jogoAtivo = false;
let points = 0;
let record = localStorage.getItem('records')||0;
records.textContent=record;

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

const bird={
    width: 50,
    height: 50,
    jump: -3,
    fall: 0.5,
    birdSpeed: 0,
    rotate: 0,
    x: 50,
    y: canvas.height / 2,
}

let pipe=[];
const pipeDistance = 250;
const pipeHeight = 20;
const pipeHeightDistance = 100;
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

    ctx.translate(bird.x + bird.width/2, bird.y + bird.height/2);
    ctx.rotate(bird.rotate * Math.PI / 180);

    if (img.bird.complete) {
        ctx.drawImage(
        img.bird,
        -bird.width/2,
        -bird.height/2,
        bird.width,
        bird.height
    );
} else {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-bird.width/2, -bird.height/2, bird.width, bird.height);
   }

   ctx.restore();

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
    drawBird();
    requestAnimationFrame(desenharTelaInicial);
}
