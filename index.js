const preguntas = [
  {
    pregunta: "Why did you change the channel? i ____ that movie",
    opciones: ["was watching", "watched", "had watched", "had been watching"],
    respuestaCorrecta: 0
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
    opciones: ["wait", "waited", "were waiting", "had waited"],
    respuestaCorrecta: 2
  },
  {
    pregunta: "Before i moved to this city, i ____ in a different country",
    opciones: ["lives", "was living", "lived", "had lived"],
    respuestaCorrecta: 2
  },
  {
    pregunta: "She ____ a new job last month.",
    opciones: ["got", "gets", "was getting", "had gotten"],
    respuestaCorrecta: 0
  },
  {
    pregunta: "He admitted that he ____ all the money from the box",
    opciones: ["took", "had taken", "was taking", "had been taking"],
    respuestaCorrecta: 1
  },
  {
    pregunta: "While i _____ my favorite song, the power went out",
    opciones: ["was listening", "listens", "had listened", "listened"],
    respuestaCorrecta: 0
  },
  {
    pregunta: "I ____ my sunglasses in the car yesterday",
    opciones: ["forget", "was forgrtting", "forgot", "had forgotten"],
    respuestaCorrecta: 2
  },
  {
    pregunta: "The company _____ a new policy last year",
    opciones: ["implemented", "implements", "had implemented", "was implementing"],
    respuestaCorrecta: 0
  },
  {
    pregunta: "She ____ her keys at the office yesterday",
    opciones: ["forgets", "had forgotten", "was forgetting", "forgot"],
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

  timerInterval = setInterval(() => {
    tiempoRestante--;
    spanTiempo.textContent = tiempoRestante;

    if (tiempoRestante <= 0) {
      clearInterval(timerInterval);
      siguientePregunta();
    }
  }, 1000);
}

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

async function finalizarJuego() {
  pantallaJuego.classList.add("hidden");
  pantallaResultados.classList.remove("hidden");

  resumenPuntaje.textContent = `${jugadorActual}, lograste ${aciertos} acierto(s) de ${preguntas.length}.`;

  // Se guarda en MySQL y luego se refresca el ranking
  await guardarEnRanking(jugadorActual, aciertos);
  await mostrarRanking();
}

// Envía el alta a la Base de Datos MySQL por la API
async function guardarEnRanking(nombre, puntos) {
  try {
    await fetch('/api/ranking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, puntos })
    });
  } catch (error) {
    console.error("Error al guardar en MySQL:", error);
  }
}

// Obtiene el ranking actualizado directo de MySQL
async function mostrarRanking() {
  tablaRanking.innerHTML = "Cargando ranking...";
  try {
    const res = await fetch('/api/ranking');
    const ranking = await res.json();

    tablaRanking.innerHTML = "";
    ranking.forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = `${entry.nombre} — ${entry.puntos} acierto(s)`;
      tablaRanking.appendChild(li);
    });
  } catch (error) {
    console.error("Error al obtener ranking:", error);
    tablaRanking.innerHTML = "Error al cargar la tabla de posiciones.";
  }
}

btnReiniciar.addEventListener("click", () => {
  pantallaResultados.classList.add("hidden");
  pantallaRegistro.classList.remove("hidden");
  inputNombre.value = "";
});

// ==========================================
// ANIMACIÓN DE PARTÍCULAS Y CURSOR
// ==========================================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let particles = [];

// Redimensionar el canvas al tamaño de la ventana
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Crear partículas al mover el mouse
window.addEventListener("mousemove", (e) => {
  for (let i = 0; i < 3; i++) {
    particles.push({
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 5 + 2,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      color: "#ffb703", // Color a juego con los botones
      alpha: 1
    });
  }
});

// Bucle de animación
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.alpha -= 0.02; // Desvanecimiento gradual

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Eliminar partículas invisibles
    if (p.alpha <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animateParticles);
}

// Inicia la animación
animateParticles();