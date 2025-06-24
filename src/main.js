import './style.css'
import { PeliculasEndpoint, apiKey, ImagenEndpoint } from './endpoints.js'




// Initial state
const userPrefersSpanish = navigator.language && navigator.language.startsWith('es');
const savedLanguage = localStorage.getItem('language');
const initialLanguage = savedLanguage || (userPrefersSpanish ? 'Español' : 'Inglés');

// Apply initial language
document.documentElement.setAttribute('data-language', initialLanguage);

// Texto en ingles y español
const texts = {
  'Español': {
    welcome: 'Bienvenido a PeliculasAPP',
    changeLanguage: 'Cambiar a Inglés',
    viewMovies: 'Ver Películas',
    returnLanguage: 'Ver Categorías'
  },
  'Inglés': {
    welcome: 'Welcome to MoviesAPP',
    changeLanguage: 'Change to Spanish',
    viewMovies: 'View Movies',
    returnLanguage: 'Return to Categories'
  }
};

const generateStars = (voteAverage) => {
  const fullStars = Math.floor(voteAverage / 2);
  const halfStar = (voteAverage % 2) >= 1 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>';
  }
  if (halfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>';
  }
  return starsHtml;
};


// creamos la estructura de la pagina 
const app = document.querySelector('#app');
const header = document.createElement('header');
const mainContent = document.createElement('main');
const footer = document.createElement('footer');

let currentLanguage = initialLanguage;



// Cambiar idioma 
const cambiarIdioma = () => {
 currentLanguage = currentLanguage === 'Español' ? 'Inglés' : 'Español';
 localStorage.setItem('language', currentLanguage);
 document.documentElement.setAttribute('data-language', currentLanguage);
  updateUI();
};


// Actualiza el texto del header y contenido de acuerdo al lenguaje seleccionado
const updateUI = () => {
  const header = document.querySelector('header');
  if (header) { // valida si existe la etiqueta header
    header.innerHTML = `
      <h1>${texts[currentLanguage].welcome}</h1>
      <button id="categorias-btn" class="language-btn" >${texts[currentLanguage].returnLanguage}</button>
      <button id="language-btn" class="language-btn" >${texts[currentLanguage].changeLanguage}</button>
    `;
    // Se movieron al metodo UpdateUI para que se vuelva a asociar el evento click
    //  despues de renderizar el header
    const btnCategorias = document.querySelector('#categorias-btn');
    const languageBtn = document.querySelector('#language-btn');
    if (btnCategorias) {
      btnCategorias.addEventListener('click',getGeneros);
    }
    if (languageBtn) {
      languageBtn.addEventListener('click',cambiarIdioma);
    }
  }


  // Volver a realizar la petición con el lenguaje seleccionado
  const moviePages = document.querySelector('#generos-peliculas');
  if (moviePages) {
    getPeliculasPorGenero(localStorage.getItem('generoId'));
  }else{
     getGeneros();
  }
};

// Opciones de la petición. La Api pide key de autenticación
const options ={
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
};

// Obtener los Generos de las peliculas
const getGeneros =()=>
  {
    // De acuerdo al lenguaje seleccionado se realiza la petición a la API
    const apiLanguage = currentLanguage === 'Español' ? 'es' : 'en';
    
    // URL de la API -- endpoint generos
    fetch(PeliculasEndpoint.generos(apiLanguage), options)
    // Respuesta de la API se convierte a JSON
    .then((res)=>res.json())
    // Imprimir el json en consola
    .then((data)=>{
      console.log(data);
      // Limpiar el contenido de mainContent
      mainContent.innerHTML = '';
      const generosContainer = document.createElement('div');
      generosContainer.id = 'generos-container';
      generosContainer.className="generos";
      mainContent.appendChild(generosContainer);

      data.genres.forEach((generos)=>{
        //tarjeta de genero de pelicula 
        // El id del boton se genera de acuerdo al id del genero
        generosContainer.innerHTML +=`
        <div class="card">
          <h2>${generos.name}</h2>
          <p><button id="${generos.id}" name="btn-${generos.id}" class="btn language-btn">${texts[currentLanguage].viewMovies}</button></p>
        </div>
        `
      })
      
      // Agregar evento click a los botones pasando el id de genero
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach((btn)=>{
        btn.addEventListener('click',()=>{
          getPeliculasPorGenero(btn.id);
          localStorage.setItem('generoId', btn.id);
        })
      })
    })
    // si hay errores imprimirlos en consola
    .catch((err)=>console.error(err));
  }

// Obtener detalle de las películas
const getDetallesPelicula= (id)=>{
    console.log(id);
  }

//Inyectar HTML


app.appendChild(header);
app.appendChild(mainContent);
app.appendChild(footer);


// Para cargar los generos de las peliculas
updateUI();

// Hacer la funcion global
window.cambiarIdioma = cambiarIdioma;

const getPeliculasPorGenero =(id)=>
  {
    // Get language code for API
  const apiLanguage = currentLanguage === 'Español' ? 'es-ES' : 'en-US';
    
    // Limpiar contenido de main-content
    mainContent.innerHTML = '';
      const generosContainer = document.createElement('div');
      generosContainer.id = 'generos-peliculas';
      generosContainer.className="peliculas";
      mainContent.appendChild(generosContainer);
    // URL de la API -- endpoint
    fetch(PeliculasEndpoint.peliculasCategoria(id, apiLanguage), options)
    // Respuesta de la API se convierte a JSON
    .then((res)=>res.json())
    // Imprimir el json en consola
    .then((data)=>{
      console.log(data);
      data.results.forEach((pelicula)=>{
        //tarjeta de peliculas
        generosContainer.innerHTML +=`
        <div class="card">
          <img src="${ImagenEndpoint.base}/${pelicula.poster_path}" alt="${pelicula.title}">
          <h2>${pelicula.title}</h2>
          <p>${pelicula.overview}</p>
          <div class="movie-info">
            <div class="rating">
              ${generateStars(pelicula.vote_average)}
              <span>${pelicula.vote_average.toFixed(1)}</span>
            </div>
            <div class="votes">
              <i class="fas fa-heart"></i>
              <span>${pelicula.vote_count}</span>
            </div>
          </div>
        </div>
        `
      })
      // Agrega el evento click a los botones
      const movieCards = document.querySelectorAll('.card');
      movieCards.forEach((card) => {
        card.addEventListener('click', () => {
          getDetallesPelicula(pelicula.id);
        });
      });
    })
    // si hay errores imprimirlos en consola
    .catch((err)=>console.error(err));


  }