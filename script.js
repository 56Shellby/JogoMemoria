const menu = document.getElementById("menu");
const game = document.getElementById("game");
const cardsContainer = document.querySelector(".cards");
const movesText = document.getElementById("moves");
const timeText = document.getElementById("time");
const somVirarCarta = new Audio("sounds/flip.mp3");
somVirarCarta.volume = 0.05;

const soundRight = new Audio("sounds/right.mp3");
const soundWrong = new Audio("sounds/wrong.mp3");
const soundWin   = new Audio("sounds/win.mp3");

soundRight.volume = 0.4;
soundWrong.volume = 0.4;
soundWin.volume   = 0.5;

const utilizadorLogado = localStorage.getItem("utilizadorLogado");

if (!utilizadorLogado) {
    window.location.href = "login.html";
} else {
    const usernameDisplay = document.getElementById("usernameDisplay");
    if (usernameDisplay) {
        usernameDisplay.textContent = utilizadorLogado;
    }
}

function logout() {
    localStorage.removeItem("utilizadorLogado");
    window.location.href = "login.html";
}

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

let jogadorAtual = 1;
let pontosP1 = 0;
let pontosP2 = 0;
let modoJogo = "single";

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("slider");
    const thumb = document.getElementById("thumb");
    const modoLabel = document.getElementById("modoLabel");

    slider.addEventListener("click", () => {
        if (modoJogo === "single") {
            modoJogo = "multi";
            thumb.style.left = "98px";
            modoLabel.textContent = "Multiplayer";
        } else {
            modoJogo = "single";
            thumb.style.left = "2px";
            modoLabel.textContent = "Singleplayer";
        }
    });

    document.getElementById("scoreboard").style.display = "none";
});

function atualizarScoreboard() {
    document.getElementById("p1score").textContent = pontosP1;
    document.getElementById("p2score").textContent = pontosP2;

    document.getElementById("p1").classList.remove("active");
    document.getElementById("p2").classList.remove("active");

    if (jogadorAtual === 1) {
        document.getElementById("p1").classList.add("active");
        document.getElementById("turnoAtual").textContent = "Vez do Jogador 1";
    } else {
        document.getElementById("p2").classList.add("active");
        document.getElementById("turnoAtual").textContent = "Vez do Jogador 2";
    }
}

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
    document.getElementById("homeLayout").style.display = "none";
    if (!dificuldade) {
        alert("Seleciona uma dificuldade!");
        return;
    }

    if (modoJogo === "multi") {
        document.getElementById("scoreboard").style.display = "block";
        atualizarScoreboard();
    } else {
        document.getElementById("scoreboard").style.display = "none";
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

    document.getElementById("homeLayout").style.display = "flex";

    cardsContainer.innerHTML = "";
}

function iniciarJogo() {
    jogadorAtual = 1;
    pontosP1 = 0;
    pontosP2 = 0;

    if (modoJogo === "multi") atualizarScoreboard();

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

    somVirarCarta.currentTime = 0;
    somVirarCarta.play();

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

        soundRight.currentTime = 0;
        soundRight.play();

        matchedCard++;

        if (modoJogo === "multi") {
            if (jogadorAtual === 1) pontosP1++;
            else pontosP2++;
            atualizarScoreboard();
        }

        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);

        resetarCartas();

        if (matchedCard === totalPares) {
            pararTempo();

            soundWin.currentTime = 0;
            soundWin.play();

            setTimeout(() => {
                mostrarFimDeJogo();
            }, 600);
        }

        return;
    }

    soundWrong.currentTime = 0;
    soundWrong.play();

    if (modoJogo === "multi") {
        jogadorAtual = jogadorAtual === 1 ? 2 : 1;
        atualizarScoreboard();
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
    document.getElementById("endScreen").style.display = "flex";

    const singleStats = document.getElementById("singleplayerStats");
    const multiStats = document.getElementById("multiplayerStats");
    const btnGuardar = document.getElementById("btnGuardar");

    if (modoJogo === "single") {
        singleStats.style.display = "block";
        multiStats.style.display = "none";
        btnGuardar.style.display = "inline-block";

        document.getElementById("endMoves").textContent = moves;
        document.getElementById("endTime").textContent = timeText.innerText;
        document.getElementById("endDifficulty").textContent = dificuldade;

    } else {
        singleStats.style.display = "none";
        multiStats.style.display = "block";
        btnGuardar.style.display = "none";

        document.getElementById("endP1Score").textContent = pontosP1;
        document.getElementById("endP2Score").textContent = pontosP2;

        const vencedor = document.getElementById("vencedor");

        if (pontosP1 > pontosP2) {
            vencedor.textContent = "🏆 Venceu o Jogador 1!";
        } else if (pontosP2 > pontosP1) {
            vencedor.textContent = "🏆 Venceu o Jogador 2!";
        } else {
            vencedor.textContent = "🤝 Empate!";
        }
    }
}

function novoJogo() {
    window.location.href = "index.html";
}

function guardarHistorico() {
    if (modoJogo === "multi") {
        alert("Estatísticas não são guardadas em multiplayer.");
        return;
    }
    const nomeUtilizador = localStorage.getItem("utilizadorLogado");

    if (!nomeUtilizador) {
        alert("Nenhum utilizador autenticado!");
        return;
    }

    const historico = {
        utilizador: nomeUtilizador,
        jogadas: moves,
        tempo: timeText.innerText,
        dificuldade: dificuldade,
        modo: modoJogo,
        data: new Date().toLocaleDateString("pt-PT")
    };

    let historicos = JSON.parse(localStorage.getItem("historicoJogos")) || [];
    historicos.push(historico);

    localStorage.setItem("historicoJogos", JSON.stringify(historicos));

    alert("Histórico guardado com sucesso!");
}

function carregarEstatisticasPessoais() {
    const utilizador = localStorage.getItem("utilizadorLogado");
    const tbody = document.getElementById("personalTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (!utilizador) {
        tbody.innerHTML = `<tr><td colspan="5">Não autenticado</td></tr>`;
        return;
    }

    const historicos = JSON.parse(localStorage.getItem("historicoJogos")) || [];
    const meusJogos = historicos.filter(j => j.utilizador === utilizador);

    if (meusJogos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">Sem jogos registados</td></tr>`;
        return;
    }

    meusJogos.forEach(jogo => {
        tbody.innerHTML += `
            <tr>
                <td>${jogo.tempo}</td>
                <td>${jogo.jogadas}</td>
                <td>${jogo.dificuldade}</td>
                <td>${jogo.modo}</td>
                <td>${jogo.data}</td>
            </tr>
        `;
    });
}


function carregarEstatisticasGlobais() {
    const tbody = document.getElementById("globalTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const historicos = JSON.parse(localStorage.getItem("historicoJogos")) || [];

    if (historicos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">Sem dados</td></tr>`;
        return;
    }

    historicos.forEach(jogo => {
        tbody.innerHTML += `
            <tr>
                <td>${jogo.utilizador}</td>
                <td>${jogo.tempo}</td>
                <td>${jogo.jogadas}</td>
                <td>${jogo.dificuldade}</td>
                <td>${jogo.modo}</td>
                <td>${jogo.data}</td>
            </tr>
        `;
    });
}


document.addEventListener("DOMContentLoaded", () => {
    carregarEstatisticasPessoais();
    carregarEstatisticasGlobais();
});
