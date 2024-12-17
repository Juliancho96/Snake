const playBoard = document.querySelector(".play-board");
const comida = document.querySelector(".comida");
const serpiente = document.querySelector(".serpiente");
const contadorTexto = document.querySelector(".score");
const contadorMaximoTexto = document.querySelector(".high-score");
const contenedorGameOver = document.querySelector(".game-over");
const continuar = document.querySelector(".continue")
const contenedorPlayBoard = document.querySelector(".wrapper")
const shade = document.querySelector(".shade");



let gameOver = false;
let filas = 20;
let columnas = 20;
let velocityX = 0;
let velocityY = 0;
let contadorComida = 0;
let contadorMaximo = localStorage.getItem("high-score") || 0;
let cuerpoSerpiente = [];
let frutaX, frutaY;
let
    serpienteX = Math.floor(columnas / 2) + 1,
    serpienteY = Math.floor(filas / 2) + 1
    ;
let setIntervalId;

playBoard.style.gridTemplate = `repeat(${filas}, 1fr) / repeat(${columnas}, 1fr)`;
contadorMaximoTexto.textContent = "High score: " + contadorMaximo;


const hangGameOver = function () {
    clearInterval(setIntervalId);
    contenedorGameOver.style.display = "flex";
    contenedorGameOver.classList.add("movimiento-gameover")
    contenedorPlayBoard.classList.add("shakeDeath")
    shade.classList.add("shade-appearing")
}


const cambiarDireccion = function (event) {
    if (event.repeat) return;

    if (event.key === "w" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (event.key === "s" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (event.key === "a" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (event.key === "d" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
    
    iniciarJuego();
}

const cambiarPosicionFruta = function () {
    frutaX = Math.floor(Math.random() * filas + 1);
    frutaY = Math.floor(Math.random() * columnas + 1); 
}

const comerFruta = function () {
    
}

const iniciarJuego = function () {
    if (gameOver) return hangGameOver();
    let htmlMarkup = colorGrid();
    htmlMarkup += `<div class="comida" style="grid-area: ${frutaY} / ${frutaX}"></div>`; 
    
    serpienteX += velocityX;
    serpienteY += velocityY;
    
    for (let i = cuerpoSerpiente.length - 1; i > 0; i--) {
        cuerpoSerpiente[i] = cuerpoSerpiente[i - 1]
    }
    
    cuerpoSerpiente[0] = [serpienteX, serpienteY];
    
    for (let i = 0; i < cuerpoSerpiente.length; i++) {
        htmlMarkup += `<div class="serpiente" style="grid-area: ${cuerpoSerpiente[i][1]} / ${cuerpoSerpiente[i][0]}"></div>`;
        if (i !== 0 && cuerpoSerpiente[0][1] === cuerpoSerpiente[i][1] && cuerpoSerpiente[0][0] === cuerpoSerpiente[i][0]) {
            gameOver = true;
        }
    }
    
    if (serpienteX >= filas + 1 || serpienteX <= 0 || serpienteY >= columnas + 1 || serpienteY <= 0) {
        gameOver = true;
    }
    
    if (frutaX === serpienteX && frutaY === serpienteY) {
        cambiarPosicionFruta();
        contadorComida++;
        contadorTexto.textContent = "Score: " + contadorComida;
        cuerpoSerpiente.push([frutaX, frutaY]);
        contadorMaximo = contadorComida >= contadorMaximo ? contadorComida : contadorMaximo;
        localStorage.setItem("high-score", contadorMaximo)
        contadorMaximoTexto.textContent = "High score: " + contadorMaximo;
    }
    
    playBoard.innerHTML = htmlMarkup;
}

function colorGrid() {
    let gridMarkup = "";
    for (let i = 1; i <= columnas; i++) {
        for (let j = 1; j <= filas; j++) {
            const isBlack = (i + j) % 2 === 0;
            const colorClass = isBlack ? "cuadricula-black" : "cuadricula-white";
            
            gridMarkup += `<div class="cuadricula ${colorClass}" style="grid-area: ${j} / ${i}"></div>`;
        }
    }
    return gridMarkup;
}

cambiarPosicionFruta();
iniciarJuego();
setInterval(iniciarJuego, 125);
document.addEventListener("keydown", cambiarDireccion);

continuar.onclick = function () {
    location.reload();
};