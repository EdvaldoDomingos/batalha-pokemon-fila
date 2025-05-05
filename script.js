let queue = [];
let ranking = [];
let bossName = "charizard";
let boss = null;

const attackSound = new Audio("attack.mp3");

async function fetchPokemon(nameOrId) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
  const data = await res.json();
  return {
    name: data.name,
    img: data.sprites.front_default,
    type: data.types[0].type.name,
    power: data.base_experience
  };
}

async function loadBoss(name = "charizard") {
  bossName = name;
  boss = await fetchPokemon(name);
  document.getElementById("boss-img").src = boss.img;
  document.getElementById("boss-info").innerText = `Tipo: ${boss.type} | Poder: ${boss.power}`;
}

function loadRankingFromStorage() {
  const stored = localStorage.getItem("ranking");
  if (stored) {
    ranking = JSON.parse(stored);
    updateRankingDisplay();
  }
}

function saveRankingToStorage() {
  localStorage.setItem("ranking", JSON.stringify(ranking));
}

async function addPlayer() {
  const randomId = Math.floor(Math.random() * 151) + 1;
  const player = await fetchPokemon(randomId);
  queue.push(player);
  updateQueueDisplay();
}

function updateQueueDisplay() {
  const list = document.getElementById("queue-list");
  list.innerHTML = "";
  queue.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${p.name} (${p.type})`;
    list.appendChild(li);
  });
}

function updateRankingDisplay() {
  const list = document.getElementById("ranking-list");
  list.innerHTML = "";
  ranking.forEach((name, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${name}`;
    list.appendChild(li);
  });
}

function simulateBattle() {
  if (queue.length === 0) {
    alert("Nenhum desafiante na fila!");
    return;
  }

  const challenger = queue.shift();
  updateQueueDisplay();

  attackSound.play();

  const bossImg = document.getElementById("boss-img");
  bossImg.classList.add("animate-battle");
  setTimeout(() => bossImg.classList.remove("animate-battle"), 900);

  const winChance = challenger.power / (challenger.power + boss.power);
  const victory = Math.random() < winChance;

  const resultDiv = document.getElementById("battle-result");
  resultDiv.innerHTML = `
    <p>${challenger.name} (${challenger.type}) desafia ${boss.name}!</p>
    <img src="${challenger.img}" />
    <p>${victory ? "🏆 Vitória!" : "❌ Derrota!"}</p>
  `;

  if (victory) {
    ranking.push(challenger.name);
    saveRankingToStorage();
    updateRankingDisplay();
  }
}

function resetRanking() {
  if (confirm("Tem certeza que deseja resetar o ranking?")) {
    ranking = [];
    localStorage.removeItem("ranking");
    updateRankingDisplay();
  }
}

document.getElementById("add-player").addEventListener("click", addPlayer);
document.getElementById("fight").addEventListener("click", simulateBattle);
document.getElementById("reset-ranking").addEventListener("click", resetRanking);
document.getElementById("boss-select").addEventListener("change", (e) => loadBoss(e.target.value));

loadBoss();
loadRankingFromStorage();
