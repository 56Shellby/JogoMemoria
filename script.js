const menu = document.getElementById("menu");
const game = document.getElementById("game");
const cardsContainer = document.querySelector(".cards");
const movesText = document.getElementById("moves");
const timeText = document.getElementById("time");

let dificuldade = null;
let colunas = 4;
let linhas = 4;
let totalPares = 8;

let cardOne = null;
let cardTwo = null;
let disableDeck = false;
let matchedCard = 0;
let moves = 0;

let tempo = 0;
let timer = null;

function selecionarDificuldade(nivel, botao) {
    dificuldade = nivel;

    document.querySelectorAll(".dif-btn").forEach(btn =>
        btn.classList.remove("active")
    );
    botao.classList.add("active");

    if (nivel === "facil") {
        colunas = 4;
        linhas = 4;
    } else if (nivel === "medio") {
        colunas = 5;
        linhas = 4;
    } else {
        colunas = 6;
        linhas = 4;
    }

    totalPares = (colunas * linhas) / 2;
}

function comecarJogo() {
    if (!dificuldade) {
        alert("Seleciona uma dificuldade!");
        return;
    }

    menu.style.display = "none";
    game.style.display = "flex";
    iniciarJogo();
    iniciarTempo();
}

function voltarMenu() {
    pararTempo();
    game.style.display = "none";
    menu.style.display = "flex";
    cardsContainer.innerHTML = "";
}

function iniciarJogo() {
    cardsContainer.innerHTML = "";
    cardsContainer.style.gridTemplateColumns = `repeat(${colunas}, 90px)`;

    matchedCard = 0;
    moves = 0;
    movesText.innerText = moves;
    cardOne = null;
    cardTwo = null;
    disableDeck = false;

    let numeros = [];
    for (let i = 1; i <= totalPares; i++) {
        numeros.push(i, i);
    }

    numeros.sort(() => Math.random() - 0.5);

    numeros.forEach(num => {
        const card = document.createElement("li");
        card.classList.add("card");

        card.innerHTML = `
            <div class="view front">
                <span class="material-icons">question_mark</span>
            </div>
            <div class="view back">
                <img src="Images/img-${num}.png">
            </div>
        `;

        card.addEventListener("click", flipCard);
        cardsContainer.appendChild(card);
    });
}

function flipCard(e) {
    const clickedCard = e.currentTarget;

    if (clickedCard === cardOne || disableDeck) return;

    clickedCard.classList.add("flip");

    if (!cardOne) {
        cardOne = clickedCard;
        return;
    }

    cardTwo = clickedCard;
    disableDeck = true;

    moves++;
    movesText.innerText = moves;

    const img1 = cardOne.querySelector("img").src;
    const img2 = cardTwo.querySelector("img").src;

    verificarPar(img1, img2);
}

function verificarPar(img1, img2) {
    if (img1 === img2) {
        matchedCard++;

        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);

        resetarCartas();

        if (matchedCard === totalPares) {
            pararTempo();
            setTimeout(() => {
                mostrarFimDeJogo();
            }, 600);
        }   

        return;
    }

    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("flip", "shake");
        cardTwo.classList.remove("flip", "shake");
        resetarCartas();
    }, 1200);
}

function resetarCartas() {
    cardOne = null;
    cardTwo = null;
    disableDeck = false;
}

function iniciarTempo() {
    pararTempo();
    tempo = 0;
    timeText.innerText = "00:00";

    timer = setInterval(() => {
        tempo++;
        const minutos = String(Math.floor(tempo / 60)).padStart(2, "0");
        const segundos = String(tempo % 60).padStart(2, "0");
        timeText.innerText = `${minutos}:${segundos}`;
    }, 1000);
}

function pararTempo() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function mostrarFimDeJogo() {
    document.getElementById("endMoves").textContent = moves;
    document.getElementById("endTime").textContent = timeText.innerText;
    document.getElementById("endDifficulty").textContent = dificuldade;

    document.getElementById("endScreen").style.display = "flex";
}


function novoJogo() {
    window.location.href = "index.html";
}

function guardarHistorico() {
    alert("Histórico guardado (exemplo)");
}



