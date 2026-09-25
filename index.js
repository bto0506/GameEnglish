// ========================================================
// AQUÍ EDITAS TUS 10 PREGUNTAS Y OPCIONES
// respuestaCorrecta es el índice de la opción (0=A, 1=B, 2=C, 3=D)
// ========================================================
const preguntas = [
  {
    pregunta: "Why did you change the channel? i ____ that movie",
    opciones: [
      "was watching",
      "watched",
      "had watched",
      "had been watching"
    ],
    respuestaCorrecta: 0 // Cambia al índice correcto (0, 1, 2 o 3)
  },
  {
    pregunta: "When i _____ out of the shower the lights ______",
    opciones: [
      "got / were getting off",
      "was getting / went off",
      "had got / were getting off",
      "had been getting / had got off"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: " While they _____ for the bus,it started raining",
    opciones: [
      "wait",
      "waited",
      "were waiting",
      "had waited"
    ],
    respuestaCorrecta: 2
  },
  {
    pregunta: "Before i moved to this city, i ____ in a different country",
    opciones: [
      "lives",
      "was living",
      "lived",
      "had lived"
    ],
    respuestaCorrecta: 2
  },
  {
    pregunta: "She ____ a new job last month.",
    opciones: [
      "got",
      "gets",
      "was getting",
      "had gotten"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "He admitted that he ____ all the money from the box",
    opciones: [
      "took",
      "had taken",
      "was taking",
      "had been taking"
    ],
    respuestaCorrecta: 1
  },
  {
    pregunta: "While i _____ my favorite song, the power went out",
    opciones: [
      "was listening",
      "listens",
      "had listened",
      "listened"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "I ____ my sunglasses in the car yesterday",
    opciones: [
      "forget",
      "was forgrtting",
      "forgot",
      "had forgotten"
    ],
    respuestaCorrecta: 2
  },
  {
    pregunta: "The company _____ a new policy last year",
    opciones: [
      "implemented",
      "implements",
      "had implemented",
      "was implementing"
    ],
    respuestaCorrecta: 0
  },
  {
    pregunta: "She ____ her keys at the office yesterday",
    opciones: [
      "forgets",
      "had forgotten",
      "was forgetting",
      "forgot"
    ],
    respuestaCorrecta: 3
  }
];

// Variables del juego
let jugadorActual = "";
let preguntaActualIndex = 0;
let aciertos = 0;
let tiempoRestante = 10;
let timerInterval = null;

// Elementos del DOM
const pantallaRegistro = document.getElementById("pantalla-registro");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaResultados = document.getElementById("pantalla-resultados");

const inputNombre = document.getElementById("nombre-jugador");
const btnIniciar = document.getElementById("btn-iniciar");
const btnReiniciar = document.getElementById("btn-reiniciar");

const textoPregunta = document.getElementById("texto-pregunta");
const botonesOpciones = document.querySelectorAll(".btn-opcion");
const spanNumPregunta = document.getElementById("num-pregunta");
const spanTiempo = document.getElementById("tiempo");
const resumenPuntaje = document.getElementById("resumen-puntaje");
const tablaRanking = document.getElementById("tabla-ranking");

// Iniciar juego
btnIniciar.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  if (!nombre) {
    alert("Por favor ingresa un nombre para jugar.");
    return;
  }
  jugadorActual = nombre;
  pantallaRegistro.classList.add("hidden");
  pantallaJuego.classList.remove("hidden");
  
  preguntaActualIndex = 0;
  aciertos = 0;
  cargarPregunta();
});

function cargarPregunta() {
  clearInterval(timerInterval);
  tiempoRestante = 10;
  spanTiempo.textContent = tiempoRestante;

  const q = preguntas[preguntaActualIndex];
  spanNumPregunta.textContent = `Pregunta ${preguntaActualIndex + 1}/${preguntas.length}`;
  textoPregunta.textContent = q.pregunta;

  botonesOpciones.forEach((btn, index) => {
    btn.textContent = q.opciones[index];
  });

  // Iniciar temporizador de 10 segundos
  timerInterval = setInterval(() => {
    tiempoRestante--;
    spanTiempo.textContent = tiempoRestante;

    if (tiempoRestante <= 0) {
      clearInterval(timerInterval);
      siguientePregunta(); // Si se acaba el tiempo pasa a la siguiente (no suma punto)
    }
  }, 1000);
}

// Escuchar respuesta elegida
botonesOpciones.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const opcionSeleccionada = parseInt(e.target.getAttribute("data-indice"));
    const respuestaCorrecta = preguntas[preguntaActualIndex].respuestaCorrecta;

    if (opcionSeleccionada === respuestaCorrecta) {
      aciertos++;
    }

    clearInterval(timerInterval);
    siguientePregunta();
  });
});

function siguientePregunta() {
  preguntaActualIndex++;
  if (preguntaActualIndex < preguntas.length) {
    cargarPregunta();
  } else {
    finalizarJuego();
  }
}

function finalizarJuego() {
  pantallaJuego.classList.add("hidden");
  pantallaResultados.classList.remove("hidden");

  resumenPuntaje.textContent = `${jugadorActual}, lograste ${aciertos} acierto(s) de ${preguntas.length}.`;

  guardarEnRanking(jugadorActual, aciertos);
  mostrarRanking();
}

// Guardar resultados en la mini BD (localStorage)
function guardarEnRanking(nombre, puntos) {
  let ranking = JSON.parse(localStorage.getItem("ranking_trivia")) || [];
  
  // Agregar o actualizar el resultado del usuario
  ranking.push({ nombre: nombre, puntos: puntos, fecha: new Date().toLocaleDateString() });

  // Ordenar de mayor a menor puntaje (puesto 1, 2, 3...)
  ranking.sort((a, b) => b.puntos - a.puntos);

  // Guardar maximo los top 10
  ranking = ranking.slice(0, 10);

  localStorage.setItem("ranking_trivia", JSON.stringify(ranking));
}

function mostrarRanking() {
  tablaRanking.innerHTML = "";
  const ranking = JSON.parse(localStorage.getItem("ranking_trivia")) || [];

  ranking.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.nombre} — ${entry.puntos} acierto(s)`;
    tablaRanking.appendChild(li);
  });
}

btnReiniciar.addEventListener("click", () => {
  pantallaResultados.classList.add("hidden");
  pantallaRegistro.classList.remove("hidden");
  inputNombre.value = "";
});