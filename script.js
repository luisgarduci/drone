const icon = document.querySelector("#icon")
const cadastrar = document.querySelector("#cadastrar")
const range = document.querySelector("#rangeVelocidade")
const slide_value = document.querySelector(".slide-value")
const listaComandos = document.querySelector("#listaComandos")
const container = document.querySelectorAll(".container")
const adicionar = document.querySelector("#adicionar")
const executar = document.querySelector("#executar")
range.addEventListener("change", (e) => {
   slide_value.innerHTML = e.target.value
})
 
let comando;
let form = document.querySelector("#form");
let frente = document.querySelector('.card1')
let direita = document.querySelector('.card2')
let esquerda = document.querySelector('.card3')
let tras = document.querySelector('.card4')
let rota = document.querySelector("#rota");
let tempo = document.querySelector("#tempo");
//let subir = document.querySelector("#up");
//let descer = document.querySelector("#down");
let girardireita = document.querySelector("#girardireita");
let giraresquerda = document.querySelector("#giraresquerda");
let takeoff = document.querySelector("#takeoff");
let land = document.getElementById("land")
frente.addEventListener('click', () => {
 comando = 'Forward'
})

direita.addEventListener("click", () => {
  comando = 'Right'
})

esquerda.addEventListener('click', () => {
  comando = 'Left'
})

tras.addEventListener('click', () => {
  comando = 'Backward'
})

/*subir.addEventListener('click', () => {
  comando = "Up"
})

descer.addEventListener('click', () => {
  comando = "Down"
})
*/

girardireita.addEventListener("click", () => {
  comando = "Yaw Right"
})

giraresquerda.addEventListener("click", () => {
  comando = "Yaw Left"
})


takeoff.addEventListener("click", () => {
  comando = "takeoff"
})

land.addEventListener("click", () => {
  comando = "land"
})


let vetorComandos = [];
let id = window.location.search;
let id_usuario = id.substring(4, id.length)

//Adicionando Comandos
adicionar.addEventListener("click", () => {
Velocidade = range.value;
vetorComandos.push({Comando: comando, Velocidade: Velocidade, Tempo: tempo.value})
comando = "";
   alert("Comando Adicionado")
})

//Cadastrando Rota
cadastrar.addEventListener('click', () => {
    fetch('http://127.0.0.1:8080/adicionarRota', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_usuario: id_usuario,
        NomeRota: rota.value,
        Comandos: vetorComandos
      })
    }).then(response => response.json())
      .then((data) => {
        
      })
   alert("Rota Cadastrada")
   //window.location.reload();
})

//Obtendo todos os Comandos
let index = 0;
let rotas;
let vetorteste = [];
fetch(`http://127.0.0.1:8080/rotas?id_usuario=${id_usuario}`)
.then(response => response.json())
.then((data) => {
data.forEach(element => {
    index++
    let rota = document.createElement("div")
    rota.setAttribute("class", "rotas")
    rota.setAttribute("data-post-id", element['id_rotas'])
    let NumeroRota = document.createElement("h2")
    NumeroRota.innerHTML = index;
    let NomeRota = document.createElement("h2")
    NomeRota.innerHTML = element['NomeRotas']
    rota.appendChild(NumeroRota)
    rota.appendChild(NomeRota)
    listaComandos.appendChild(rota)
})

rotas = document.querySelectorAll(".rotas")
rotas.forEach(rota => {
  rota.addEventListener("click", (e) => {
    vetorteste = [];
    let id_rota = rota.getAttribute("data-post-id");
     for (let i = 0; i < rotas.length; i++) {
      rotas[i].style.border = "1px solid black"
    }
    e.currentTarget.style.border = "5px solid blue"
    fetch(`http://127.0.0.1:8080/selecionarComandos?id_rota=${id_rota}`)
    .then(response => response.json())
    .then((data) => {
      vetorteste.push(data)
    })
  })
})

})

executar.addEventListener("click", () => {
  fetch(`http://127.0.0.1:8080/executar-rota`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vetorteste
    })
  })
  .then(response => response.json())
  .then((data) => {
    vetorteste = [];
  })
})
