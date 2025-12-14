// script.js
// Archivo base para el laboratorio.
// NO deben modificar el HTML ni el CSS, solo trabajar aquí.

// API pública: JSONPlaceholder
// Documentación: https://jsonplaceholder.typicode.com/ (solo lectura)
// Ejemplo de endpoint que usaremos:
//   https://jsonplaceholder.typicode.com/posts?userId=1

// Paso 1: Referencias a elementos del DOM (ya tienes los IDs definidos en index.html).
const postForm = document.getElementById("postForm");
const userIdInput = document.getElementById("userIdInput");
const rememberUserCheckbox = document.getElementById("rememberUser");
const statusArea = document.getElementById("statusArea");
const postsList = document.getElementById("postsList");
const clearResultsBtn = document.getElementById("clearResultsBtn");

// Claves para localStorage
const LAST_USER_ID_KEY = "lab_fetch_last_user_id";
const POSTS_DATA_KEY = "lab_fetch_posts_data";

// TODO 1:
// Al cargar la página:
// - Leer de localStorage el último userId usado (si existe) y colocarlo en el input.
//   Si hay valor, marcar el checkbox "rememberUser".
// - Leer de localStorage los posts guardados (si existen) y mostrarlos en la lista.
//   Si hay posts guardados, actualizar el área de estado indicando que se cargaron desde localStorage.
// Pista: window.addEventListener("DOMContentLoaded", ...)

// Al cargar la pagina (usando DOMContentLoaded)
window.addEventListener("DOMContentLoaded", () => {
    // Cargar el ultimo userId
    const lastUserId = localStorage.getItem(LAST_USER_ID_KEY);
    if (lastUserId) {
        userIdInput.value = lastUserId; // Colocarlo en el input
        rememberUserCheckbox.checked = true; // Marcar el checkbox
    }

    // Cargar las publicaciones guardadas
    const savedPosts = localStorage.getItem(POSTS_DATA_KEY);
    if (savedPosts) {
        try {
            // Convertir de JSON string a arreglo
            const posts = JSON.parse(savedPosts);
            // mostrar las publicaciones 
            renderPosts(posts);
            // actualizar estado indicando carga desde localStorage 
            statusArea.innerHTML = '<p class="status-message status-message--success">Publicaciones cargadas desde memoria local.</p>';
        } catch (error) {
            // Si hay error al parsear, eliminar
            console.error("Error al leer localStorage:", error);
            localStorage.removeItem(POSTS_DATA_KEY);
        }
    }
});

// TODO 2:
// Manejar el evento "submit" del formulario.
// - Prevenir el comportamiento por defecto.
// - Leer el valor de userId.
// - Validar que esté entre 1 y 10 (o mostrar mensaje de error).
// - Actualizar el área de estado a "Cargando..." con una clase de loading.
// - Llamar a una función que haga la petición fetch a la API.

postForm.addEventListener("submit", (event) => {
    // prevenir comportamiento por defecto 
    event.preventDefault();

    // Obtener valor numerico 
    const userId = parseInt(userIdInput.value);

    // Validar que sea entre 1 y 10
    if (isNaN(userId) || userId < 1 || userId > 10) {
        // Si no es valido, mostrar error
        statusArea.innerHTML = '<p class="status-message status-message--error">Error: Por favor ingresa un numero entre 1 y 10.</p>';
        return;
    }

    // si es valido, actualizar a "Cargando"
    statusArea.innerHTML = '<p class="status-message status-message--loading">Cargando</p>';

    // Llamar a la funcion fetch 
    fetchPostsByUser(userId);
});

// TODO 3:
// Implementar una función async que reciba el userId y:
// - Arme la URL: https://jsonplaceholder.typicode.com/posts?userId=VALOR
// - Use fetch para hacer la petición GET.
// - Valide que la respuesta sea ok (response.ok).
// - Convierta la respuesta a JSON.
// - Actualice el área de estado a "Éxito" o similar.
// - Muestre los resultados en la lista usando otra función (ver TODO 4).
// - Maneje errores (try/catch) y muestre mensaje de error en statusArea.

async function fetchPostsByUser(userId) {
    // Construir la URL 
    const url = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;

    try {
        // get de la peticion
        const response = await fetch(url);

        // Verificar response.ok
        if (!response.ok) {
            throw new Error(`Error en peticion: ${response.status}`);
        }

        // Convertir respuesta a JSON 
        const data = await response.json();

        // actualizar area de estado a exito 
        statusArea.innerHTML = '<p class="status-message status-message--success">Exito!11!!1</p>';

        // Mostrar resultados en la lista 
        renderPosts(data);

        // guardar o limpiar userId tras exito
        handleRememberUser(userId);

        } catch (error) {
            // Manejo de errores 
            statusArea.innerHTML = `<p class="status-message status-message--error">Error de conexion: ${error.message}</p>`;
    }
}

// TODO 4:
// Crear una función que reciba un arreglo de publicaciones y:
// - Limpie cualquier resultado previo en postsList.
// - Para cada post, cree un <li> con clase "post-item".
// - Dentro agregue un título (h3 o p con clase "post-title") y el cuerpo (p con clase "post-body").
// - Inserte los elementos en el DOM.
// - IMPORTANTE: Después de mostrar los posts, guardarlos en localStorage usando la clave POSTS_DATA_KEY.
//   Recuerda que localStorage solo guarda strings, así que usa JSON.stringify() para convertir el arreglo.

function renderPosts(posts) {

    // Por si posts no es un arreglo
    if (!posts || !Array.isArray(posts)) {
        console.error("Error: renderPosts esperaba un arreglo:", posts);
        statusArea.innerHTML = '<p class="status-message status-message--error">Error: Datos con formato correcto.</p>';
        return; 
    } 

    // Vaciar contenido
    postsList.innerHTML = "";

    // Recorrer el arreglo de posts 
    posts.forEach((post) => {
        // crear li con clase "post-item" 
        const li = document.createElement("li");
        li.className = "post-item";

        // crear titulo y cuerpo 
        const title = document.createElement("h3");
        title.className = "post-title";
        title.textContent = post.title;

        const body = document.createElement("p");
        body.className = "post-body";
        body.textContent = post.body;

        // Insertar titulo y cuerpo en el li 
        li.appendChild(title);
        li.appendChild(body);

        // agregar li a la lista 
        postsList.appendChild(li);
    });

        // Guardar posts en localStorage 
        // convertir a JSON string 
        localStorage.setItem(POSTS_DATA_KEY, JSON.stringify(posts));
    }

// TODO 5:
// Si el checkbox "rememberUser" esta marcado cuando se hace una consulta
// exitosa, guardar el userId en localStorage. Si no, limpiar ese valor.

function handleRememberUser(userId) {
    // si el checkbox esta marcado 
    if (rememberUserCheckbox.checked) {
        // Guardar userId 
        localStorage.setItem(LAST_USER_ID_KEY, userId);
    } else {
        // eliminar si no esta marcado 
        localStorage.removeItem(LAST_USER_ID_KEY);
    }
}

// TODO 6:
// Agregar un evento al botón "Limpiar resultados" que:
// - Vacíe la lista de publicaciones.
// - Restablezca el mensaje de estado a "Aún no se ha hecho ninguna petición."
// - Elimine los posts guardados en localStorage (usando la clave POSTS_DATA_KEY).

clearResultsBtn.addEventListener("click", () => {
  // Vaciar lista 
  postsList.innerHTML = "";

  // eliminar datos de localStorage 
  localStorage.removeItem(POSTS_DATA_KEY);

  // Restablecer mensaje
  statusArea.innerHTML = '<p class="status-message">Aun no se ha hecho ninguna peticion.</p>';
});